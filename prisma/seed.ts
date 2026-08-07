import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function seed() {
  console.log("Seeding default products...");

  const existing = await db.product.findFirst();
  if (existing) {
    console.log("Products already exist, skipping seed.");
    return;
  }

  await db.product.createMany({
    data: [
      {
        name: "Arachides Grillées",
        brand: "Nkalanga Yetu",
        desc: "Le vrai goût des arachides grillées, fraîches, croquantes et savoureuses à chaque bouchée.",
        img: "/images/arachides-grillees.jpg",
        tag: "Best-seller",
        gradient: "from-amber-600 to-orange-700",
        active: true,
        order: 1,
      },
      {
        name: "Arachides Caramélisées",
        brand: "Mwaiseni",
        desc: "Enrobées d'un caramel doré, un plaisir gourmand et irrésistible unique en son genre.",
        img: "/images/arachides-caramelisees.jpg",
        tag: "Populaire",
        gradient: "from-yellow-600 to-amber-700",
        active: true,
        order: 2,
      },
      {
        name: "Croquants Croq d'Or",
        brand: "Croq d'Or",
        desc: "Croustillants, savoureux, sans conservateurs. Le plaisir artisanal à chaque bouchée.",
        img: "/images/croquants.jpg",
        tag: "Artisanal",
        gradient: "from-orange-600 to-red-700",
        active: true,
        order: 3,
      },
      {
        name: "Gaufres",
        brand: "Mwaiseni",
        desc: "Fabriquées localement avec soin pour toute la famille. Qualité garantie.",
        img: "/images/gaufres.jpg",
        tag: "Familial",
        gradient: "from-yellow-500 to-orange-600",
        active: true,
        order: 4,
      },
      {
        name: "Feuilles de Djeka",
        brand: "Mwaiseni",
        desc: "Feuilles de jute fraîches, riches en fer et en nutriments. Un super-aliment local pour une alimentation saine.",
        img: "/images/feuilles-djeka.jpg",
        tag: "Nouveau",
        gradient: "from-green-600 to-emerald-700",
        active: true,
        order: 5,
      },
    ],
  });

  console.log("5 default products seeded successfully!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
