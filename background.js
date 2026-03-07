/**
 * Background service worker for Canvas Course Downloader.
 *
 * Receives batches of file download requests from the content script
 * and processes them sequentially to avoid overwhelming the browser.
 */

const downloadQueue = [];
let isProcessing = false;

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== "START_DOWNLOAD") return;

  const { files, courseName } = message.payload;
  const safeName = courseName.replace(/[/\\?%*:|"<>]/g, "-");

  const items = files.map((file) => ({
    ...file,
    path: `${safeName}/${file.path}`.replace(/\/+/g, "/"),
  }));

  downloadQueue.push(...items);

  if (!isProcessing) processQueue();

  sendResponse({ status: "queued", count: items.length });
});

function processQueue() {
  if (downloadQueue.length === 0) {
    isProcessing = false;
    return;
  }

  isProcessing = true;
  const item = downloadQueue.shift();

  const sanitizedName = item.filename.replace(/[/\\?%*:|"<>]/g, "-");
  let fullPath = `${item.path}${sanitizedName}`;
  if (fullPath.startsWith("/")) fullPath = fullPath.substring(1);

  chrome.downloads.download(
    { url: item.url, filename: fullPath, conflictAction: "overwrite" },
    (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error("[Canvas Downloader] Download failed:", chrome.runtime.lastError.message, fullPath);
      }
      // Small delay between downloads to avoid overwhelming the browser
      setTimeout(processQueue, downloadId ? 250 : 500);
    }
  );
}
