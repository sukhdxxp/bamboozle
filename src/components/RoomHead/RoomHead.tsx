import { BiCopy } from "react-icons/bi";
import React from "react";

function ToastMessage({ message }: { message: string }) {
  return (
    <div className="bg-gray-700 text-white p-2 rounded-lg fixed bottom-16 right-4 text-sm">
      {message}
    </div>
  );
}

export default function RoomHead({ roomId }: { roomId: string }) {
  const [showToast, setShowToast] = React.useState(false);

  const handleCopyIconClick = () => {
    const currentPageURL =
      typeof window !== "undefined" && window.location.href
        ? window.location.href
        : "";
    navigator.clipboard.writeText(currentPageURL).then(() => {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    });
  };

  return (
    <div className="bg-teal-100 my-4 p-4 rounded-3xl flex items-center justify-between">
      <div>{roomId}</div>
      <div
        className="rounded-3xl bg-teal-200 p-2 flex items-center content-center cursor-pointer"
        onClick={handleCopyIconClick}
      >
        <BiCopy />
      </div>
      {showToast && <ToastMessage message="Copied to clipboard!" />}
    </div>
  );
}
