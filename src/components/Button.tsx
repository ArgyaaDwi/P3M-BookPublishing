interface ButtonProps {
    text: string;
    bgColor: string;
    color: string;
    colorHover: string;
    bgColorHover: string;
  }
  
  const Button = ({
    text,
    bgColor,
    color,
    colorHover,
    bgColorHover,
  }: ButtonProps) => {
    return (
      <button
        className={`px-3 py-2 font-semibold rounded-lg transition-all duration-300 ${bgColor} ${color} hover:${bgColorHover} hover:${colorHover}`}
      >
        {text}
      </button>
    );
  };
  
  export default Button;
  