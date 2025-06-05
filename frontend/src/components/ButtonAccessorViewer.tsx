import { useEffect, useRef, useState } from "react";
import IconButtonWithLoader from "../../lib/components/ui/IconVariants";
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

const getMessageContent = (element : any) => {
  const url = window.location.href;
  if (url.includes(URL_CHATGPT)) {
    const currentDiv = element ;
    const parentDiv = currentDiv?.parentElement;
    const messageDiv: any = parentDiv?.parentElement;
    return messageDiv
  }
  
}

const getMessageId = (element : any) => {
  const url = window.location.href;
  if (url.includes(URL_CHATGPT)) {
    const messageDiv: any = getMessageContent(element)
    const messageId =
      messageDiv?.getAttribute("data-message-id")
    return messageId;
  } else if (url.includes(URL_MISTRAL)) {
    return url.split("/")[4];
  }
};

const getReplaceDiv = (element : any) => {
  const url = window.location.href;
  if (url.includes(URL_CHATGPT)) {
    const parentDiv: any = getMessageContent(element)
    const messageId =
    parentDiv?.getAttribute("data-message-id")
    const replaceDiv = parentDiv.querySelector(".markdown");
    replaceDiv?.setAttribute(`data-switch-format-${messageId}`, "chats");
    const newDiv = document.createElement("div");
    newDiv.setAttribute(`data-switch-format-${messageId}`, "slides");
    newDiv.style.display = "hidden";
    parentDiv.appendChild(newDiv);
    return parentDiv;
  }

}

export default function ButtonAccessorViewer() {
  const ref = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any>(null);
  const [messageId, setMessageId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (ref.current) {
      const messageId = getMessageId(ref.current)
      setMessageId(messageId);
    }
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    const messageDiv: any = getMessageContent(ref.current)

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
    messageDiv.addEventListener("generateSlidesResponse", handleResponse);

    return () => {
      messageDiv.removeEventListener("generateSlidesResponse", handleResponse);
    };
  }, [ref.current]);

  useEffect(()=>{
    if(data?.length && ref.current){

      const replaceDiv= getReplaceDiv(ref.current);



      console.log('currentdiv',replaceDiv)
      

    }

  },[data,ref.current])

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

  return (
    <div className="flex gap-2" ref={ref}>
      {data ? `Slides: ${data.length}` : "No slides"}
      {messageId}
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
