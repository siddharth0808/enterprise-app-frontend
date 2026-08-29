export const ACCEPTED_INVOICE_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg','image/png'];
export const ACCEPTED_INVOICE_EXTENSIONS = '.pdf,.jpg,.jpeg,.png';
export const MAX_INVOICE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export function validateInvoiceFile(file: File): string | undefined {
  if (!ACCEPTED_INVOICE_TYPES.includes(file.type)) {
    return 'Unsupported file type. Please upload a PDF, JPG, or PNG.';
  }
  if (file.size > MAX_INVOICE_SIZE_BYTES) {
    return 'File is too large. Maximum size is 10 MB.';
  }
  return undefined;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
