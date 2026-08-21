import "dotenv/config";
import { connectDB } from "./src/db/db.js";
import { Product } from "./src/models/product.model.js";
import { DeliveryOption } from "./src/models/deliveryOption.model.js";
import { User } from "./src/models/user.model.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

const defaultProducts = [
  {
    name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
    image: "images/products/athletic-cotton-socks-6-pairs.jpg",
    rating: { stars: 4.5, count: 87 },
    priceCents: 1090,
    keywords: ["socks", "sports", "apparel"],
  },
  {
    name: "Intermediate Size Basketball",
    image: "images/products/intermediate-composite-basketball.jpg",
    rating: { stars: 4, count: 127 },
    priceCents: 2095,
    keywords: ["sports", "basketballs"],
  },
  {
    name: "Adults Plain Cotton T-Shirt - 2 Pack",
    image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
    rating: { stars: 4.5, count: 56 },
    priceCents: 799,
    keywords: ["tshirts", "apparel", "mens"],
  },
  {
    name: "2 Slot Toaster - White",
    image: "images/products/2-slot-toaster-white.jpg",
    rating: { stars: 5, count: 2197 },
    priceCents: 1899,
    keywords: ["toaster", "kitchen", "appliances"],
  },
  {
    name: "2 Piece White Dinner Plate Set",
    image: "images/products/elegant-white-dinner-plate-set.jpg",
    rating: { stars: 4, count: 37 },
    priceCents: 2067,
    keywords: ["plates", "kitchen", "dining"],
  },
  {
    name: "3 Piece Non-Stick, Black Cooking Pot Set",
    image: "images/products/3-piece-cooking-set.jpg",
    rating: { stars: 4.5, count: 175 },
    priceCents: 3499,
    keywords: ["kitchen", "cookware"],
  },
  {
    name: "Cotton Oversized Sweater - Gray",
    image: "images/products/women-plain-cotton-oversized-sweater-gray.jpg",
    rating: { stars: 4.5, count: 317 },
    priceCents: 2400,
    keywords: ["sweaters", "apparel"],
  },
  {
    name: "2 Piece Luxury Towel Set - White",
    image: "images/products/luxury-towel-set.jpg",
    rating: { stars: 4.5, count: 144 },
    priceCents: 3599,
    keywords: ["bathroom", "washroom", "restroom", "towels", "bath towels"],
  },
  {
    name: "Ultra Soft Tissue 2-Ply - 8 Boxes",
    image: "images/products/facial-tissue-2-ply-8-boxes.jpg",
    rating: { stars: 4, count: 99 },
    priceCents: 2374,
    keywords: ["kleenex", "tissues", "kitchen", "napkins"],
  },
  {
    name: "Women's Striped Beach Dress",
    image: "images/products/women-striped-beach-dress.jpg",
    rating: { stars: 4.5, count: 235 },
    priceCents: 2970,
    keywords: ["robe", "swimsuit", "swimming", "bathing", "apparel"],
  },
  {
    name: "Women's Sandal Heels - Pink",
    image: "images/products/women-sandal-heels-white-pink.jpg",
    rating: { stars: 4.5, count: 2286 },
    priceCents: 5300,
    keywords: ["womens", "shoes", "heels", "sandals"],
  },
  {
    name: "Round Sunglasses",
    image: "images/products/round-sunglasses-gold.jpg",
    rating: { stars: 4.5, count: 30 },
    priceCents: 3560,
    keywords: ["accessories", "shades"],
  },
  {
    name: "Blackout Curtains Set - Beige",
    image: "images/products/blackout-curtain-set-beige.jpg",
    rating: { stars: 4.5, count: 232 },
    priceCents: 4599,
    keywords: ["bedroom", "curtains", "home"],
  },
  {
    name: "Women's Summer Jean Shorts",
    image: "images/products/women-summer-jean-shorts.jpg",
    rating: { stars: 4, count: 160 },
    priceCents: 1699,
    keywords: ["shorts", "apparel", "womens"],
  },
  {
    name: "Electric Hot Water Kettle - White",
    image: "images/products/electric-steel-hot-water-kettle-white.jpg",
    rating: { stars: 5, count: 846 },
    priceCents: 5074,
    keywords: ["water kettle", "appliances", "kitchen"],
  },
  {
    name: "Waterproof Knit Athletic Sneakers - Gray",
    image: "images/products/knit-athletic-sneakers-gray.jpg",
    rating: { stars: 4, count: 89 },
    priceCents: 5390,
    keywords: ["shoes", "running shoes", "footwear"],
  },
  {
    name: "Straw Wide Brim Sun Hat",
    image: "images/products/straw-sunhat.jpg",
    rating: { stars: 4, count: 215 },
    priceCents: 2200,
    keywords: ["hats", "straw hats", "summer", "apparel"],
  },
  {
    name: "Men's Athletic Sneaker - White",
    image: "images/products/men-athletic-shoes-white.jpg",
    rating: { stars: 4, count: 229 },
    priceCents: 4590,
    keywords: ["shoes", "running shoes", "footwear", "mens"],
  },
  {
    name: "Men's Wool Sweater - Black",
    image: "images/products/men-stretch-wool-sweater-black.jpg",
    rating: { stars: 4.5, count: 2465 },
    priceCents: 3374,
    keywords: ["sweaters", "apparel"],
  },
  {
    name: "Bathroom Bath Mat 16 x 32 Inch - Grey",
    image: "images/products/bathroom-mat.jpg",
    rating: { stars: 4.5, count: 119 },
    priceCents: 1850,
    keywords: ["bathmat", "bathroom", "home"],
  },
  {
    name: "Women's Ballet Flat - White",
    image: "images/products/women-knit-ballet-flat-white.jpg",
    rating: { stars: 4, count: 326 },
    priceCents: 2640,
    keywords: ["shoes", "flats", "womens", "footwear"],
  },
  {
    name: "Men's Golf Polo Shirt - Gray",
    image: "images/products/men-golf-polo-t-shirt-gray.jpg",
    rating: { stars: 4.5, count: 2556 },
    priceCents: 1599,
    keywords: ["tshirts", "shirts", "apparel", "mens"],
  },
  {
    name: "Laundry Detergent Tabs, 50 Loads",
    image: "images/products/laundry-detergent-tabs.jpg",
    rating: { stars: 4.5, count: 305 },
    priceCents: 2899,
    keywords: ["bathroom", "cleaning"],
  },
  {
    name: "Sterling Silver Leaf Branch Earrings",
    image: "images/products/sky-leaf-branch-earrings.jpg",
    rating: { stars: 4.5, count: 52 },
    priceCents: 6799,
    keywords: ["jewelry", "accessories", "womens"],
  },
  {
    name: "Duvet Cover Set, Diamond Pattern",
    image: "images/products/duvet-cover-set-gray-queen.jpg",
    rating: { stars: 4, count: 456 },
    priceCents: 4399,
    keywords: ["bedroom", "bed sheets", "sheets", "covers", "home"],
  },
  {
    name: "Women's Knit Winter Beanie - Blue",
    image: "images/products/women-knit-beanie-pom-pom-blue.jpg",
    rating: { stars: 5, count: 83 },
    priceCents: 1950,
    keywords: ["hats", "winter hats", "beanies", "apparel", "womens"],
  },
  {
    name: "Men's Chino Pants - Beige",
    image: "images/products/men-chino-pants-beige.jpg",
    rating: { stars: 4.5, count: 9017 },
    priceCents: 2290,
    keywords: ["pants", "apparel", "mens"],
  },
  {
    name: "Men's Navigator Sunglasses",
    image: "images/products/men-navigator-sunglasses-black.jpg",
    rating: { stars: 3.5, count: 42 },
    priceCents: 3690,
    keywords: ["sunglasses", "glasses", "accessories", "shades"],
  },
  {
    name: "Men's Brown Flat Sneakers",
    image: "images/products/men-brown-flat-sneakers.jpg",
    rating: { stars: 4.5, count: 562 },
    priceCents: 2499,
    keywords: ["footwear", "men", "sneakers"],
  },
  {
    name: "Non-Stick Cook Set With Lids - 4 Pieces",
    image: "images/products/non-stick-cooking-set-4-pieces.jpg",
    rating: { stars: 4.5, count: 511 },
    priceCents: 6797,
    keywords: ["cooking set", "kitchen"],
  },
  {
    name: "Vanity Mirror with LED Lights - Pink",
    image: "images/products/vanity-mirror-pink.jpg",
    rating: { stars: 4.5, count: 130 },
    priceCents: 2549,
    keywords: ["bathroom", "washroom", "mirrors", "home"],
  },
  {
    name: "Women's Relaxed Lounge Pants - Pink",
    image: "images/products/women-relaxed-lounge-pants-pink.jpg",
    rating: { stars: 4.5, count: 248 },
    priceCents: 3400,
    keywords: ["pants", "apparel", "womens"],
  },
  {
    name: "Crystal Zirconia Stud Earrings - Pink",
    image: "images/products/crystal-zirconia-stud-earrings-pink.jpg",
    rating: { stars: 4.5, count: 117 },
    priceCents: 3467,
    keywords: ["accessories", "womens"],
  },
  {
    name: "Glass Screw Lid Containers - 3 Pieces",
    image: "images/products/glass-screw-lid-food-containers.jpg",
    rating: { stars: 4, count: 126 },
    priceCents: 2899,
    keywords: ["food containers", "kitchen"],
  },
  {
    name: "Black and Silver Espresso Maker",
    image: "images/products/black-and-silver-espresso-maker.jpg",
    rating: { stars: 4.5, count: 1211 },
    priceCents: 8250,
    keywords: ["espresso makers", "kitchen", "appliances"],
  },
  {
    name: "Blackout Curtains Set 42 x 84-Inch - Teal",
    image: "images/products/blackout-curtains-set-teal.jpg",
    rating: { stars: 4.5, count: 363 },
    priceCents: 3099,
    keywords: ["bedroom", "home", "curtains"],
  },
  {
    name: "Bath Towels 2 Pack - Gray, Rosewood",
    image: "images/products/bath-towel-set-gray-rosewood.jpg",
    rating: { stars: 4.5, count: 93 },
    priceCents: 2990,
    keywords: ["bathroom", "home", "towels"],
  },
  {
    name: "Athletic Skateboard Shoes - Gray",
    image: "images/products/athletic-skateboard-shoes-gray.jpg",
    rating: { stars: 4, count: 89 },
    priceCents: 3390,
    keywords: ["shoes", "running shoes", "footwear"],
  },
  {
    name: "Countertop Push Blender - Black",
    image: "images/products/countertop-push-blender-black.jpg",
    rating: { stars: 4, count: 3 },
    priceCents: 10747,
    keywords: ["food blenders", "kitchen", "appliances"],
  },
  {
    name: "Men's Fleece Hoodie - Light Teal",
    image: "images/products/men-cozy-fleece-hoodie-light-teal.jpg",
    rating: { stars: 4.5, count: 3157 },
    priceCents: 3800,
    keywords: ["sweaters", "hoodies", "apparel", "mens"],
  },
  {
    name: "Artistic Bowl and Plate Set - 6 Pieces",
    image: "images/products/artistic-bowl-set-6-piece.jpg",
    rating: { stars: 5, count: 679 },
    priceCents: 3899,
    keywords: ["bowls set", "kitchen"],
  },
  {
    name: "2-Ply Kitchen Paper Towels - 8 Pack",
    image: "images/products/kitchen-paper-towels-8-pack.jpg",
    rating: { stars: 4.5, count: 1045 },
    priceCents: 1899,
    keywords: ["kitchen", "kitchen towels", "tissues"],
  },
];

