import { useRef, useState } from "react";
import IconButtonWithLoader from "../../lib/components/ui/IconVariants";
import { createSlides } from "../../lib/services/slides";

export default function ButtonAccessorViewer() {
  const ref = useRef<HTMLDivElement>(null);

  const [data , setData] = useState<any>(null);

  const handleSlidesConversion = () => {
    if (ref.current) {
      console.log(ref.current);
      const currentDiv = ref.current;
      const parentDiv = currentDiv?.parentElement;
      const messageDiv = parentDiv?.parentElement;
      const messageId = messageDiv?.getAttribute("data-message-id");
      const messageContent: any = messageDiv?.querySelector(".markdown");

      const data = createSlides({
        messageId,
        data: messageContent?.innerText ?? "",
        model: "gpt-4.0",
        platform : "chatgpt",
      });

      setData(data);


     
      console.log({
        innerHTML: messageContent?.innerHTML,
        innerText: messageContent?.innerText,
      });
    }
  };

  return (
    <div className="flex gap-2" ref={ref}>
      {data ? 'data' : 'null'}
      <IconButtonWithLoader
        isLoading={false}
        name="SlidesIcon"
        onClick={handleSlidesConversion}
      />
      <IconButtonWithLoader
        isLoading={false}
        name="VoxIcon"
        onClick={handleSlidesConversion}
      />
    </div>
  );
}
