"use client";

import { Rnd } from "react-rnd";

type Props = {
  image: string;
};

export default function DraggableImage({ image }: Props) {
  return (
    <Rnd
      default={{
        x: 70,
        y: 70,
        width: 120,
        height: 120,
      }}
      bounds="parent"
      lockAspectRatio
    >
      <img
        src={image}
        alt="Design"
        className="h-full w-full object-contain select-none"
        draggable={false}
      />
    </Rnd>
  );
}
