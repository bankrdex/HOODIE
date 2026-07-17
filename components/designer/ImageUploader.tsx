"use client";

import { useDropzone } from "react-dropzone";

type Props = {
  onSelect: (file: File) => void;
};

export default function ImageUploader({ onSelect }: Props) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    onDrop: (files) => {
      if (files.length > 0) {
        onSelect(files[0]);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className="cursor-pointer rounded-xl border-2 border-dashed border-zinc-700 p-6 text-center hover:border-lime-400"
    >
      <input {...getInputProps()} />

      <p className="font-semibold">
        Upload Logo or Profile Picture
      </p>

      <p className="mt-2 text-sm text-zinc-500">
        PNG, JPG or SVG
      </p>
    </div>
  );
}
