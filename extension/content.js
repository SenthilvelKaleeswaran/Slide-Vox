// Constants for website matching
const URL_CHATGPT = "https://chatgpt.com";

const websites = [URL_CHATGPT];

const websiteSelector = {
  [URL_CHATGPT]: 'div[data-message-author-role="user"][data-message-id]',
};

const buttonPosition = {
  [URL_CHATGPT]: "prepend",
};

function injectReactScript() {

  if (document.querySelector("#button-accessor-script")) {
    console.log("React script already injected. Exiting.");
    return;
  }

  const script = document.createElement("script");
  script.id = "button-accessor-script";
  script.src = chrome.runtime.getURL("/button-accessor.js");
  script.type='module'
  script.onload = () => {
    console.log("React script loaded.");
  };
  document.head.appendChild(script);
}

window.addEventListener("message", (event) => {
  if (event.data) {
    const { type, payload } = event.data;
    console.log("Received message from React:", type, payload);
    if (type === "generateSlides") {
      console.log("generateSlides payload:", payload);

      fetch("https://g2pxfjv2-5000.inc1.devtunnels.ms/api/slides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((response) => {
          console.log("API response:", response);
          sendResponse({ data: response });
        })
        .catch((error) => {
          console.error("API error:", error.message);
          sendResponse({ error: error.message });
        });
    }
    // chrome.runtime.sendMessage({ type: type, data: payload }, (response) => {
    //   console.log("Response from background:", response);
    //   if (chrome.runtime.lastError) {
    //     console.error("Error:", chrome.runtime.lastError.message);
    //     return;
    //   }
    //   console.log("Response from background:", response);
    // });
  }

  console.log("Slides response from background:", event);
});

// Initial setup
document.addEventListener("DOMContentLoaded", () => {
  injectReactScript();

  // Set up MutationObserver for dynamic content
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        // processChatMessages();
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});

injectReactScript()
