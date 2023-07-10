import React from "react";

type UserAvatarProps = {
  src: string;
  fullName: string | null;
  onClick?: () => void;
};
export default function UserAvatar({
  src,
  fullName,
  onClick,
}: UserAvatarProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      id="avatarButton"
      data-dropdown-toggle="userDropdown"
      data-dropdown-placement="bottom-start"
      className="w-10 h-10 rounded-full cursor-pointer ml-auto"
      src={src}
      alt="User dropdown"
      onClick={onClick}
    />
  );
}
