
import clsx from "clsx";

interface BadgeStatusProps {
  text: string;
  color: string;
  bgColor: string;
}

const BadgeStatus = ({ text, color, bgColor }: BadgeStatusProps) => {
  const bgColorMap: { [key: string]: string } = {
    badgeSuccess: "bg-green-100",
    badgeError: "bg-red-100",
    badgeRev: "bg-orange-50",
  };

  const textColorMap: { [key: string]: string } = {
    badgeSuccessText: "text-green-500",
    badgeErrorText: "text-red-500",
    badgeRevText: "text-orange-500",
  };

  return (
    <div>
      <button
        className={clsx(
          "px-3 py-1 rounded-lg text-sm font-medium",
          bgColorMap[bgColor],
          textColorMap[color]
        )}
        disabled
      >
        {text}
      </button>
    </div>
  );
};

export default BadgeStatus;
