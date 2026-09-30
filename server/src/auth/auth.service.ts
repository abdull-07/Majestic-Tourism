import { Injectable, ConflictException, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private mailService: MailService,
    ) { }

    async register(dto: RegisterDto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing) {
            throw new ConflictException('An account with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                fullName: dto.fullName,
                phone: dto.phone,
            },
        });

        const token = crypto.randomBytes(32).toString('hex');
        await this.prisma.emailVerificationToken.create({
            data: { token, userId: user.id, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
        });
        await this.mailService.sendVerificationEmail(user.email, user.fullName, token);

        return this.generateTokens(user);
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

        if (!user || !user.isActive) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordValid = await bcrypt.compare(dto.password, user.password);
        if (!passwordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Unverified accounts can still log in (product decision) — the frontend
        // shows a reminder banner using `isEmailVerified` in the response instead.
        return this.generateTokens(user);
    }

    async verifyEmail(token: string) {
        const record = await this.prisma.emailVerificationToken.findUnique({ where: { token } });

        if (!record || record.expiresAt < new Date()) {
            throw new BadRequestException('This verification link is invalid or has expired');
        }

        await this.prisma.user.update({ where: { id: record.userId }, data: { isEmailVerified: true } });
        await this.prisma.emailVerificationToken.delete({ where: { id: record.id } });

        return { message: 'Email verified successfully' };
    }

    async resendVerification(userId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');
        if (user.isEmailVerified) throw new ConflictException('Email is already verified');

        await this.prisma.emailVerificationToken.deleteMany({ where: { userId } });
        const token = crypto.randomBytes(32).toString('hex');
        await this.prisma.emailVerificationToken.create({
            data: { token, userId, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
        });
        await this.mailService.sendVerificationEmail(user.email, user.fullName, token);

        return { message: 'Verification email resent' };
    }

    async refreshToken(token: string) {
        const stored = await this.prisma.refreshToken.findUnique({ where: { token }, include: { user: true } });

        if (!stored || stored.expiresAt < new Date()) {
            throw new UnauthorizedException('Refresh token expired or invalid');
        }

        await this.prisma.refreshToken.delete({ where: { id: stored.id } });
        return this.generateTokens(stored.user);
    }

    async logout(userId: string) {
        await this.prisma.refreshToken.deleteMany({ where: { userId } });
        return { message: 'Logged out successfully' };
    }

    private async generateTokens(user: { id: string; email: string; role: string; fullName: string; isEmailVerified: boolean }) {
        const payload = { sub: user.id, email: user.email, role: user.role };

        const accessToken = this.jwtService.sign(payload, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' });
        const refreshTokenValue = this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' });

        await this.prisma.refreshToken.create({
            data: { token: refreshTokenValue, userId: user.id, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
        });

        return {
            accessToken,
            refreshToken: refreshTokenValue,
            user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName, isEmailVerified: user.isEmailVerified },
        };
    }
}