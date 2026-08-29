import styled from 'styled-components';
import { Button } from '../../../components/common/Button';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatFileSize } from '../utils/fileValidation';
import type { InvoiceFileMeta } from '../types/import.types';

const Panel = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ theme }) => theme.spacing(6)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
`;

const Title = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const MetaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const MetaLabel = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const MetaValue = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: right;
  overflow-wrap: anywhere;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

function formatFormatLabel(mimeType: string): string {
  if (mimeType === 'application/pdf') return 'PDF';
  if (mimeType === 'image/jpeg') return 'JPG';
  if (mimeType === 'image/png') return 'PNG';
  return mimeType;
}

interface InvoiceFileCardProps {
  fileMeta: InvoiceFileMeta;
  onAnalyze: () => void;
  onCancel: () => void;
  isAnalyzing?: boolean;
}

export function InvoiceFileCard({ fileMeta, onAnalyze, onCancel, isAnalyzing }: InvoiceFileCardProps) {
  return (
    <Panel>
      <Title>File Information</Title>
      <MetaList>
        <MetaRow>
          <MetaLabel>Filename</MetaLabel>
          <MetaValue>{fileMeta.name}</MetaValue>
        </MetaRow>
        <MetaRow>
          <MetaLabel>File Size</MetaLabel>
          <MetaValue>{formatFileSize(fileMeta.size)}</MetaValue>
        </MetaRow>
        <MetaRow>
          <MetaLabel>Format</MetaLabel>
          <MetaValue>{formatFormatLabel(fileMeta.type)}</MetaValue>
        </MetaRow>
        <MetaRow>
          <MetaLabel>Status</MetaLabel>
          <StatusBadge tone="success">✓ Ready to process</StatusBadge>
        </MetaRow>
      </MetaList>
      <Actions>
        <Button type="button" $fullWidth onClick={onAnalyze} disabled={isAnalyzing}>
          {isAnalyzing ? 'Analyzing…' : 'Analyze Invoice'}
        </Button>
        <Button type="button" $variant="secondary" $fullWidth onClick={onCancel} disabled={isAnalyzing}>
          Cancel
        </Button>
      </Actions>
    </Panel>
  );
}
