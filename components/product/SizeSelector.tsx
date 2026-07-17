"use client";

const sizes = ["S", "M", "L", "XL", "2XL", "3XL"];

type Props = {
  value: string;
  onChange: (size: string) => void;
};

export default function SizeSelector({
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold">
        Size
      </h3>

      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onChange(size)}
            className={`h-12 w-12 rounded-xl border transition ${
              value === size
                ? "border-lime-400 bg-lime-400 text-black"
                : "border-zinc-700 bg-zinc-900 text-white"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
