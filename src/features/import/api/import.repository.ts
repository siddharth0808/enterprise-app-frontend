import { apiRequest } from '../../../services/api/apiClient';
import { ApiError, GENERIC_ERROR_MESSAGE } from '../../../services/api/apiError';
import type { ApiErrorBody } from '../../../services/api/api.types';
import type {
  ImportRecord,
  Invoice,
  InvoiceProducts,
  UploadInvoice,
} from '../types/import.types';
import type { Product } from '../../inventory/types/product.types';

// A dedicated multipart POST helper, kept local to this feature: the
// invoice file upload needs `multipart/form-data`, which the shared
// `apiClient` (JSON-only) doesn't support. It mirrors apiClient's auth
// handling and error normalization so behavior stays consistent.
export async function uploadToS3<T>(path: string, file: File): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: 'PUT',
      body: file,
    });
    console.log("uploadTos3:::", response)
  } catch {
    throw new ApiError('Unable to reach the server. Check your connection and try again.');
  }

  if (!response.ok) {
    const errorBody: ApiErrorBody = await response.json().catch(() => ({}));
    throw new ApiError(errorBody.message ?? GENERIC_ERROR_MESSAGE, response.status, errorBody.code);
  }

  return response as T;
}

export function uploadInvoice(file: File): Promise<UploadInvoice> {
  const payload = {
    fileName: file.name,
    contentType: file.type,
    fileSize: file.size
  }
  return apiRequest<UploadInvoice>(`/invoices`, {
    method: 'POST',
    body: payload,
  });
}

export function updateInvoiceStatus(invoiceId: string): Promise<{invoiceId:string, status:string}> {
  return apiRequest<{invoiceId:string, status:string}>(`/invoices/${invoiceId}/status`, {
    method: 'POST',
    body: {},
  });
}

export function getInvoiceStatus(invoiceId: string): Promise<{invoiceId:string, status:string}> {
  return apiRequest<{invoiceId:string, status:string}>(`/invoices/${invoiceId}/status`, {
    method: 'GET'
  });
}

export function getInvoiceReview(invoiceId: string): Promise<Invoice> {
  return apiRequest<Invoice>(`/invoices/${invoiceId}/review`, {
    method: 'GET'
  });
}

// export function analyzeInvoice(file: File): Promise<AnalyzeInvoiceResult> {
//   const formData = new FormData();
//   formData.append('invoice', file);
//   return postMultipart<AnalyzeInvoiceResult>('/imports/analyze', formData);
// }

export function confirmImport(payload: InvoiceProducts[]): Promise<Product[]> {
  return apiRequest<Product[]>(`/products/import`, {
    method: 'POST',
    body: payload,
  });
}

export function getImportHistory(): Promise<ImportRecord[]> {
  return apiRequest<ImportRecord[]>('/imports/history');
}
