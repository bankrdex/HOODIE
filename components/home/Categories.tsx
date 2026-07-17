const categories = [
  "All",
  "New",
  "Trending",
  "Crypto",
  "Gaming",
  "Anime",
  "Streetwear",
  "Sports",
  "Music",
];

export default function Categories() {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-black">
        Categories
      </h2>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            className="whitespace-nowrap rounded-full border border-zinc-800 bg-zinc-900 px-5 py-3 transition hover:border-lime-400 hover:text-lime-400"
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}
