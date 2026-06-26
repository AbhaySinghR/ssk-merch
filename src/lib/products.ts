export type ProductCategory = "tshirt" | "tracksuit" | "cap" | "accessories";

export type ProductImage = {
  src: string;
  label: string;
};

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  sizes: string[];
  fabric: string;
  description: string;
  images: ProductImage[];
};

const CLOTHING_DIR = "/images/shop/clothing";
const ACCESSORIES_DIR = "/images/shop/accessories";

const CLOTHING_SIZES = ["S", "M", "L", "XL", "XXL"];
const ONE_SIZE = ["One Size"];

// NOTE: Prices and fabric/material details below are placeholders for the
// initial build — swap in real values here once available.
export const products: Product[] = [
  {
    slug: "black-tshirt",
    name: "Black T-Shirt",
    category: "tshirt",
    categoryLabel: "T-Shirts",
    price: 900,
    sizes: CLOTHING_SIZES,
    fabric: "Premium cotton-polyester pique knit, breathable and durable.",
    description:
      "Classic polo tee in maroon-and-gold school colours, embroidered with the Sainik School Kapurthala crest.",
    images: [
      { src: `${CLOTHING_DIR}/Black Front.png`, label: "Front" },
      { src: `${CLOTHING_DIR}/Black Side.png`, label: "Side" },
    ],
  },
  {
    slug: "maroon-tshirt",
    name: "Maroon T-Shirt",
    category: "tshirt",
    categoryLabel: "T-Shirts",
    price: 900,
    sizes: CLOTHING_SIZES,
    fabric: "Premium cotton-polyester pique knit, breathable and durable.",
    description:
      "Classic polo tee in the school's signature maroon, embroidered with the Sainik School Kapurthala crest.",
    images: [
      { src: `${CLOTHING_DIR}/Maroon Front.png`, label: "Front" },
      { src: `${CLOTHING_DIR}/Maroon Back.png`, label: "Back" },
      { src: `${CLOTHING_DIR}/Maroon Side.png`, label: "Side" },
    ],
  },
  {
    slug: "white-tshirt",
    name: "White T-Shirt",
    category: "tshirt",
    categoryLabel: "T-Shirts",
    price: 900,
    sizes: CLOTHING_SIZES,
    fabric: "Premium cotton-polyester pique knit, breathable and durable.",
    description:
      "Classic polo tee in clean white, embroidered with the Sainik School Kapurthala crest.",
    images: [
      { src: `${CLOTHING_DIR}/White Front.png`, label: "Front" },
      { src: `${CLOTHING_DIR}/White Back.png`, label: "Back" },
      { src: `${CLOTHING_DIR}/White Side.png`, label: "Side" },
    ],
  },
  {
    slug: "tracksuit",
    name: "Tracksuit",
    category: "tracksuit",
    categoryLabel: "Tracksuits",
    price: 2000,
    sizes: CLOTHING_SIZES,
    fabric: "Brushed polyester tracksuit fabric with a soft inner lining.",
    description:
      "Full-zip tracksuit jacket and trousers in black, trimmed in gold with 'SAIKAPIAN' printed across the back.",
    images: [{ src: `${CLOTHING_DIR}/TrackSuit.png`, label: "Front & Back" }],
  },
  {
    slug: "black-cap",
    name: "Black Cap",
    category: "cap",
    categoryLabel: "Caps",
    price: 399,
    sizes: ONE_SIZE,
    fabric: "Cotton twill, adjustable strap with metal buckle closure.",
    description:
      "Embroidered baseball cap in black with the Sainik School Kapurthala crest, personalised with roll number and batch.",
    images: [
      { src: `${CLOTHING_DIR}/Black Cap Fronyt.png`, label: "Front" },
      { src: `${CLOTHING_DIR}/Black Cap Back.png`, label: "Back" },
      { src: `${CLOTHING_DIR}/Black Cap Side.png`, label: "Left Side" },
      { src: `${CLOTHING_DIR}/Black Cap Side1.png`, label: "Right Side" },
    ],
  },
  {
    slug: "blue-cap",
    name: "Blue Cap",
    category: "cap",
    categoryLabel: "Caps",
    price: 399,
    sizes: ONE_SIZE,
    fabric: "Cotton twill, adjustable strap with metal buckle closure.",
    description:
      "Embroidered baseball cap in navy blue with the Sainik School Kapurthala crest, personalised with roll number and batch.",
    images: [
      { src: `${CLOTHING_DIR}/Blue Cap Front.png`, label: "Front" },
      { src: `${CLOTHING_DIR}/Blue Cap Back.png`, label: "Back" },
      { src: `${CLOTHING_DIR}/Blue Cap Side.png`, label: "Left Side" },
      { src: `${CLOTHING_DIR}/Blue Cap side1.png`, label: "Right Side" },
    ],
  },
  {
    slug: "maroon-cap",
    name: "Maroon Cap",
    category: "cap",
    categoryLabel: "Caps",
    price: 399,
    sizes: ONE_SIZE,
    fabric: "Cotton twill, adjustable strap with metal buckle closure.",
    description:
      "Embroidered baseball cap in maroon with the Sainik School Kapurthala crest, personalised with roll number and batch.",
    images: [
      { src: `${CLOTHING_DIR}/Maroon Cap Front.png`, label: "Front" },
      { src: `${CLOTHING_DIR}/Maroon Cap Back.png`, label: "Back" },
      { src: `${CLOTHING_DIR}/Maroon Cap Side.png`, label: "Left Side" },
      { src: `${CLOTHING_DIR}/Maroon Cap Side1.png`, label: "Right Side" },
    ],
  },
  {
    slug: "white-cap",
    name: "White Cap",
    category: "cap",
    categoryLabel: "Caps",
    price: 399,
    sizes: ONE_SIZE,
    fabric: "Cotton twill, adjustable strap with metal buckle closure.",
    description:
      "Embroidered baseball cap in white with the Sainik School Kapurthala crest, personalised with roll number and batch.",
    images: [
      { src: `${CLOTHING_DIR}/White Cap Front.png`, label: "Front" },
      { src: `${CLOTHING_DIR}/White cap Back.png`, label: "Back" },
      { src: `${CLOTHING_DIR}/White Cap Side.png`, label: "Left Side" },
      { src: `${CLOTHING_DIR}/White Cap Side1.png`, label: "Right Side" },
    ],
  },
  {
    slug: "white-ceramic-mug",
    name: "White Ceramic Mug",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 350,
    sizes: ONE_SIZE,
    fabric: "Premium ceramic, dishwasher and microwave safe.",
    description:
      "Classic white ceramic mug printed with the Sainik School Kapurthala crest.",
    images: [
      { src: `${ACCESSORIES_DIR}/White Mug Front.png`, label: "Front" },
      { src: `${ACCESSORIES_DIR}/White Mug Back.png`, label: "Back" },
      { src: `${ACCESSORIES_DIR}/White Mug Side.png`, label: "Side" },
    ],
  },
  {
    slug: "black-mug",
    name: "Black Mug",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 350,
    sizes: ONE_SIZE,
    fabric: "Premium ceramic with a glossy black finish, dishwasher and microwave safe.",
    description:
      "Glossy black ceramic mug printed with the Sainik School Kapurthala crest.",
    images: [
      { src: `${ACCESSORIES_DIR}/Black Mug Front.png`, label: "Front" },
      { src: `${ACCESSORIES_DIR}/Black Mug Back.png`, label: "Back" },
      { src: `${ACCESSORIES_DIR}/Black Mug Side.png`, label: "Side" },
    ],
  },
  {
    slug: "frosted-beer-mug",
    name: "Frosted Beer Mug",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 350,
    sizes: ONE_SIZE,
    fabric: "Frosted glass, ideal for cold beverages.",
    description:
      "Frosted glass beer mug etched with the Sainik School Kapurthala crest — a toast to the old days.",
    images: [
      { src: `${ACCESSORIES_DIR}/Beer mug Front.png`, label: "Front" },
      { src: `${ACCESSORIES_DIR}/Beer Mug Back.png`, label: "Back" },
      { src: `${ACCESSORIES_DIR}/Beer Mug Side.png`, label: "Side" },
    ],
  },
  {
    slug: "metal-mug",
    name: "Metal Mug",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 350,
    sizes: ONE_SIZE,
    fabric: "Stainless steel with double-walled insulation.",
    description:
      "Double-walled stainless steel mug printed with the Sainik School Kapurthala crest, keeps drinks hot or cold for longer.",
    images: [
      { src: `${ACCESSORIES_DIR}/Metal Mug Front.png`, label: "Front" },
      { src: `${ACCESSORIES_DIR}/Metal Mug Back.png`, label: "Back" },
      { src: `${ACCESSORIES_DIR}/Metal Mug Side.png`, label: "Side" },
    ],
  },
  {
    slug: "heritage-building-magnet",
    name: "Heritage Building Magnet",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 200,
    sizes: ONE_SIZE,
    fabric: "Printed acrylic fridge magnet.",
    description:
      "Fridge magnet featuring an illustration of the Sainik School Kapurthala campus building.",
    images: [{ src: `${ACCESSORIES_DIR}/Fridge Magnet 1.png`, label: "Front" }],
  },
  {
    slug: "school-crest-magnet",
    name: "School Crest Magnet",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 200,
    sizes: ONE_SIZE,
    fabric: "Printed acrylic fridge magnet.",
    description:
      "Circular fridge magnet featuring the Sainik School Kapurthala crest.",
    images: [{ src: `${ACCESSORIES_DIR}/Fridge Magnet2.png`, label: "Front" }],
  },
  {
    slug: "jitna-ragda-utna-tagda-magnet",
    name: "Jitna Ragda Utna Tagda Magnet",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 200,
    sizes: ONE_SIZE,
    fabric: "Printed acrylic fridge magnet.",
    description:
      "A nostalgic nod to push-up punishments — every Saikapian's favourite inside joke, on a fridge magnet.",
    images: [{ src: `${ACCESSORIES_DIR}/Fridge Magnet3.png`, label: "Front" }],
  },
  {
    slug: "project-lao-magnet",
    name: "Project Lao Magnet",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 200,
    sizes: ONE_SIZE,
    fabric: "Printed acrylic fridge magnet.",
    description:
      "Die-cut fridge magnet celebrating 'Project Lao' — the unforgettable cadet cooking sessions.",
    images: [{ src: `${ACCESSORIES_DIR}/Fridge Magnet 4.png`, label: "Front" }],
  },
  {
    slug: "chaman-dhaba-magnet",
    name: "Chaman Dhaba Magnet",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 200,
    sizes: ONE_SIZE,
    fabric: "Printed acrylic fridge magnet.",
    description:
      "A tribute to Chaman Dhaba — every Saikapian's favourite escape for a plate of shahi paneer.",
    images: [{ src: `${ACCESSORIES_DIR}/Fridge mAgent 5.png`, label: "Front" }],
  },
  {
    slug: "school-barber-magnet",
    name: "School Barber Magnet",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 200,
    sizes: ONE_SIZE,
    fabric: "Printed acrylic fridge magnet.",
    description:
      "'Our School Barber' — a fond, funny throwback to Billu Barber and mandatory haircut day, on a fridge magnet.",
    images: [{ src: `${ACCESSORIES_DIR}/Fridge Magnet6.png`, label: "Front" }],
  },
  {
    slug: "maroon-tie",
    name: "Maroon Tie",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 499,
    sizes: ONE_SIZE,
    fabric: "Premium microfibre fabric, fine embroidered school logo.",
    description:
      "Classic solid maroon tie with the Sainik School Kapurthala crest embroidered in gold, personalised with your batch.",
    images: [{ src: `${ACCESSORIES_DIR}/Tie Maroon.png`, label: "All Views" }],
  },
  {
    slug: "striped-tie",
    name: "Striped Tie",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 499,
    sizes: ONE_SIZE,
    fabric: "Premium microfibre fabric, fine embroidered school logo.",
    description:
      "Maroon-and-green striped tie with a repeating Sainik School Kapurthala crest pattern.",
    images: [{ src: `${ACCESSORIES_DIR}/Tie2.png`, label: "Front" }],
  },
];

export function getAllProducts() {
  return products;
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getCategories() {
  const seen = new Map<ProductCategory, string>();
  for (const product of products) {
    seen.set(product.category, product.categoryLabel);
  }
  return Array.from(seen, ([value, label]) => ({ value, label }));
}

export function getAllSizes() {
  const sizes = new Set<string>();
  for (const product of products) {
    for (const size of product.sizes) sizes.add(size);
  }
  return Array.from(sizes);
}

export function getPriceBounds() {
  const priceValues = products.map((product) => product.price);
  return { min: Math.min(...priceValues), max: Math.max(...priceValues) };
}
