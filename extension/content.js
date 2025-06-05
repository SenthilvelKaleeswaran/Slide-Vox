// Constants for website matching
const URL_CHATGPT = "https://chatgpt.com";
const URL_MISTRAL = "https://www.mistral.ai";
const URL_PERPLEXITY = "https://www.perplexity.ai";

const websites = [URL_CHATGPT, URL_MISTRAL, URL_PERPLEXITY];

const websiteSelector = {
  [URL_CHATGPT]: 'div[data-message-author-role="assistant"][data-message-id]',
  [URL_MISTRAL]: "div.message-user",
  [URL_PERPLEXITY]: "div.user-message",
};

const buttonPosition = {
  [URL_CHATGPT]: "prepend",
  [URL_MISTRAL]: "prepend",
  [URL_PERPLEXITY]: "prepend",
};

const waitUntilListenerReady = (targetDiv, callback) => {
  const checkReady = () => {
    // Check data-button-injected on the parent messageDiv
    const messageDiv = targetDiv.closest('div[data-message-author-role="assistant"][data-message-id]');
    const aaa = messageDiv?.getAttribute("data-button-injected") === "true";
    console.log({ aaa });
    if (aaa) {
      console.log("Listener is ready.");
      callback();
    } else {
      console.log("Waiting for listener to be ready...");
      setTimeout(checkReady, 1000);
    }
  };
  checkReady();
};

const retry = (callback, maxRetries = 5, delay = 1000) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const tryCallback = () => {
      const result = callback();
      attempts++;

      console.log("result:",  result );

      if (result) {
        console.log(`Found element after ${attempts} attempt(s).`);
        resolve(result);
      } else if (attempts < maxRetries) {
        console.log(`Element not found, retrying (${attempts}/${maxRetries})...`);
        setTimeout(tryCallback, delay);
      } else {
        console.error(`Failed to find element after ${maxRetries} attempts.`);
        reject(new Error(`Failed to find element after ${maxRetries} attempts.`));
      }
    };

    tryCallback();
  });
};

const sendMessage = (message) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
};

