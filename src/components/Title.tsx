import { HTMLAttributes } from "react";

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  title: string;
}

const Title = ({ title, className, ...props }: TitleProps) => {
  return (
    <h2
      className={`min-w-[300px] text-center border-2 border-white/15 mx-auto w-fit rounded-xl bg-black/60 px-12 py-4 text-2xl text-white shadow-md backdrop-blur-xl ${className} mb-28`}
      {...props}
    >
      {title}
    </h2>
  );
};

export default Title;
