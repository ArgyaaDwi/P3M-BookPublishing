import { ChevronRight } from "lucide-react";
import Link from "next/link";
interface CardProps {
  icon: React.ReactNode;
  text: string;
  count: number | string;
  color: string;
  url: string;
}
const Card = ({ icon, text, count, color, url }: CardProps) => {
  return (
    <div className="flex items-center bg-white  shadow-lg rounded-md overflow-hidden position">
      <div className="h-full w-2" style={{ backgroundColor: color }}></div>
      <div className="p-4 flex flex-col ml-2 items-start justify-start">
        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="mt-2 text-sm font-normal text-gray-600">{text}</h3>
        <p className="mt-2 text-2xl font-semibold text-black">{count}</p>
        <Link href={url}>
          <div className="flex items-center space-x-1 mt-2">
            <p className="text-sm font-normal text-blue-700 hover:underline">
              More Info
            </p>
            <ChevronRight size={15} color="blue" />
          </div>
        </Link>
      </div>
    </div>
  );
};
export default Card;
