import { describe, expect, it } from 'vitest';
import { LatestRequest } from './latest-request';

describe('LatestRequest', () => {
  it('acepta la respuesta cuando no ha empezado ninguna otra carga', () => {
    const request = new LatestRequest();
    const token = request.next();
    expect(request.isCurrent(token)).toBe(true);
  });

  it('descarta la respuesta de una carga que otra ha reemplazado', () => {
    const request = new LatestRequest();
    const vieja = request.next();
    const nueva = request.next();

    // La vieja llega la última, que es justo el caso que rompía.
    expect(request.isCurrent(nueva)).toBe(true);
    expect(request.isCurrent(vieja)).toBe(false);
  });

  it('deja continuar a quien comparte la carga en curso', () => {
    const request = new LatestRequest();
    const primeraPagina = request.next();
    const siguientePagina = request.current();

    expect(request.isCurrent(siguientePagina)).toBe(true);
    expect(siguientePagina).toBe(primeraPagina);
  });

  it('invalida también las páginas siguientes al recargar la lista', () => {
    const request = new LatestRequest();
    request.next();
    const enVuelo = request.current();
    request.next(); // el usuario guarda algo y la lista empieza de cero

    expect(request.isCurrent(enVuelo)).toBe(false);
  });
});
