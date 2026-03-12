/**
 * Background service worker for Canvas Course Downloader.
 *
 * Receives batches of file download requests from the content script
 * and processes them sequentially to avoid overwhelming the browser.
 */

const downloadQueue = [];
let isProcessing = false;
let totalQueued = 0;
let completedCount = 0;
let failedCount = 0;

function updateBadge() {
  const remaining = downloadQueue.length + (isProcessing ? 1 : 0);
  if (remaining > 0) {
    chrome.action.setBadgeText({ text: String(remaining) });
    chrome.action.setBadgeBackgroundColor({ color: "#e82429" });
  } else {
    chrome.action.setBadgeText({ text: "" });
  }
}

function notifyCompletion() {
  chrome.notifications.create("download-complete", {
    type: "basic",
    iconUrl: "icons/icon-128.png",
    title: "Canvas Course Downloader",
    message: `Downloads finished: ${completedCount} succeeded${failedCount > 0 ? `, ${failedCount} failed` : ""}.`,
  });
  totalQueued = 0;
  completedCount = 0;
  failedCount = 0;
}

// Keyboard shortcut handler
chrome.commands.onCommand.addListener((command) => {
  if (command !== "download-current") return;
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab) return;
    chrome.tabs.sendMessage(tab.id, { action: "get_status" }, (response) => {
      if (chrome.runtime.lastError || !response?.isCanvas) return;
      const action = response.courseId ? "trigger_download" : "open_course_selector";
      chrome.tabs.sendMessage(tab.id, { action });
    });
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== "START_DOWNLOAD") return;

  const { files, courseName } = message.payload;
  const safeName = courseName.replace(/[/\\?%*:|"<>]/g, "-");

  const items = files.map((file) => ({
    ...file,
    path: `${safeName}/${file.path}`.replace(/\/+/g, "/"),
  }));

  downloadQueue.push(...items);
  totalQueued += items.length;
  updateBadge();

  if (!isProcessing) processQueue();

  sendResponse({ status: "queued", count: items.length });
});

function processQueue() {
  if (downloadQueue.length === 0) {
    isProcessing = false;
    updateBadge();
    if (totalQueued > 0) notifyCompletion();
    return;
  }

  isProcessing = true;
  const item = downloadQueue.shift();

  const sanitizedName = item.filename.replace(/[/\\?%*:|"<>]/g, "-");
  let fullPath = `${item.path}${sanitizedName}`;
  if (fullPath.startsWith("/")) fullPath = fullPath.substring(1);

  chrome.downloads.download(
    { url: item.url, filename: fullPath, conflictAction: "uniquify" },
    (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error("[Canvas Downloader] Download failed:", chrome.runtime.lastError.message, fullPath);
        failedCount++;
      } else {
        completedCount++;
      }
      updateBadge();
      // Small delay between downloads to avoid overwhelming the browser
      setTimeout(processQueue, downloadId ? 250 : 500);
    }
  );
}
