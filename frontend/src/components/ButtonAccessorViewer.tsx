import IconButtonWithLoader from "../../lib/components/ui/IconVariants";

export default function ButtonAccessorViewer() {
  const handleSlidesConversion = () => {
    console.log("Convert button clicked");
  };

  return (
    <div className="flex gap-2">
      <IconButtonWithLoader isLoading={false} name="SlidesIcon" onClick={handleSlidesConversion} />
      <IconButtonWithLoader isLoading={false} name="VoxIcon" onClick={handleSlidesConversion} />
    </div>
  );
}
