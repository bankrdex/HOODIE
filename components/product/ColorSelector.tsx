"use client";

const colors = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Red", value: "#DC2626" },
  { name: "Blue", value: "#2563EB" },
  { name: "Green", value: "#16A34A" },
  { name: "Yellow", value: "#FACC15" },
];

type Props = {
  value: string;
  onChange: (color: string) => void;
};

export default function ColorSelector({
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold">
        Color
      </h3>

      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => onChange(color.value)}
            title={color.name}
            className={`h-10 w-10 rounded-full border-2 ${
              value === color.value
                ? "border-lime-400"
                : "border-zinc-700"
            }`}
            style={{ backgroundColor: color.value }}
          />
        ))}
      </div>
    </div>
  );
}
