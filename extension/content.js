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
  }
  document.head.appendChild(script);

}

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
