import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { resetApplicationState } from "../../../app/store/actions";
import { fetchProducts } from "../../inventory/store/inventorySlice";
import * as importRepository from "../api/import.repository";
import type {
  DetectedProduct,
  ImportRecord,
  ImportResultData,
  ImportSummary,
  Invoice,
  InvoiceFileMeta,
  InvoiceMeta,
  InvoiceProducts,
} from "../types/import.types";

interface ImportState {
  fileMeta: InvoiceFileMeta | null;
  fileError: string | null;

  invoiceId: string;
  invoice: Invoice;
  summary: ImportSummary | null;
  products: DetectedProduct[];
  invoiceProducts: InvoiceProducts[];

  analyzeStatus: string; //'idle' | 'loading' | 'succeeded' | 'failed';
  analyzeError: string | null;

  confirmStatus: "idle" | "loading" | "succeeded" | "failed";
  confirmError: string | null;
  result: ImportResultData | null;

  historyStatus: "idle" | "loading" | "succeeded" | "failed";
  historyError: string | null;
  history: ImportRecord[];
}

const initialState: ImportState = {
  fileMeta: null,
  fileError: null,
  invoiceId: "",
  invoice: {
    invoiceDate:'',
    invoiceNumber:'',
    products:[],
    supplier:{
      address:'',
      contact:'',
      gstin:'',
      name:''
    },
    total:0
  },
  summary: null,
  products: [],
  invoiceProducts: [],
  analyzeStatus: "idle",
  analyzeError: null,
  confirmStatus: "idle",
  confirmError: null,
  result: null,
  historyStatus: "idle",
  historyError: null,
  history: [],
};

/**
 * A row is "Ready" only once it has everything needed to write a product
 * and a stock transaction. Any existing detection warnings keep it flagged
 * until the user clears them by editing the row.
 */
// function computeReviewStatus(
//   product: DetectedProduct,
// ): DetectedProduct["status"] {
//   if (product.matchType === "CANNOT_MATCH") return "warning";
//   if (product.warnings.length > 0) return "warning";
//   const missingRequired =
//     !product.name.trim() ||
//     product.costPrice <= 0 ||
//     product.sellingPrice <= 0 ||
//     product.quantity <= 0;
//   return missingRequired ? "needs_info" : "ready";
// }

export const analyzeInvoice = createAsyncThunk(
  "import/analyzeInvoice",
  async (file: File, { rejectWithValue }) => {
    try {
      const uploadInvoiceRes = await importRepository.uploadInvoice(file);
      if (uploadInvoiceRes.status === "CREATED" && uploadInvoiceRes.uploadUrl) {
        const res: any = await importRepository.uploadToS3(
          uploadInvoiceRes.uploadUrl,
          file,
        );
        if (res.ok) {
          const res = await importRepository.updateInvoiceStatus(
            uploadInvoiceRes.invoiceId,
          );
          return res;
        }
      }
      return { invoiceId: "", status: "FAILED" };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to analyze invoice",
      );
    }
  },
);

export const getInvoiceStatus = createAsyncThunk(
  "import/getInvoiceStatus",
  async (invoiceId: string, { rejectWithValue }) => {
    try {
      const res = await importRepository.getInvoiceStatus(invoiceId);
      return res;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to analyze invoice",
      );
    }
  },
);

export const getInvoiceReview = createAsyncThunk(
  "import/getInvoiceReview",
  async (invoiceId: string, { rejectWithValue }) => {
    try {
      const res = await importRepository.getInvoiceReview(invoiceId);
      return res;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to analyze invoice",
      );
    }
  },
);

export const confirmImport = createAsyncThunk(
  "import/confirmImport",
  async (_: void, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as { import: ImportState };
    const { invoiceId, invoice } = state.import;
    if (!invoiceId) {
      return rejectWithValue("Nothing to import - please start over.");
    }

    try {
      const result = await importRepository.confirmImport(invoice.products);
      // The backend creates/updates products and their stock transactions;
      // refresh the local product list so Inventory reflects the import
      // immediately without the user needing to reload.
      dispatch(fetchProducts());
      return result;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to import inventory",
      );
    }
  },
);

export const fetchImportHistory = createAsyncThunk(
  "import/fetchHistory",
  async (_: void, { rejectWithValue }) => {
    try {
      return await importRepository.getImportHistory();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to load import history",
      );
    }
  },
);

