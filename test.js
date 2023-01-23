import fs from "fs";

const files = fs
  .readdirSync(".")
  .filter((f) => /^\d/.test(f))
  .sort();

(async () => {
  for (const f of files) {
    console.log(`Running ${f}`);
    const ns = await import(`./${f}`);
    await ns.default;
    console.log("");
  }
})();
