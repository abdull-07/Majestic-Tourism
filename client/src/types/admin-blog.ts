export interface AdminBlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    coverImage: string | null;
    status: 'DRAFT' | 'PUBLISHED';
    metaTitle: string | null;
    metaDescription: string | null;
    publishedAt: string | null;
    createdAt: string;
    author: { fullName: string };
}

export interface BlogPostFormValues {
    title: string;
    content: string;
    coverImage: string;
    status: 'DRAFT' | 'PUBLISHED';
    metaTitle: string;
    metaDescription: string;
}