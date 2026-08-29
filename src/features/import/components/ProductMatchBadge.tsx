import { StatusBadge, type BadgeTone } from '../../../components/common/StatusBadge';
import type { MatchType } from '../types/import.types';

const MATCH_META: Record<MatchType, { label: string; tone: BadgeTone }> = {
  EXISTING: { label: '✓ Existing', tone: 'neutral' },
  NEW: { label: '+ New', tone: 'success' },
  NEEDS_REVIEW: { label: '⚠ Needs Review', tone: 'warning' },
  CANNOT_MATCH: { label: '✕ Cannot Match', tone: 'danger' },
};

interface ProductMatchBadgeProps {
  matchType: MatchType;
}

export function ProductMatchBadge({ matchType }: ProductMatchBadgeProps) {
  const meta = MATCH_META[matchType];
  return <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>;
}
