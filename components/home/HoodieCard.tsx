type HoodieCardProps = {
  title: string;
  creator: string;
};

export default function HoodieCard({
  title,
  creator,
}: HoodieCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition hover:border-lime-400">
      <div className="aspect-square rounded-xl bg-zinc-800 flex items-center justify-center text-6xl">
        👕
      </div>

      <h3 className="mt-4 text-xl font-bold">{title}</h3>

      <p className="mt-1 text-sm text-zinc-400">
        by {creator}
      </p>

      <button className="mt-4 w-full rounded-xl bg-lime-400 py-3 font-bold text-black">
        Customize
      </button>
    </div>
  );
}
