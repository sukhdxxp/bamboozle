import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
};
export default function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mt-8 w-full rounded-3xl"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
