import { useEffect, useMemo } from 'react';
import styled from 'styled-components';

const Panel = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ theme }) => theme.spacing(6)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  height: 100%;
`;

const Header = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const PreviewArea = styled.div`
  flex: 1;
  min-height: 480px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const PlaceholderBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const PlaceholderLabel = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.sm};
`;

interface InvoicePreviewProps {
  file: File;
}

export function InvoicePreview({ file }: InvoicePreviewProps) {
  const isImage = file.type.startsWith('image/');
  const imageUrl = useMemo(() => (isImage ? URL.createObjectURL(file) : null), [file, isImage]);

  // useEffect(() => {
  //   return () => {
  //     if (imageUrl) URL.revokeObjectURL(imageUrl);
  //   };
  // }, [imageUrl]);

  return (
    <Panel>
      <Header>Document Preview</Header>
      <PreviewArea>
        {isImage && imageUrl ? (
          <PreviewImage src={imageUrl} alt={file.name} />
        ) : (
          <PlaceholderBlock>
            <FileIcon />
            <PlaceholderLabel>{file.name}</PlaceholderLabel>
          </PlaceholderBlock>
        )}
      </PreviewArea>
    </Panel>
  );
}

function FileIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
