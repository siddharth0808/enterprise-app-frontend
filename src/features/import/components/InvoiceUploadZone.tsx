import { useRef, useState, type DragEvent } from 'react';
import styled from 'styled-components';
import { Button } from '../../../components/common/Button';
import { ACCEPTED_INVOICE_EXTENSIONS } from '../utils/fileValidation';

const Card = styled.div`
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ theme }) => theme.spacing(12)};
`;

const DragZone = styled.div<{ $isDragActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(10)};
  border: 2px dashed
    ${({ theme, $isDragActive }) => ($isDragActive ? theme.colors.primary : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme, $isDragActive }) => ($isDragActive ? theme.colors.primarySoft : 'transparent')};
  transition: border-color 0.15s ease, background-color 0.15s ease;
`;

const IconBadge = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.base};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const HiddenInput = styled.input`
  display: none;
`;

const FormatHint = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2.5)};
  margin-top: ${({ theme }) => theme.spacing(8)};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing(2.5)};
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const InfoIcon = styled.span`
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

const ErrorBanner = styled.div`
  background: ${({ theme }) => theme.colors.dangerSoft};
  border: 1px solid ${({ theme }) => theme.colors.dangerBorder};
  color: ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing(3)};
  font-size: ${({ theme }) => theme.font.size.sm};
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

interface InvoiceUploadZoneProps {
  onFileSelected: (file: File) => void;
  error?: string | null;
}

export function InvoiceUploadZone({ onFileSelected, error }: InvoiceUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  };

  return (
    <Card>
      <DragZone
        $isDragActive={isDragActive}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragActive(true);
        }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={handleDrop}
      >
        <IconBadge>
          <UploadCloudIcon />
        </IconBadge>
        <Title>Upload Distributor Invoice</Title>
        <Subtitle>Drag and drop your invoice here or</Subtitle>
        <Button type="button" $variant="secondary" onClick={() => inputRef.current?.click()}>
          Choose File
        </Button>
        <HiddenInput
          ref={inputRef}
          type="file"
          accept={ACCEPTED_INVOICE_EXTENSIONS}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onFileSelected(file);
            event.target.value = '';
          }}
        />
        <FormatHint>Supported formats: PDF, JPG, PNG · Maximum file size: 10 MB</FormatHint>
      </DragZone>

      {error && <ErrorBanner role="alert">{error}</ErrorBanner>}

      <InfoBlock>
        <InfoItem>
          <InfoIcon>
            <InfoIconSvg />
          </InfoIcon>
          <span>Your invoice will be analyzed to detect products, quantities, and prices.</span>
        </InfoItem>
        <InfoItem>
          <InfoIcon>
            <LockIcon />
          </InfoIcon>
          <span>Your document is securely processed and associated only with your business.</span>
        </InfoItem>
      </InfoBlock>
    </Card>
  );
}

function UploadCloudIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M16 16l-4-4-4 4M12 12v9M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoIconSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
