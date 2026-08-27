// Vigila la dirección de las dependencias entre capas. Una capa solo puede
// importar de las que tiene debajo, y una feature nunca de otra feature.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..', 'src', 'app');

const ALLOWED = {
  // El cliente generado solo lo toca core. Los modelos que el resto necesita
  // los publica core en core/models.ts.
  api: [],
  core: ['api', 'core'],
  // shared no sabe de nadie: es lo que lo hace reutilizable.
  shared: ['shared'],
  layout: ['core', 'shared', 'layout'],
  feature: ['core', 'shared'],
};

function classify(absolutePath) {
  const path = relative(ROOT, absolutePath).split('/');
  if (path[0] === 'features') return { layer: 'feature', feature: path[1] };
  if (['api', 'core', 'shared', 'layout'].includes(path[0])) return { layer: path[0] };
  return { layer: 'root' };
}

// La puerta principal de una feature: features/<nombre> o features/<nombre>/index.
function isPublicEntry(absolutePath) {
  const path = relative(ROOT, absolutePath).split('/');
  return path.length === 2 || (path.length === 3 && path[2] === 'index');
}

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return path.endsWith('.ts') ? [path] : [];
  });
}

function resolveImport(fromFile, specifier) {
  const target = resolve(dirname(fromFile), specifier);
  return target.startsWith(ROOT) ? target : null;
}

const violations = [];

for (const file of files(ROOT)) {
  const from = classify(file);
  if (from.layer === 'api' || from.layer === 'root') continue;

  const source = readFileSync(file, 'utf8');
  for (const [, specifier] of source.matchAll(/from\s+'(\.[^']+)'/g)) {
    const target = resolveImport(file, specifier);
    if (!target) continue;

    const to = classify(target);
    if (to.layer === from.layer && from.layer !== 'feature') continue;

    // Cruzar de una feature a otra vale, pero solo por su puerta principal.
    // Es lo que convierte el acoplamiento en un contrato explícito en vez de
    // en un enredo entre carpetas internas.
    if (from.layer === 'feature' && to.layer === 'feature') {
      if (to.feature === from.feature) continue;
      if (isPublicEntry(target)) continue;
      violations.push([
        file,
        specifier,
        `"${from.feature}" entra en las tripas de "${to.feature}"; importa de '${to.feature}' (su index.ts)`,
      ]);
      continue;
    }
    if (!ALLOWED[from.layer].includes(to.layer)) {
      violations.push([file, specifier, `"${from.layer}" no puede importar de "${to.layer}"`]);
    }
  }
}

if (violations.length === 0) {
  console.log('Fronteras correctas.');
  process.exit(0);
}

for (const [file, specifier, reason] of violations) {
  console.error(`${relative(process.cwd(), file)}\n  importa '${specifier}' — ${reason}`);
}
console.error(`\n${violations.length} violación(es) de frontera.`);
process.exit(1);
