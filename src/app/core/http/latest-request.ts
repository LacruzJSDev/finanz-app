/**
 * Descarta las respuestas que han dejado de interesar.
 *
 * Las respuestas HTTP llegan en el orden que quiere la red, no en el que se
 * pidieron. Si una pantalla lanza una carga y enseguida otra —cambiar de grupo,
 * de cuenta, de filtro—, la primera puede llegar la última y escribir encima de
 * la buena. No da ningún error: se ven datos de otro sitio.
 *
 * Cada carga pide un testigo antes de salir y lo comprueba al llegar. Si por el
 * camino ha empezado otra, el testigo ya no es el vigente y la respuesta se tira.
 */
export class LatestRequest {
  private token = 0;

  /** Empieza una carga nueva. Invalida las que estuvieran en vuelo. */
  next(): number {
    return ++this.token;
  }

  /**
   * El testigo en curso, para una petición que continúa la misma carga en vez
   * de empezar otra: la página siguiente de una lista que se va acumulando.
   */
  current(): number {
    return this.token;
  }

  isCurrent(token: number): boolean {
    return token === this.token;
  }
}
