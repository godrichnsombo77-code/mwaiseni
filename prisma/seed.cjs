const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const products = [
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
    desc: "Enrobées d’un caramel doré, un plaisir gourmand et irrésistible unique en son genre.",
    img: "/images/arachides-caramelisees.jpg",
    tag: "Populaire",
    gradient: "from-yellow-600 to-amber-700",
    active: true,
    order: 2,
  },
  {
    name: "Croquants Croq d’Or",
    brand: "Croq d’Or",
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
];

async function main() {
  const count = await prisma.product.count();
  if (count > 0) {
    console.log(`[seed] ${count} product(s) already exist; nothing to do.`);
    return;
  }

  await prisma.product.createMany({ data: products });
  console.log(`[seed] Created ${products.length} default products.`);
}

main()
  .catch((error) => {
    console.error("[seed] Failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
