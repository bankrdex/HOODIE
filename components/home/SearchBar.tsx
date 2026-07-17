"use client";

import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
        size={20}
      />

      <input
        type="search"
        placeholder="Search hoodies, creators, collections..."
        className="h-14 w-full rounded-2xl border border-zinc-800 bg-zinc-900 pl-12 pr-4 text-white outline-none transition focus:border-lime-400"
      />
    </div>
  );
}
