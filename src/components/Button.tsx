"use client";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      className="rounded bg-lime-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      {...props}
    >
      {children}
    </button>
  );
}
