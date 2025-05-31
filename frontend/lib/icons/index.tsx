import * as React from "react";
import { SlidesIcon } from "./collections/SlidesIcon";
import { VoxIcon } from "./collections/VoxIcon";

// Define the type for the icon map
type IconMap = {
  [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

// Map of icon names to their components
const iconMap: IconMap = {
  SlidesIcon,
  VoxIcon,
};

// Props for the Icon component
interface IconProps {
  name: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, className, ...rest }) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return null; // Return null or a fallback component if the icon doesn't exist
  }

  return <IconComponent className={className} {...rest} />;
};

export default Icon;
