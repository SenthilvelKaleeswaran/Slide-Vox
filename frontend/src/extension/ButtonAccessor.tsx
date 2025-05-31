import ReactDOM from "react-dom/client";
import ButtonAccessorViewer from "../components/ButtonAccessorViewer";

type Website = string;
type MessageSelectorMap = Record<Website, string>;

const URL_CHATGPT: Website = "https://chatgpt.com";
const websites: Website[] = [URL_CHATGPT];

const websiteSelector: MessageSelectorMap = {
  [URL_CHATGPT]: 'div[data-message-author-role="assistant"][data-message-id]',
};

function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function injectButtonToMessage(message: HTMLElement, index: number): void {
  if (message.hasAttribute("button-accessor-root")) {
    console.log("Button already injected for message", index);
    return;
  }

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-accessor-root";
  buttonContainer.style.display = "inline-block";
  buttonContainer.style.marginLeft = "10px";
  buttonContainer.style.position = "relative"; 
  buttonContainer.textContent = "Button"; 
  buttonContainer.setAttribute("data-index", index.toString());

  message.prepend(buttonContainer);
  message.setAttribute("data-button-injected", "true");

  try {
    const root = ReactDOM.createRoot(buttonContainer);
    root.render(<ButtonAccessorViewer />);
    console.log("ButtonAccessorViewer rendered for message", index);
  } catch (err) {
    console.error("Error rendering ButtonAccessorViewer for message", index, err);
  }
}

function processChatMessages(): void {
  console.log("Processing chat messages");
  const websiteUrl = window.location.href;
  const website = websites.find((website) => websiteUrl.includes(website));

  if (!website) {
    console.log("Not a chat website. Exiting.");
    return;
  }

  const messageSelector = websiteSelector[website];
  const messages = document.querySelectorAll(`${messageSelector}:not([data-button-injected])`);
  console.log("Found unprocessed messages:", messages.length);

  messages.forEach((message, index) => {
    injectButtonToMessage(message as HTMLElement, index);
  });
}

const debouncedProcessChatMessages = debounce(processChatMessages, 100);

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");
  debouncedProcessChatMessages();

  const observer = new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.addedNodes.length)) {
      console.log("DOM changes detected, reprocessing messages");
      debouncedProcessChatMessages();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});

setInterval(debouncedProcessChatMessages, 1000);

debouncedProcessChatMessages();