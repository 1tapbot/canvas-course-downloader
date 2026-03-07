# Contributing to Canvas Course Downloader

Thanks for your interest in contributing! Here's how to get started.

## Getting Started

1. Fork and clone the repository
2. Load the extension in Chrome via `chrome://extensions` > Developer mode > Load unpacked
3. Make your changes and test on a Canvas LMS site

## Development

The extension is pure JavaScript with no build step or dependencies. Just edit the files and reload the extension in Chrome.

**Key files:**

- `content.js` — Main logic: Canvas detection, API calls, download orchestration, and the course selector UI
- `background.js` — Service worker that processes the download queue
- `popup.js` / `popup.html` — The small popup shown when you click the extension icon

## Pull Requests

- Keep PRs focused on a single change
- Test on at least one Canvas LMS instance before submitting
- Update the README if you add new features

## Reporting Issues

When reporting bugs, please include:
- Your Chrome version
- The Canvas instance URL (or just whether it's Instructure-hosted or self-hosted)
- Steps to reproduce the issue
- Any errors from the browser console (`F12` > Console tab)

## Code Style

- Use `const` / `let` (no `var`)
- Use descriptive function and variable names
- Add a brief comment for non-obvious logic
- Keep functions focused — one job per function