async function injectReactScript() {
  if (document.querySelector("#button-accessor-script")) {
    console.log("React script already injected. Exiting.");
    return;
  }

  const getConversationId = () => {
    const url = window.location.href;
    if (url.includes(URL_CHATGPT)) {
      return url.split("/")[4];
    } else if (url.includes(URL_MISTRAL)) {
      return url.split("/")[4];
    }
  };

  const script = document.createElement("script");
  script.id = "button-accessor-script";
  script.src = chrome.runtime.getURL("/button-accessor.js");
  script.type = "module";
  script.onload = async () => {
    console.log("React script loaded.", window.location);
    const conversationId = getConversationId();
    if (!conversationId) {
      console.error("No conversationId found.");
      return;
    }

    try {
      const response = await sendMessage({
        type: "getSlidesByConversationId",
        data: { conversationId },
      });

      console.log("Response from background in content.js:", response);

      const data = response.data;
      const error = response.error;

      console.log("data:", data);
      console.log("error:", error);

      if (data && data.length > 0) {
        const mappedData = data.reduce((acc, item) => {
          if (item && item.messageId) {
            if (!acc[item.messageId]) {
              acc[item.messageId] = [];
            }
            acc[item.messageId].push(item);
          } else {
            console.warn("Item missing messageId:", item);
          }
          return acc;
        }, {});

        console.log("mappedData:", { mappedData });

        for (const [messageId, slides] of Object.entries(mappedData)) {
          const findDiv = () => {
            const messageDiv = document.querySelector(`div[data-message-author-role="assistant"][data-message-id="${messageId}"]`);
            return messageDiv;
          };
          try {
            const targetDiv = await retry(findDiv, 5, 1000);
            console.log("targetDiv:", { targetDiv, messageId });



            if (targetDiv) {
              waitUntilListenerReady(targetDiv, () => {
                const responseEvent = new CustomEvent("generateSlidesResponse", {
                  detail: { payload: slides, error: response.error },
                });
                console.log("responseEvent:", { responseEvent, messageId });
                targetDiv.dispatchEvent(responseEvent);
              });
            } else {
              console.error(`No div found with messageId: ${messageId}`);
            }
          } catch (err) {
            console.error(`Error retrying for messageId ${messageId}:`, err.message);
          }
        }
      }
    } catch (err) {
      console.error("Error sending message to background:", err.message);
    }
  };
  script.onerror = (error) => {
    console.error("Error loading React script:", error);
  };

  if(document.head)
  document.head.appendChild(script);
}

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data && event.data.type) {
    const { type, payload } = event.data;
    console.log("Received message from React in content.js:", type, payload);
    if (type === "generateSlides") {
      console.log("generateSlides payload:", payload);

      if (!chrome || !chrome.runtime || !chrome.runtime.sendMessage) {
        console.error("chrome.runtime.sendMessage is not available");

        const messageId = payload.messageId;
        const findDiv = () => {
          const messageDiv = document.querySelector(`div[data-message-author-role="assistant"][data-message-id="${messageId}"]`);
          return messageDiv?.querySelector(`div[data-message-id="${messageId}"]`);
        };
        retry(findDiv, 5, 1000)
          .then((targetDiv) => {
            if (targetDiv) {
              waitUntilListenerReady(targetDiv, () => {
                const errorEvent = new CustomEvent("generateSlidesResponse", {
                  detail: { error: "chrome.runtime.sendMessage is not available" },
                });
                targetDiv.dispatchEvent(errorEvent);
              });
            } else {
              console.error(`No div found with messageId: ${messageId}`);
            }
          })
          .catch((err) => {
            console.error(`Error retrying for messageId ${messageId}:`, err.message);
          });
        return;
      }

      console.log("Sending message to background.js...");
      sendMessage({ type, data: payload })
        .then((response) => {
          console.log("Response from background in content.js:", response);

          const messageId = payload.messageId;
          const findDiv = () => {
            const messageDiv = document.querySelector(`div[data-message-author-role="assistant"][data-message-id="${messageId}"]`);
            return messageDiv?.querySelector(`div[data-message-id="${messageId}"]`);
          };

          retry(findDiv, 5, 1000)
            .then((targetDiv) => {
              console.log("targetDiv:", targetDiv);
              if (targetDiv) {
                waitUntilListenerReady(targetDiv, () => {
                  const responseEvent = new CustomEvent("generateSlidesResponse", {
                    detail: { payload: response.data, error: response.error },
                  });
                  targetDiv.dispatchEvent(responseEvent);
                });
              } else {
                console.error(`No div found with messageId: ${messageId}`);
              }
            })
            .catch((err) => {
              console.error(`Error retrying for messageId ${messageId}:`, err.message);
            });
        })
        .catch((err) => {
          console.error("Error sending message to background:", err.message);

          const messageId = payload.messageId;
          const findDiv = () => {
            const messageDiv = document.querySelector(`div[data-message-author-role="assistant"][data-message-id="${messageId}"]`);
            return messageDiv?.querySelector(`div[data-message-id="${messageId}"]`);
          };
          retry(findDiv, 5, 1000)
            .then((targetDiv) => {
              if (targetDiv) {
                waitUntilListenerReady(targetDiv, () => {
                  const errorEvent = new CustomEvent("generateSlidesResponse", {
                    detail: { error: err.message },
                  });
                  targetDiv.dispatchEvent(errorEvent);
                });
              } else {
                console.error(`No div found with messageId: ${messageId}`);
              }
            })
            .catch((retryErr) => {
              console.error(`Error retrying for messageId ${messageId}:`, retryErr.message);
            });
        });
    } else if(type === "DATA_INJECTED "){
      
    }

  }
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
