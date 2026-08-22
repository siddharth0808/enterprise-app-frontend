import { AppRouter } from './app/router/AppRouter';
import { useAppInitialization } from './hooks/useAppInitialization';

export default function App() {
  useAppInitialization();
  return <AppRouter />;
}
