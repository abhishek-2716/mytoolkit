/**
 * Trigger a file download from a URL by creating a temporary anchor.
 * The browser must allow the URL (same-origin or pre-signed cloud URL).
 */
export function downloadFile(url: string, filename?: string): void {
  const anchor = document.createElement('a')
  anchor.href = url
  if (filename) anchor.download = filename
  anchor.rel = 'noopener noreferrer'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}

/**
 * Trigger a file download from a Blob / File object.
 * The object URL is revoked immediately after the click to free memory.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  downloadFile(url, filename)
  // Delay revocation so the browser has time to initiate the download
  setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 100)
}
