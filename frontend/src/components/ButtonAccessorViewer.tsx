import IconButton from "./ui/IconVariants";
export default function ButtonAccessorViewer() {
  const handleSlidesConversion = () => {
    console.log("Convert button clicked");
  };

  return (
    <div className="flex gap-2">
      <IconButton name="SlidesIcon" onClick={handleSlidesConversion} />
      <IconButton name="VoxIcon" onClick={handleSlidesConversion} />
    </div>
  );
}
