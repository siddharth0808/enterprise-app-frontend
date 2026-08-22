import styled from 'styled-components';

const Card = styled.section`
  width: 100%;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ theme }) => theme.spacing(6)};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)};
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  font-size: ${({ theme }) => theme.font.size.lg};
  flex-shrink: 0;
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const Email = styled.p`
  margin: 0;
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Label = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

interface AccountInfoCardProps {
  email: string;
}

export function AccountInfoCard({ email }: AccountInfoCardProps) {
  const initial = email.trim().charAt(0).toUpperCase() || '?';

  return (
    <Card>
      <Avatar>{initial}</Avatar>
      <InfoBlock>
        <Email>{email}</Email>
        <Label>Signed in with email</Label>
      </InfoBlock>
    </Card>
  );
}