const defaultDeliveryOptions = [
  { id: "1", deliveryDays: 7, priceCents: 0 },
  { id: "2", deliveryDays: 3, priceCents: 499 },
  { id: "3", deliveryDays: 1, priceCents: 999 },
];

const seedOnStartup = async () => {
  // --- Products: only seed if empty ---
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    console.log("🌱 Database is empty, seeding products...");
    const productsWithCategory = defaultProducts.map((product) => {
      let category = "general";
      if (
        product.keywords.some((k) =>
          ["socks", "sports", "apparel", "mens", "womens", "shoes", "hats", "sweaters", "tshirts", "pants", "shorts", "dress", "heels", "flats", "sneakers", "hoodies", "swimsuit", "bathing", "robe"].includes(k),
        )
      ) {
        category = "apparel";
      } else if (
        product.keywords.some((k) =>
          ["kitchen", "cookware", "appliances", "toaster", "kettle", "blender", "espresso", "plates", "dining", "containers", "towels", "tissues", "napkins", "cleaning"].includes(k),
        )
      ) {
        category = "home & kitchen";
      } else if (
        product.keywords.some((k) =>
          ["electronics", "accessories", "jewelry", "shades", "sunglasses", "mirrors"].includes(k),
        )
      ) {
        category = "accessories";
      } else if (
        product.keywords.some((k) =>
          ["bedroom", "bathroom", "home", "curtains", "bed", "sheets", "mat"].includes(k),
        )
      ) {
        category = "home & kitchen";
      }
      return { ...product, category, stock: 50, inStock: true };
    });
    await Product.insertMany(productsWithCategory);
    console.log(`✅ Seeded ${productsWithCategory.length} products`);
  } else {
    console.log(`📦 ${productCount} products already in DB, skipping seed`);
  }

  // --- Delivery options: only seed if empty ---
  const deliveryCount = await DeliveryOption.countDocuments();
  if (deliveryCount === 0) {
    await DeliveryOption.insertMany(defaultDeliveryOptions);
    console.log(`✅ Seeded ${defaultDeliveryOptions.length} delivery options`);
  }

  // --- Admin user: only create if no admin exists ---
  const adminExists = await User.findOne({ role: "admin" });
  if (!adminExists) {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    await User.create({
      name: "Admin User",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });
    console.log(`✅ Created admin user (${adminEmail})`);
  } else {
    console.log(`📦 Admin user already exists (${adminExists.email}), skipping`);
  }
};

const startServer = async () => {
  await connectDB();
  await seedOnStartup();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
