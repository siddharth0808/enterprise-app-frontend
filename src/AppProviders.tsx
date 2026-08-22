import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { store } from './app/store/store';
import { theme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <BrowserRouter>{children}</BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}
