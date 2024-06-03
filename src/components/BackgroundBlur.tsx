import { HTMLAttributes, ReactNode } from "react";

interface BackgroundBlurProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const BackgroundBlur = ({
  children,
  className,
  ...props
}: BackgroundBlurProps) => {
  return (
    <div
      className={`border-2 border-white/15 w-full max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-5xl rounded-2xl bg-black/70 px-4 py-4 sm:p-8 text-white shadow-md backdrop-blur-md md:p-12 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default BackgroundBlur;
