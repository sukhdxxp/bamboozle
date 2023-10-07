import React, { useRef, useState } from "react";

type UserAvatarProps = {
  src: string;
  fullName: string | null;
  onClick?: () => void;
  hasBorder?: boolean;
  isHighlighted?: boolean;
};
export default function UserAvatar({
  src,
  fullName,
  onClick,
  hasBorder = false,
  isHighlighted = false,
}: UserAvatarProps) {
  const [error, setError] = useState(false);
  let customClasses = "";
  if (hasBorder) {
    customClasses += "ring-2 ";
    customClasses += isHighlighted ? "ring-green-500 " : "ring-gray-500 ";
  }

  if (error) {
    return (
      <FallbackAvatar
        className={customClasses}
        onClick={onClick}
        fullName={fullName}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      id="avatarButton"
      className={`w-12 h-12 p-1 rounded-full ${customClasses}`}
      src={src}
      alt="User dropdown"
      onClick={onClick}
      onError={() => setError(true)}
    />
  );
}

const FallbackAvatar = ({
  className,
  onClick,
  fullName,
}: {
  className: string;
  onClick?: () => void;
  fullName: string | null;
}) => {
  let initials = "XY";
  if (fullName) {
    initials = fullName
      .split(" ")
      .map((n) => n[0])
      .join("");
  }
  return (
    <div
      className={`flex bg-teal-100 justify-center items-center w-12 h-12 p-1 text-xl rounded-full ${className}`}
      onClick={onClick}
    >
      {initials}
    </div>
  );
};
