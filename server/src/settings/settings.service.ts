import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertSettingDto } from './dto/upsert-setting.dto';

@Injectable()
export class SettingsService {
    constructor(private prisma: PrismaService) { }

    // Public — returns everything as a flat { key: value } map,
    // easier for the frontend to consume than an array of rows.
    async findAllAsMap() {
        const settings = await this.prisma.siteSetting.findMany();
        return settings.reduce<Record<string, string>>((acc, s) => {
            acc[s.key] = s.value;
            return acc;
        }, {});
    }

    // ---- Admin ----

    findAll() {
        return this.prisma.siteSetting.findMany({ orderBy: { key: 'asc' } });
    }

    async upsert(key: string, dto: UpsertSettingDto) {
        return this.prisma.siteSetting.upsert({
            where: { key },
            create: { key, value: dto.value },
            update: { value: dto.value },
        });
    }

    async remove(key: string) {
        const existing = await this.prisma.siteSetting.findUnique({ where: { key } });
        if (!existing) throw new NotFoundException(`Setting "${key}" not found`);

        return this.prisma.siteSetting.delete({ where: { key } });
    }
}