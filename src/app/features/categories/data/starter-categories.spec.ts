import { describe, expect, it } from 'vitest';
import { STARTER_CATEGORIES, pendingStarterCategories } from './starter-categories';

const root = (name: string) => ({ name, parent_id: null });
const child = (name: string) => ({ name, parent_id: 'alguna-raiz' });

const names = (existing: { name: string; parent_id: string | null }[]) =>
  pendingStarterCategories(existing).map((starter) => starter.name);

describe('pendingStarterCategories', () => {
  it('las ofrece todas cuando el grupo no tiene ninguna', () => {
    expect(pendingStarterCategories([])).toHaveLength(STARTER_CATEGORIES.length);
  });

  it('no ofrece la que ya existe', () => {
    expect(names([root('Vivienda')])).not.toContain('Vivienda');
  });

  it('no ofrece nada cuando el paquete ya está puesto', () => {
    const todas = STARTER_CATEGORIES.map((starter) => root(starter.name));
    expect(pendingStarterCategories(todas)).toEqual([]);
  });

  it('deja solo lo que faltó cuando el alta se quedó a medias', () => {
    const mitad = STARTER_CATEGORIES.slice(0, 3).map((starter) => root(starter.name));
    expect(pendingStarterCategories(mitad)).toHaveLength(STARTER_CATEGORIES.length - 3);
  });

  it('no distingue por mayúsculas, tildes ni espacios de sobra', () => {
    // El mismo nombre escrito de otra manera sigue siendo la misma categoría:
    // recrearla dejaría dos «Alimentación» en la lista.
    expect(names([root('  alimentacion ')])).not.toContain('Alimentación');
  });

  it('no cuenta las subcategorías', () => {
    // Una «Vivienda» colgando de otra cosa no ocupa el sitio de la raíz.
    expect(names([child('Vivienda')])).toContain('Vivienda');
  });
});
