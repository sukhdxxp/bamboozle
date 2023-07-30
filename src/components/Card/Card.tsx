import React from "react";
import classNames from "classnames";
import { ColorVariant } from "../common/uiConfig";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  pattern?: CardPatternVariant;
  color?: ColorVariant;
};

export enum CardPatternVariant {
  Default = "default",
  Blob = "blob",
  Blob2 = "blob-2",
}

export default function Card({
  children,
  pattern = CardPatternVariant.Default,
  color = ColorVariant.Teal,
  className,
}: CardProps) {
  return (
    <div
      className={classNames(`p-4 rounded-lg bg-cover`, className, {
        "bg-blob-bg": pattern === CardPatternVariant.Blob,
        "bg-blob-bg-2": pattern === CardPatternVariant.Blob2,
        "bg-teal-100": color === ColorVariant.Teal,
        "bg-rose-100": color === ColorVariant.Rose,
        "bg-violet-100": color === ColorVariant.Violet,
        "bg-amber-100": color === ColorVariant.Amber,
      })}
    >
      {children}
    </div>
  );
}
