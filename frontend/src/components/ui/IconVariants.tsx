import Icon from "../../../lib/icons";

export default function IconButton({
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
    <div className="bg-slate-500 p-2 rounded-full cursor-pointer" onClick={onClick}>
        <Icon name={name} className={className} {...rest}/>
    </div>
  )
}
