import styled from 'styled-components';
import { Logo } from './Logo';
import { media } from '../../styles/breakpoints';

const Bar = styled.header`
  display: none;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(4)};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 20;

  ${() => media.tabletDown`
    display: flex;
  `}
`;

export function Header() {
  return (
    <Bar>
      <Logo />
    </Bar>
  );
}
