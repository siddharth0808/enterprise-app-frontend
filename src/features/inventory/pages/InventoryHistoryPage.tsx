import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Loader } from "../../../components/common/Loader";
import { ErrorState } from "../../../components/common/ErrorState";
import { EmptyState } from "../../../components/common/EmptyState";
import { useAppDispatch, useAppSelector } from "../../../app/store/hooks";
import { fetchProductById, fetchProducts } from "../store/inventorySlice";
import { fetchTransactionHistory } from "../store/transactionSlice";
import { TransactionHistoryTable } from "../components/TransactionHistoryTable";
import { TransactionHistoryCardList } from "../components/TransactionHistoryCardList";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};
  width: 100%;
`;

const SummaryBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(4)};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ theme }) => theme.spacing(5)} ${({ theme }) => theme.spacing(6)};
  flex-wrap: wrap;
`;

const SummaryFields = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(8)};
`;

const SummaryField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SummaryLabel = styled.span`
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SummaryValue = styled.span`
  font-size: ${({ theme }) => theme.font.size.base};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CurrentStockBlock = styled.div`
  text-align: right;
`;

export default function InventoryHistoryPage() {
const { productId = "" } = useParams<{ productId: string}>();
  const [searchParams] = useSearchParams();
  const isFromRow = searchParams.get("fromRow");  
    const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const product = useAppSelector((state) =>
    state.inventory.products.find((item) => item.id === productId),
  );
  const listStatus = useAppSelector((state) => state.inventory.status);
  const transactions = useAppSelector(
    (state) => state.transactions.historyByProductId[productId],
  );
  const historyStatus = useAppSelector(
    (state) => state.transactions.historyStatus,
  );
  const historyError = useAppSelector(
    (state) => state.transactions.historyError,
  );

  useEffect(() => {
    if (!product && listStatus === "idle") {
      dispatch(fetchProducts());
    } else if (!product && listStatus !== "loading") {
      dispatch(fetchProductById(productId));
    }
  }, [product, listStatus, productId, dispatch]);

  useEffect(() => {
    dispatch(fetchTransactionHistory({productId}));
  }, [productId, dispatch]);

    const onBack = (route:string) =>{
    if(isFromRow === 'true') return navigate(`/inventory`)
    return navigate(route)
  }

  const renderBody = () => {
    if (historyStatus === "loading" || historyStatus === "idle") {
      return <Loader label="Loading history…" />;
    }
    if (historyStatus === "failed") {
      return (
        <ErrorState
          message={historyError ?? "Failed to load history."}
          onRetry={() => dispatch(fetchTransactionHistory(productId))}
        />
      );
    }
    if (!transactions || transactions.length === 0) {
      return (
        <EmptyState
          title="No transactions yet"
          description="Adjustments to this product's stock will appear here once recorded."
        />
      );
    }
    return (
      <>
        <TransactionHistoryTable transactions={transactions} />
        <TransactionHistoryCardList transactions={transactions} />
      </>
    );
  };

  return (
    <Content>
      <PageHeader
        title="Inventory History"
        subtitle={
          product
            ? `Transaction records of ${product.name}${product.batchNumber ? ` (${product.batchNumber})` : ""}`
            : undefined
        }
        onBack={() =>
          onBack(product ? `/products/${product.id}` : "/inventory")
        }
      />

      {product && (
        <SummaryBar>
          <SummaryFields>
            <SummaryField>
              <SummaryLabel>Product Name</SummaryLabel>
              <SummaryValue>{product.name}</SummaryValue>
            </SummaryField>
            <SummaryField>
              <SummaryLabel>Batch No.</SummaryLabel>
              <SummaryValue>{product.batchNumber || "—"}</SummaryValue>
            </SummaryField>
          </SummaryFields>
          <CurrentStockBlock>
            <SummaryLabel>Current Stock</SummaryLabel>
            <SummaryValue>{product.currentStock} Units</SummaryValue>
          </CurrentStockBlock>
        </SummaryBar>
      )}

      {renderBody()}
    </Content>
  );
}
