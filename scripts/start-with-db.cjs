const { execSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

// On Render, the deploy directory is read-only.
// SQLite must write to /tmp (writable) or a persistent disk mount.
const dbDir = process.env.DB_DIR || "/tmp";
const dbPath = path.join(dbDir, "custom.db");

// Create the directories if needed
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log("[startup] Created directory: " + dbDir);
}

// Create uploads directory for admin image uploads
var uploadDir = "/tmp/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("[startup] Created uploads directory: " + uploadDir);
}

// Ensure DATABASE_URL points to the writable location
process.env.DATABASE_URL = "file:" + dbPath;
console.log("[startup] DATABASE_URL set to: " + process.env.DATABASE_URL);

// Push schema to SQLite (creates/updates tables)
try {
  console.log("[startup] Running prisma db push...");
  execSync("npx prisma db push --skip-generate --accept-data-loss", {
    stdio: "inherit",
    env: Object.assign({}, process.env),
  });
  console.log("[startup] Database schema synced successfully.");
} catch (err) {
  console.error("[startup] prisma db push failed:", err.message);
}

// Seed default products if the DB is empty (async)
(async function () {
  try {
    console.log("[startup] Checking if seed is needed...");
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient({
      datasources: { db: { url: "file:" + dbPath } },
    });

    const count = await prisma.product.count();
    if (count === 0) {
      console.log("[startup] No products found, seeding defaults...");
      await prisma.product.createMany({
        data: [
          {
            name: "Arachides Grill\u00e9es",
            brand: "Nkalanga Yetu",
            desc: "Le vrai go\u00fbt des arachides grill\u00e9es, fra\u00eeches, croquantes et savoureuses \u00e0 chaque bouch\u00e9e.",
            img: "/images/arachides-grillees.jpg",
            tag: "Best-seller",
            gradient: "from-amber-600 to-orange-700",
            active: true,
            order: 1,
          },
          {
            name: "Arachides Caram\u00e9lis\u00e9es",
            brand: "Mwaiseni",
            desc: "Enrob\u00e9es d\u2019un caramel dor\u00e9, un plaisir gourmand et irr\u00e9sistible unique en son genre.",
            img: "/images/arachides-caramelisees.jpg",
            tag: "Populaire",
            gradient: "from-yellow-600 to-amber-700",
            active: true,
            order: 2,
          },
          {
            name: "Croquants Croq d\u2019Or",
            brand: "Croq d\u2019Or",
            desc: "Croustillants, savoureux, sans conservateurs. Le plaisir artisanal \u00e0 chaque bouch\u00e9e.",
            img: "/images/croquants.jpg",
            tag: "Artisanal",
            gradient: "from-orange-600 to-red-700",
            active: true,
            order: 3,
          },
          {
            name: "Gaufres",
            brand: "Mwaiseni",
            desc: "Fabriqu\u00e9es localement avec soin pour toute la famille. Qualit\u00e9 garantie.",
            img: "/images/gaufres.jpg",
            tag: "Familial",
            gradient: "from-yellow-500 to-orange-600",
            active: true,
            order: 4,
          },
          {
            name: "Feuilles de Djeka",
            brand: "Mwaiseni",
            desc: "Feuilles de jute fra\u00eeches, riches en fer et en nutriments. Un super-aliment local pour une alimentation saine.",
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
      console.log("[startup] " + count + " product(s) already in database.");
    }

    await prisma.$disconnect();
  } catch (err) {
    console.error("[startup] Seed check failed:", err.message);
  }

  // Start Next.js server
  console.log("[startup] Starting Next.js server...");
  var next = spawn("next", ["start"], {
    stdio: "inherit",
    env: Object.assign({}, process.env, { DATABASE_URL: "file:" + dbPath }),
  });

  next.on("exit", function (code) {
    process.exit(code || 0);
  });
})();
