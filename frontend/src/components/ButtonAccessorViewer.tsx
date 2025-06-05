import { useEffect, useRef, useState } from "react";
import IconButtonWithLoader, {
  IconButton,
} from "../../lib/components/ui/IconVariants";
import { createSlides } from "../../lib/services/slides";

const URL_CHATGPT = "https://chatgpt.com";
const URL_MISTRAL = "https://www.mistral.ai";
const URL_PERPLEXITY = "https://www.perplexity.ai";

const platformSelectors = {
  [URL_CHATGPT]: { selector: ".markdown", platform: "chatgpt" },
  [URL_MISTRAL]: { selector: ".message-content", platform: "mistral" },
  [URL_PERPLEXITY]: {
    selector: ".user-message-content",
    platform: "perplexity",
  },
};

const getConversationId = () => {
  const url = window.location.href;
  if (url.includes(URL_CHATGPT)) {
    return url.split("/")[4];
  } else if (url.includes(URL_MISTRAL)) {
    return url.split("/")[4];
  }
};

const getMessageContent = (element) => {
  const url = window.location.href;
  if (url.includes(URL_CHATGPT)) {
    const currentDiv = element;
    const parentDiv = currentDiv?.parentElement;
    return parentDiv?.parentElement;
  }
};

const getMessageId = (element) => {
  const url = window.location.href;
  if (url.includes(URL_CHATGPT)) {
    const messageDiv = getMessageContent(element);
    return messageDiv?.getAttribute("data-message-id");
  } else if (url.includes(URL_MISTRAL)) {
    return url.split("/")[4];
  }
};

const setReplaceDiv = (element, messageId) => {
  const url = window.location.href;
  if (url.includes(URL_CHATGPT)) {
    const replaceChildDiv = element.querySelector(".markdown");
    const replaceDiv = replaceChildDiv?.parentElement;
    replaceDiv?.setAttribute(`data-switch-format-${messageId}`, "chats");
    const newDiv = document.createElement("div");
    newDiv.setAttribute(`data-switch-format-${messageId}`, "slides");
    newDiv.style.display = "none";
    element.appendChild(newDiv);
  }
};

const getReplaceDiv = (element) => {
  const url = window.location.href;
  if (url.includes(URL_CHATGPT)) {
    const parentDiv = getMessageContent(element);
    const messageId = parentDiv?.getAttribute("data-message-id");

    const dataSwitchAttribute = parentDiv.querySelector(
      `[data-switch-format-${messageId}]`
    );

    if (!dataSwitchAttribute) setReplaceDiv(parentDiv, messageId);

    return parentDiv;
  }
};

export default function ButtonAccessorViewer() {
  const ref = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any>(null);
  const [messageId, setMessageId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<string>("chats");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (ref.current) {
      const messageId = getMessageId(ref.current);
      setMessageId(messageId);
    }
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    const messageDiv = getMessageContent(ref.current);

    const handleResponse = (event) => {
      console.log("Received generateSlidesResponse event in React", event);
      const { payload, error } = event.detail;
      if (error) {
        console.error("Error generating slides:", error);
      } else {
        console.log("Slides data in React:", payload);
        setData(payload);
      }
      setLoading(false);
    };

    console.log("Attaching event listener on:", messageDiv);
    if (messageDiv) {
      messageDiv.addEventListener("generateSlidesResponse", handleResponse);
    }

    return () => {
      if (messageDiv) {
        messageDiv.removeEventListener(
          "generateSlidesResponse",
          handleResponse
        );
      }
    };
  }, [ref.current]);

  useEffect(() => {
    if (data?.length && ref.current) {
      const replaceDiv = getReplaceDiv(ref.current);
      console.log("currentdiv", replaceDiv);
    }
  }, [data, ref.current]);

  const handleSlidesConversion = () => {
    if (!ref.current || !messageId) return;

    setLoading(true);

    const websiteUrl = window.location.href;
    const platformKey = Object.keys(platformSelectors).find((url) =>
      websiteUrl.includes(url)
    );
    if (!platformKey) {
      console.error("Unsupported platform");
      setLoading(false);
      return;
    }

    const { selector, platform } = platformSelectors[platformKey];
    const currentDiv = ref.current;
    const parentDiv = currentDiv?.parentElement;
    const messageDiv = parentDiv?.parentElement;
    const messageContent = messageDiv?.querySelector(selector);

    console.log("Sending generateSlides message from React...");
    createSlides({
      messageId,
      data: messageContent?.textContent ?? "",
      model: platform === "chatgpt" ? "gpt-4.0" : "mistral-large",
      platform,
      conversationId: getConversationId(),
    });

    console.log({
      innerHTML: messageContent?.innerHTML,
      textContent: messageContent?.textContent,
    });
  };

  const toggleView = () => {
    console.log("currentView", currentView);
    if (!ref.current) return;

    const parentDiv = getReplaceDiv(ref.current);
    console.log("parentDiv", parentDiv);
    const newView = currentView === "chats" ? "slides" : "chats";
    const currentViewDiv = parentDiv.querySelector(
      `[data-switch-format-${messageId}="${currentView}"]`
    );
    const newViewDiv = parentDiv.querySelector(
      `[data-switch-format-${messageId}="${newView}"]`
    );

    console.log("currentViewDiv", currentViewDiv);
    console.log("newViewDiv", newViewDiv);

    if (currentViewDiv) currentViewDiv.style.display = "none";
    if (newViewDiv) newViewDiv.style.display = "block";

    setCurrentView(newView);
  };

  return (
    <div className="flex gap-2" ref={ref}>
      {data ? `Slides: ${data.length}` : "No slides"}
      {messageId}
      <IconButton name="SwitchIcon" onClick={toggleView} />
      <IconButtonWithLoader
        isLoading={loading}
        name="SlidesIcon"
        onClick={handleSlidesConversion}
      />
      <IconButtonWithLoader
        isLoading={loading}
        name="VoxIcon"
        onClick={handleSlidesConversion}
      />
    </div>
  );
}
