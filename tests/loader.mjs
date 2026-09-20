import { statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

/**
 * A small module-resolution hook for the unit tests.
 *
 * The source imports `@/…` (a tsconfig path alias) and omits file extensions,
 * neither of which Node's native TypeScript support resolves on its own. This
 * hook maps the alias to `src/` and fills in the extension, so the tests import
 * the real modules with no build step and no bundler.
 */
const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const EXTENSIONS = [".ts", ".tsx", ".mjs", ".js"];

function resolveFile(base) {
  const candidates = [
    base,
    ...EXTENSIONS.map((extension) => base + extension),
    ...EXTENSIONS.map((extension) => path.join(base, `index${extension}`)),
  ];
  for (const candidate of candidates) {
    try {
      if (statSync(candidate).isFile()) return candidate;
    } catch {
      /* Try the next candidate. */
    }
  }
  return null;
}

export function resolve(specifier, context, nextResolve) {
  let base;
  if (specifier.startsWith("@/")) {
    base = path.join(projectRoot, "src", specifier.slice(2));
  } else if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
    base = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
  }

  if (base) {
    const resolved = resolveFile(base);
    if (resolved) return { url: pathToFileURL(resolved).href, shortCircuit: true };
  }

  return nextResolve(specifier, context);
}
