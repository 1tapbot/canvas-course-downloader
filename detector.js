/**
 * Canvas Course Downloader — Canvas Detection
 *
 * Identifies whether the current page is a Canvas LMS instance,
 * extracts course IDs, and determines page type.
 */

// ---------------------------------------------------------------------------
// Canvas Detection Helpers
// ---------------------------------------------------------------------------

/** Mount-point selectors used for Canvas detection and button injection, ordered by reliability. */
const CANVAS_SELECTORS = [
  "#application",
  ".ic-app",
  "#wrapper",
  "#main",
  'meta[name="csrf-token"]',
];

/** Breadcrumb / header selectors for button injection, tried in order. */
const MOUNT_SELECTORS = [
  "#breadcrumbs",
  ".ic-app-nav-toggle-and-crumbs",
  ".ic-app-crumbs",
];

/** Dashboard header selectors for the home-page button, tried in order. */
const DASHBOARD_SELECTORS = [
  "#breadcrumbs",
  ".ic-app-nav-toggle-and-crumbs",
  "#dashboard_header_container .ic-Dashboard-header__actions",
  "#dashboard_header_container",
  ".ic-Dashboard-header",
  "#content",
];

function isCanvas() {
  if (window.location.hostname.includes("instructure.com")) return true;
  return CANVAS_SELECTORS.some((sel) => document.querySelector(sel) !== null);
}

function getCourseId() {
  const match = window.location.pathname.match(/\/courses\/(\d+)/);
  return match ? match[1] : null;
}

function isCanvasHomepage() {
  return isCanvas() && !getCourseId();
}

function getCourseName() {
  const breadcrumb = document.querySelector('.ic-app-crumbs a[href*="/courses/"]');
  if (breadcrumb) return breadcrumb.textContent.trim();

  const title = document.querySelector("title");
  if (title) return title.textContent.split(":")[0].trim();

  return `Course_${getCourseId()}`;
}

/**
 * Finds the first matching mount point from a list of selectors.
 * Returns null if none match (graceful degradation).
 */
function findMountPoint(selectors) {
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) return el;
  }
  return null;
}
