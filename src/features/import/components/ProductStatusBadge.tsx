import { StatusBadge, type BadgeTone } from '../../../components/common/StatusBadge';
import type { ReviewStatus } from '../types/import.types';

const STATUS_META: Record<ReviewStatus, { label: string; tone: BadgeTone }> = {
  ready: { label: 'Ready', tone: 'success' },
  needs_info: { label: 'Needs Info', tone: 'warning' },
  warning: { label: 'Warning', tone: 'danger' },
};

interface ProductStatusBadgeProps {
  status: ReviewStatus;
}

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  const meta = STATUS_META[status];
  return <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>;
}
