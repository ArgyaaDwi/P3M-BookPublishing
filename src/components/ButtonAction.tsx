import clsx from "clsx";

interface ButtonActionProps {
  icon: React.ReactNode;
  onClick: () => void;
  bgColor: string;
  color: string;
  colorHover: string;
}

const ButtonAction = ({
  icon,
  onClick,
  bgColor,
  color,
  colorHover,
}: ButtonActionProps) => {
  const bgColorClasses: { [key: string]: string } = {
    bgInfo: "bg-blue-100",
    bgEdit: "bg-yellow-100",
    bgDelete: "bg-red-100",
  };
  const colorClasses: { [key: string]: string } = {
    colorInfo: "text-blue-500",
    colorEdit: "text-yellow-500",
    colorDelete: "text-red-500",
  };
  const colorHoverClasses: { [key: string]: string } = {
    colorInfoHover: "hover:text-blue-600",
    colorEditHover: "hover:text-yellow-600",
    colorDeleteHover: "hover:text-red-600",
  };

  return (
    <button
      className={clsx(
        "p-3 rounded-lg",
        bgColorClasses[bgColor],
        colorClasses[color],
        colorHoverClasses[colorHover]
      )}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export default ButtonAction;
