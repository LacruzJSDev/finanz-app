import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { describe, beforeEach, expect, it } from 'vitest';
import { TransactionsService } from './transactions.service';
import {
  PaginatedResponseTransactionRead,
  TransactionsService as TransactionsApi,
} from '../../api';

type Respuesta = Subject<PaginatedResponseTransactionRead>;

/** Cada llamada devuelve un Subject, para decidir a mano cuándo y en qué orden responde. */
class ApiFalsa {
  readonly enVuelo: Respuesta[] = [];
  readonly queries: unknown[][] = [];

  queryTransactionsApiV1TransactionsGet(...query: unknown[]) {
    this.queries.push(query);
    const respuesta: Respuesta = new Subject();
    this.enVuelo.push(respuesta);
    return respuesta.asObservable();
  }
}

const pagina = (ids: string[], total: number) =>
  ({ items: ids.map((id) => ({ id })), total }) as unknown as PaginatedResponseTransactionRead;

const responde = (r: Respuesta, datos: PaginatedResponseTransactionRead) => {
  r.next(datos);
  r.complete();
};

describe('TransactionsService, respuestas fuera de orden', () => {
  let api: ApiFalsa;
  let service: TransactionsService;

  beforeEach(() => {
    api = new ApiFalsa();
    TestBed.configureTestingModule({ providers: [{ provide: TransactionsApi, useValue: api }] });
    service = TestBed.inject(TransactionsService);
  });

  it('ignora la lista de la cuenta anterior aunque llegue la última', () => {
    service.getTransactions({ groupId: 'grupo-A', accountId: 'cuenta-A' }, 20, 0).subscribe();
    service.getTransactions({ groupId: 'grupo-B', accountId: 'cuenta-B' }, 20, 0).subscribe();

    responde(api.enVuelo[1], pagina(['de-B'], 1)); // B, la buena, llega primero
    responde(api.enVuelo[0], pagina(['de-A'], 1)); // A, la vieja, llega después

    expect(service.transactions().map((t) => t.id)).toEqual(['de-B']);
  });

  it('no pega una página al final de una lista que ya se recargó', () => {
    service.getTransactions({ groupId: 'grupo-A', accountId: 'cuenta-A' }, 20, 0).subscribe();
    responde(api.enVuelo[0], pagina(['t0', 't1'], 5));

    service.getTransactions({ groupId: 'grupo-A', accountId: 'cuenta-A' }, 20, 2).subscribe(); // el scroll pide más
    service.getTransactions({ groupId: 'grupo-A', accountId: 'cuenta-A' }, 20, 0).subscribe(); // y se guarda un movimiento
    responde(api.enVuelo[2], pagina(['t0', 't1'], 5)); // llega la recarga
    responde(api.enVuelo[1], pagina(['t2', 't3'], 5)); // y luego la página vieja

    expect(service.transactions().map((t) => t.id)).toEqual(['t0', 't1']);
  });

  it('sí acumula la página siguiente cuando nadie ha recargado en medio', () => {
    service.getTransactions({ groupId: 'grupo-A', accountId: 'cuenta-A' }, 20, 0).subscribe();
    responde(api.enVuelo[0], pagina(['t0', 't1'], 4));
    service.getTransactions({ groupId: 'grupo-A', accountId: 'cuenta-A' }, 20, 2).subscribe();
    responde(api.enVuelo[1], pagina(['t2', 't3'], 4));

    expect(service.transactions().map((t) => t.id)).toEqual(['t0', 't1', 't2', 't3']);
  });

  it('no deja loadingMore encendido cuando su página se descarta', () => {
    service.getTransactions({ groupId: 'grupo-A', accountId: 'cuenta-A' }, 20, 0).subscribe();
    responde(api.enVuelo[0], pagina(['t0'], 3));

    service.getTransactions({ groupId: 'grupo-A', accountId: 'cuenta-A' }, 20, 1).subscribe(); // scroll en vuelo
    expect(service.loadingMore()).toBe(true);

    service.getTransactions({ groupId: 'grupo-A', accountId: 'cuenta-A' }, 20, 0).subscribe(); // recarga que lo invalida
    responde(api.enVuelo[2], pagina(['t0'], 3));
    responde(api.enVuelo[1], pagina(['t1'], 3)); // la abandonada termina

    // Si se quedara encendido, canLoadMore sería siempre false y el scroll
    // infinito dejaría de pedir nada.
    expect(service.loadingMore()).toBe(false);
  });

  it('envía los filtros al listado del grupo manteniendo el ámbito de cuenta', () => {
    service
      .getTransactions(
        {
          groupId: 'grupo-A',
          accountId: 'cuenta-A',
          categoryId: 'categoria-A',
          q: 'supermercado',
        },
        20,
        0,
      )
      .subscribe();

    expect(api.queries[0]).toEqual([
      'grupo-A',
      20,
      0,
      'cuenta-A',
      'categoria-A',
      undefined,
      undefined,
      undefined,
      undefined,
      'supermercado',
    ]);
  });
});