const importSlice = createSlice({
  name: "import",
  initialState,
  reducers: {
    fileSelected(state, action: PayloadAction<InvoiceFileMeta>) {
      state.fileMeta = action.payload;
      state.fileError = null;
      state.analyzeStatus = "idle";
      state.analyzeError = null;
    },
    fileRejected(state, action: PayloadAction<string>) {
      state.fileMeta = null;
      state.fileError = action.payload;
    },
    clearFile(state) {
      state.fileMeta = null;
      state.fileError = null;
    },
    // Clears everything except import history - used to start a fresh
    // import or leave the flow.
    resetImportWorkflow() {
      return { ...initialState };
    },
    // toggleProductSelected(state, action: PayloadAction<string>) {
    //   const product = state.products.find((item) => item.id === action.payload);
    //   if (product) product.selected = !product.selected;
    // },
    // toggleSelectAll(state, action: PayloadAction<boolean>) {
    //   state.products.forEach((product) => {
    //     product.selected = action.payload;
    //   });
    // },
    removeProduct(state, action: PayloadAction<string>) {
      state.invoice.products = state.invoice.products.filter(
        (product) => product.id !== action.payload,
      );
    },
    // bulkRemoveSelected(state) {
    //   state.products = state.products.filter((product) => !product.selected);
    // },
    // bulkMarkAsNew(state) {
    //   state.products.forEach((product) => {
    //     if (!product.selected) return;
    //     product.matchType = "NEW";
    //     product.matchedProductId = null;
    //     product.status = computeReviewStatus(product);
    //   });
    // },
    // changeProductMatch(
    //   state,
    //   action: PayloadAction<{
    //     id: string;
    //     matchedProductId: string | null;
    //     matchedName?: string;
    //   }>,
    // ) {
    //   const product = state.products.find(
    //     (item) => item.id === action.payload.id,
    //   );
    //   if (!product) return;
    //   product.matchedProductId = action.payload.matchedProductId;
    //   product.matchType = action.payload.matchedProductId ? "EXISTING" : "NEW";
    //   if (action.payload.matchedProductId && action.payload.matchedName) {
    //     product.name = action.payload.matchedName;
    //   }
    //   product.warnings = [];
    //   product.status = computeReviewStatus(product);
    // },
    updateDetectedProduct(
      state,
      action: PayloadAction<{ id: string; changes: Partial<DetectedProduct> }>,
    ) {
      const product = state.invoice.products.find(
        (item) => item.id === action.payload.id,
      );
      if (!product) return;
      state.invoice.products = state.invoice.products.map((product)=>{
        if(product.id === action.payload.id){
          product =  {...product,...action.payload.changes }
        }
        return product
      })
      // Object.assign(product, action.payload.changes);
      // product.status = computeReviewStatus(product);
    },
    clearConfirmError(state) {
      state.confirmError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeInvoice.pending, (state) => {
        state.analyzeStatus = "loading";
        state.analyzeError = null;
      })
      .addCase(analyzeInvoice.fulfilled, (state, action) => {
        state.analyzeStatus = action.payload.status;
        state.invoiceId = action.payload.invoiceId;
        state.analyzeError = null;
      })
      .addCase(analyzeInvoice.rejected, (state, action) => {
        state.analyzeStatus = "failed";
        state.analyzeError =
          (action.payload as string) ?? "Failed to analyze invoice";
      })
      .addCase(getInvoiceStatus.pending, (state, action) => {
        state.analyzeError = null;
      })
      .addCase(getInvoiceStatus.fulfilled, (state, action) => {
        state.analyzeStatus = action.payload.status;
        state.invoiceId = action.payload.invoiceId;
        state.analyzeError = null;
      })
      .addCase(getInvoiceStatus.rejected, (state, action) => {
        state.analyzeStatus = "failed";
        state.analyzeError =
          (action.payload as string) ?? "Failed to analyze invoice";
      })
      .addCase(getInvoiceReview.pending, (state, action) => {
        state.analyzeError = null;
      })
      .addCase(getInvoiceReview.fulfilled, (state, action) => {
        state.invoice = action.payload;
        state.analyzeError = null;
      })
      .addCase(getInvoiceReview.rejected, (state, action) => {
        state.invoiceProducts = [];
        state.analyzeError =
          (action.payload as string) ?? "Failed to analyze invoice";
      })

      .addCase(confirmImport.pending, (state) => {
        state.confirmStatus = "loading";
        state.confirmError = null;
      })
      .addCase(confirmImport.fulfilled, (state, action) => {
        state.confirmStatus = "succeeded";
        state.result = action.payload;
      })
      .addCase(confirmImport.rejected, (state, action) => {
        state.confirmStatus = "failed";
        state.confirmError =
          (action.payload as string) ?? "Failed to import inventory";
      })
      .addCase(fetchImportHistory.pending, (state) => {
        state.historyStatus = "loading";
        state.historyError = null;
      })
      .addCase(fetchImportHistory.fulfilled, (state, action) => {
        state.historyStatus = "succeeded";
        state.history = action.payload;
      })
      .addCase(fetchImportHistory.rejected, (state, action) => {
        state.historyStatus = "failed";
        state.historyError =
          (action.payload as string) ?? "Failed to load import history";
      })
      .addCase(resetApplicationState, () => initialState);
  },
});

export const {
  fileSelected,
  fileRejected,
  clearFile,
  resetImportWorkflow,
  // toggleProductSelected,
  // toggleSelectAll,
  removeProduct,
  // bulkRemoveSelected,
  // bulkMarkAsNew,
  // changeProductMatch,
  updateDetectedProduct,
  clearConfirmError,
} = importSlice.actions;
export default importSlice.reducer;
