const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// On Render, the deploy directory is read-only.
// SQLite must write to /tmp (writable) or a persistent disk mount.
const dbDir = process.env.DB_DIR || "/tmp";
const dbPath = path.join(dbDir, "custom.db");

// Create the /tmp/db directory if needed
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`[startup] Created directory: ${dbDir}`);
}

// Ensure DATABASE_URL points to the writable location
process.env.DATABASE_URL = `file:${dbPath}`;
console.log(`[startup] DATABASE_URL set to: ${process.env.DATABASE_URL}`);

// Push schema to SQLite (creates/updates tables)
try {
  console.log("[startup] Running prisma db push...");
  execSync("npx prisma db push --skip-generate --accept-data-loss", {
    stdio: "inherit",
    env: { ...process.env },
  });
  console.log("[startup] Database schema synced successfully.");
} catch (err) {
  console.error("[startup] prisma db push failed:", err.message);
  // Don't crash - try to start anyway, the schema might already exist
}

// Seed default products if the DB is empty
try {
  console.log("[startup] Checking if seed is needed...");
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient({
    datasources: { db: { url: `file:${dbPath}` } },
  });

  const count = await prisma.product.count();
  if (count === 0) {
    console.log("[startup] No products found, seeding defaults...");
    await prisma.product.createMany({
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
    console.log("[startup] 5 default products seeded.");
  } else {
    console.log(`[startup] ${count} product(s) already in database.`);
  }

  await prisma.$disconnect();
} catch (err) {
  console.error("[startup] Seed check failed:", err.message);
}

// Start Next.js server
console.log("[startup] Starting Next.js server...");
const { spawn } = require("child_process");
const next = spawn("next", ["start"], {
  stdio: "inherit",
  env: { ...process.env, DATABASE_URL: `file:${dbPath}` },
});

next.on("exit", (code) => {
  process.exit(code || 0);
});
