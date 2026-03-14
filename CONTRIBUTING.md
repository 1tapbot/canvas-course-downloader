# Contributing to Canvas Course Downloader

Thanks for your interest in contributing! Here's how to get started.

## Getting Started

1. Fork and clone the repository
2. Load the extension in your browser (`chrome://extensions` > Developer mode > Load unpacked)
3. Make your changes and test on a Canvas LMS site

## Development

The extension is plain JavaScript with no build step. Edit the files, reload the extension, and refresh your Canvas page.

The content scripts are loaded in order and share a global scope:

- `helpers.js` — Pure utility functions (sanitization, parsing, color math)
- `detector.js` — Canvas page and course detection
- `canvas-api.js` — Canvas REST API communication with retry and pagination
- `ui.js` — All UI components (buttons, toasts, progress panel, course selector overlay)
- `downloader.js` — Download orchestration, ZIP bundling, settings management
- `content.js` — Entry point, SPA navigation handling, message routing
- `background.js` — Service worker that processes the download queue
- `popup.js` / `options.js` — Extension popup and settings page

Unit tests for the helper functions are in `tests/test-helpers.html` (open it in a browser to run).

## Pull Requests

- Keep PRs focused on a single change
- Test on at least one Canvas LMS instance before submitting
- Update the README if you add new features

## Reporting Issues

When reporting bugs, please include:
- Your browser and version
- The Canvas instance URL (or just whether it's Instructure-hosted or self-hosted)
- Steps to reproduce the issue
- Any errors from the browser console (`F12` > Console tab)

## Code Style

- Use `const` / `let` (no `var`)
- Use descriptive function and variable names
- Add a brief comment for non-obvious logic
- Keep functions focused — one job per function
