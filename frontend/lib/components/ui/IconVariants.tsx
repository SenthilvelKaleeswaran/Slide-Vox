import Icon from "../../icons";
import { LoaderIcon } from "../../icons/collections/LoaderIcon";

export function IconButton({
  name,
  className,
  onClick,
  ...rest
}: {
  name: string;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  [key: string]: unknown;
}) {
  return (
    <div
      className="bg-slate-500 p-2 rounded-full cursor-pointer"
      onClick={onClick}
    >
      <Icon name={name} className={className} {...rest} />
    </div>
  );
}

export default function IconButtonWithLoader({
  isLoading,
  ...rest
}: {
  name: string;
  className?: string;
  isLoading: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  [key: string]: unknown;
}) {
  if (isLoading) {

    return <div className="p-2"><LoaderIcon /></div>;
  }
  return <IconButton {...rest} />;
}
