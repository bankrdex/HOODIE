type Props = {
  view: "front" | "back";
  onChange: (view: "front" | "back") => void;
};

export default function ViewSwitcher({
  view,
  onChange,
}: Props) {
  return (
    <div className="flex rounded-xl bg-zinc-900 p-1">
      <button
        onClick={() => onChange("front")}
        className={`flex-1 rounded-lg py-2 ${
          view === "front"
            ? "bg-lime-400 text-black"
            : "text-white"
        }`}
      >
        Front
      </button>

      <button
        onClick={() => onChange("back")}
        className={`flex-1 rounded-lg py-2 ${
          view === "back"
            ? "bg-lime-400 text-black"
            : "text-white"
        }`}
      >
        Back
      </button>
    </div>
  );
}
