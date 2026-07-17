"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function TextEditor({
  value,
  onChange,
}: Props) {
  return (
    <div>
      <h2 className="mb-3 text-lg font-bold">
        Custom Text
      </h2>

      <input
        type="text"
        placeholder="Enter your text..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3 outline-none focus:border-lime-400"
      />
    </div>
  );
}
