import ProductCard from "@/components/product/ProductCard";

const products = [
  {
    name: "Classic Black",
    price: "$45",
    image: "/hoodies/black-front.png",
  },
  {
    name: "Classic White",
    price: "$45",
    image: "/hoodies/white-front.png",
  },
  {
    name: "Creator Edition",
    price: "$49",
    image: "/hoodies/creator.png",
  },
  {
    name: "Street Edition",
    price: "$49",
    image: "/hoodies/street.png",
  },
];

export default function TrendingSection() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black">
          Trending
        </h2>

        <button className="text-lime-400 font-semibold">
          View all
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.name}
            name={product.name}
            price={product.price}
            image={product.image}
          />
        ))}
      </div>
    </section>
  );
}
