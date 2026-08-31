export type Product = {
  id: string;
  name: string;
  price: number; // in NPR
  image: string;
  category: "Bouquet" | "Single Stem" | "Arrangement" | "Custom";
  description: string;
  colors?: string[];
  inStock: boolean;
};

// Replace image URLs with real product photos before launch.
// Keep `id` values stable once orders start coming in — they're used
// as cart keys.
export const products: Product[] = [
  {
    id: "sunrise-bouquet",
    name: "Sunrise Bouquet",
    price: 1200,
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800",
    category: "Bouquet",
    description:
      "A warm hand-twisted bouquet of seven wire sunflowers and daisies, wrapped in kraft paper.",
    colors: ["Yellow", "Orange", "Cream"],
    inStock: true,
  },
  {
    id: "blush-rose-stem",
    name: "Blush Rose — Single Stem",
    price: 350,
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800",
    category: "Single Stem",
    description:
      "One fuzzy wire rose in dusty blush, perfect as a small gift or bookmark flower.",
    colors: ["Blush", "Red", "White"],
    inStock: true,
  },
  {
    id: "garden-jar-arrangement",
    name: "Garden Jar Arrangement",
    price: 1800,
    image: "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=800",
    category: "Arrangement",
    description:
      "A mixed arrangement of wire tulips, daisies, and lavender sprigs set in a glass jar.",
    colors: ["Mixed Pastel"],
    inStock: true,
  },
  {
    id: "custom-bouquet",
    name: "Made-to-Order Bouquet",
    price: 0,
    image: "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800",
    category: "Custom",
    description:
      "Tell us the occasion, colors, and size — every stem is handmade to match. Price confirmed after details are shared at checkout.",
    inStock: true,
  },
];

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}
