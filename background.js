chrome.runtime.onInstalled.addListener(() => {
  console.log('Autoplay Control Extension Installed');
});

// Function to toggle autoplay and block media requests
function toggleAutoplay(enable) {
  chrome.webRequest.onBeforeRequest.removeListener(handleRequest);
  
  if (!enable) {
    // Block requests for media resources
    chrome.webRequest.onBeforeRequest.addListener(
      handleRequest,
      { urls: ["*://*/*.mp4", "*://*/*.webm", "*://*/*.ogg", "*://*/*.avi", "*://*/*.mov", "*://*/*.mkv"] },
      ["blocking"]
    );
  }

  // Update the autoplay setting in the content scripts
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (enableAutoplay) => {
          const metaTags = document.querySelectorAll('meta[http-equiv="X-Content-Security-Policy"]');
          metaTags.forEach(meta => {
            if (enableAutoplay) {
              meta.content = meta.content.replace(/autoplay\s*no/, 'autoplay yes');
            } else {
              meta.content = meta.content.replace(/autoplay\s*yes/, 'autoplay no');
            }
          });
        },
        args: [enable]
      });
    });
  });
}

// Function to handle and block media requests
function handleRequest(details) {
  return { cancel: true };
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleAutoplay') {
    toggleAutoplay(request.enable);
    sendResponse({ status: 'success' });
  }
});
