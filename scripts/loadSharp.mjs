/**
 * Resolves `sharp` for the asset scripts.
 *
 * `sharp` is a native module and is deliberately NOT a dependency of this app —
 * it is only ever used by build-time asset tooling, never by the bundle. So the
 * scripts borrow whichever copy is already on this machine:
 *
 *   1. a local install, if someone ran `npm i -D sharp` here;
 *   2. the sibling doctor project, which owns the shared asset toolchain.
 *
 * If neither exists the error says exactly what to run, rather than failing
 * with an opaque MODULE_NOT_FOUND three frames deep.
 */
import { createRequire } from "module";
import { fileURLToPath } from "url";
import path from "path";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const CANDIDATES = [
  "sharp",
  // ../../ from this app is the workspace root that holds every project.
  path.resolve(ROOT, "../../Doctor-both/22-04-26DR-front/node_modules/sharp"),
  path.resolve(
    ROOT,
    "../../inventory-saas-both-fiveM/23-jun26-medical-front/node_modules/sharp",
  ),
];

let sharp;
for (const c of CANDIDATES) {
  try {
    sharp = require(c);
    break;
  } catch {
    /* try the next one */
  }
}

if (!sharp) {
  throw new Error(
    "sharp not found. Run `npm i -D sharp` in 17-jun-Goat-farm-front, " +
      "or check the sibling paths in scripts/loadSharp.mjs.",
  );
}

export default sharp;
