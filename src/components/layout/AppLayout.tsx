import type { ReactNode } from 'react';
import styled from 'styled-components';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNavigation } from './MobileNavigation';
import { useAppDispatch } from '../../app/store/hooks';
import { signOut } from '../../features/auth/store/authSlice';
import { media } from '../../styles/breakpoints';

const Shell = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const Main = styled.main`
  flex: 1;
  min-width: 0;
  padding: ${({ theme }) => theme.spacing(10)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};

  ${() => media.tabletDown`
    padding: 20px;
    padding-bottom: 88px;
  `}
`;

const MainColumn = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const dispatch = useAppDispatch();

  const handleSignOut = () => {
    dispatch(signOut());
  };

  return (
    <Shell>
      <Sidebar onSignOut={handleSignOut} />
      <MainColumn>
        <Header />
        <Main>{children}</Main>
        <MobileNavigation onSignOut={handleSignOut} />
      </MainColumn>
    </Shell>
  );
}
