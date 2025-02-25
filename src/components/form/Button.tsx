import React from "react";
interface ButtonProps {
  text: string;
}
const Button = ({ text }: ButtonProps) => {
  return (
    <button className="bg-primary text-white p-3 mt-3 font-semibold rounded-xl w-full hover:bg-blue-600" type="submit">
      {text}
    </button>
  );
};
export default Button;
