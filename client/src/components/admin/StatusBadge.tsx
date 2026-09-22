const STATUS_STYLES: Record<string, string> = {
    PENDING: 'bg-tertiary-fixed text-tertiary',
    CONFIRMED: 'bg-primary-fixed text-primary',
    COMPLETED: 'bg-secondary-fixed text-secondary',
    CANCELLED: 'bg-error-container text-error',
    EXPIRED: 'bg-surface-container-high text-text-muted',
    VERIFIED: 'bg-primary-fixed text-primary',
    FAILED: 'bg-error-container text-error',
    REFUNDED: 'bg-surface-container-high text-text-muted',
    APPROVED: 'bg-primary-fixed text-primary',
    REJECTED: 'bg-error-container text-error',
};

export default function StatusBadge({ status }: { status: string }) {
    return (
        <span className={`inline-flex px-2 py-0.5 rounded-full label ${STATUS_STYLES[status] || 'bg-surface-container-high text-text-muted'}`}>
            {status}
        </span>
    );
}