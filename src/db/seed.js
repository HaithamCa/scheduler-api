const fs = require("fs");
const path = require("path");

function readSchema(name) {
  return fs.readFileSync(path.resolve(__dirname, "schema", name), "utf8");
}

async function hasDays(db) {
  try {
    const { rows } = await db.query("SELECT COUNT(*)::int AS count FROM days");
    return rows[0].count > 0;
  } catch (error) {
    return false;
  }
}

async function seed(db) {
  if (await hasDays(db)) {
    return;
  }

  await db.query(readSchema("create.sql"));
  await db.query(readSchema("production.sql"));
  console.log("Database schema created and seeded.");
}

module.exports = seed;
