"use client";

import Spinner from "./Spinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
}

export default function Button({
  children,
  isLoading = false,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`flex items-center justify-center gap-2 green-glow rounded-md bg-green-700 px-4 py-2 text-white shadow-green-700 transition ${props.className}`}
    >
      {children}
      {isLoading && <Spinner />}
    </button>
  );
}
