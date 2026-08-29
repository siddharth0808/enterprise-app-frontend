// Redux state must stay serializable, but the workflow needs to carry the
// actual File object across a few route changes (Upload -> Analyze). This
// tiny in-memory holder does that; Redux only ever stores the file's
// metadata (name/size/type) for display.
let selectedFile: File | null = null;

export function setSelectedInvoiceFile(file: File | null): void {
  selectedFile = file;
}

export function getSelectedInvoiceFile(): File | null {
  return selectedFile;
}
