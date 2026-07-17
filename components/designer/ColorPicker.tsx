"use client";

const colors = [
  "#000000",
  "#FFFFFF",
  "#2563EB",
  "#16A34A",
  "#DC2626",
  "#FACC15",
];

type Props = {
  value: string;
  onChange: (color: string) => void;
};

export default function ColorPicker({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="mb-3 text-lg font-bold">Hoodie Color</h2>

      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className={`h-10 w-10 rounded-full border-2 ${
              value === color
                ? "border-lime-400"
                : "border-zinc-700"
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}
