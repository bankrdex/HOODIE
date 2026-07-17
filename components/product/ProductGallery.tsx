"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
};

export default function ProductGallery({ images }: Props) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-zinc-900">
        <Image
          src={images[selected]}
          alt="Hoodie"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex gap-3 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelected(index)}
            className={`relative h-20 w-20 overflow-hidden rounded-xl border ${
              selected === index
                ? "border-lime-400"
                : "border-zinc-800"
            }`}
          >
            <Image
              src={image}
              alt={`Preview ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
