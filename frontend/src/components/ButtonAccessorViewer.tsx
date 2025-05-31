import IconButtonWithLoader from "../../lib/components/ui/IconVariants";
import { createSlides } from "../../lib/services/slides";

export default function ButtonAccessorViewer() {
  const handleSlidesConversion = () => {
    const data = createSlides({});
    console.log(data);
  };

  return (
    <div className="flex gap-2">
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
