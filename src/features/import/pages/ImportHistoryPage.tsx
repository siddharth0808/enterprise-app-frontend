import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { PageHeader } from '../../../components/layout/PageHeader';
import { Button } from '../../../components/common/Button';
import { Loader } from '../../../components/common/Loader';
import { ErrorState } from '../../../components/common/ErrorState';
import { EmptyState } from '../../../components/common/EmptyState';
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { fetchImportHistory } from '../store/importSlice';
import { ImportHistoryTable } from '../components/ImportHistoryTable';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
  width: 100%;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const BreadcrumbCurrent = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

export default function ImportHistoryPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { history, historyStatus, historyError } = useAppSelector((state) => state.import);

  useEffect(() => {
    dispatch(fetchImportHistory());
  }, [dispatch]);

  const renderBody = () => {
    if (historyStatus === 'loading' || historyStatus === 'idle') {
      return <Loader label="Loading import history…" />;
    }
    if (historyStatus === 'failed') {
      return (
        <ErrorState
          message={historyError ?? 'Failed to load import history.'}
          onRetry={() => dispatch(fetchImportHistory())}
        />
      );
    }
    if (history.length === 0) {
      return (
        <EmptyState
          title="No imports yet"
          description="Invoice imports you complete will show up here for reference."
        />
      );
    }
    return <ImportHistoryTable records={history} />;
  };

  return (
    <Content>
      <Breadcrumb>
        <span>Inventory</span>
        <span aria-hidden="true">›</span>
        <BreadcrumbCurrent>Import History</BreadcrumbCurrent>
      </Breadcrumb>

      <PageHeader
        title="Import History"
        subtitle="Review past distributor invoice imports and match progress"
        action={
          <Button type="button" $variant="secondary" onClick={() => navigate('/inventory')}>
            Back to Inventory
          </Button>
        }
      />

      {renderBody()}
    </Content>
  );
}
