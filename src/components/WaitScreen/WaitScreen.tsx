import React from "react";

export default function WaitScreen() {
  return (
    <div className="w-full bg-white h-screen flex content-center justify-center items-center absolute top-0 left-0">
      <div className={"w-48 h-48"}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://res.cloudinary.com/bamboozle/image/upload/c_scale,w_192/v1690731711/bamboozle/icons/others/wait.gif"
          alt=""
        />
      </div>
    </div>
  );
}
