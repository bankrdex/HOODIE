import { ArrowRight } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800 p-8">
      <div className="max-w-xl">
        <span className="rounded-full bg-lime-400 px-3 py-1 text-sm font-bold text-black">
          NEW
        </span>

        <h1 className="mt-5 text-5xl font-black tracking-tight">
          Wear Your Identity.
        </h1>

        <p className="mt-4 text-zinc-400">
          Create premium custom hoodies using your logo, profile picture,
          artwork, or community branding.
        </p>

        <button className="mt-8 flex items-center gap-2 rounded-xl bg-lime-400 px-6 py-3 font-bold text-black">
          Start Designing
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}
