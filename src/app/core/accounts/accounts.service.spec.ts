import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { describe, beforeEach, expect, it } from 'vitest';
import { AccountsService } from './accounts.service';
import { AccountsService as AccountsApi, AccountRead } from '../../api';

type Respuesta = Subject<{ items: AccountRead[] }>;

class ApiFalsa {
  readonly enVuelo: Respuesta[] = [];
  getAccountsApiV1AccountsGet() {
    const respuesta: Respuesta = new Subject();
    this.enVuelo.push(respuesta);
    return respuesta.asObservable();
  }
}

const cuentas = (nombres: string[]) =>
  ({ items: nombres.map((name) => ({ name })) }) as unknown as { items: AccountRead[] };

describe('AccountsService, respuestas fuera de orden', () => {
  let api: ApiFalsa;
  let service: AccountsService;

  beforeEach(() => {
    api = new ApiFalsa();
    TestBed.configureTestingModule({ providers: [{ provide: AccountsApi, useValue: api }] });
    service = TestBed.inject(AccountsService);
  });

  it('ignora las cuentas del grupo anterior aunque lleguen las últimas', () => {
    service.getAccounts('grupo-A').subscribe();
    service.getAccounts('grupo-B').subscribe(); // el usuario cambia de grupo

    api.enVuelo[1].next(cuentas(['de-B']));
    api.enVuelo[1].complete();
    api.enVuelo[0].next(cuentas(['de-A'])); // la vieja llega tarde
    api.enVuelo[0].complete();

    expect(service.accounts().map((a) => a.name)).toEqual(['de-B']);
  });

  it('deja el spinner encendido mientras la carga vigente sigue en vuelo', () => {
    service.getAccounts('grupo-A').subscribe();
    service.getAccounts('grupo-B').subscribe();

    api.enVuelo[0].next(cuentas(['de-A'])); // termina la vieja
    api.enVuelo[0].complete();

    // Apagarlo aquí dejaría la pantalla sin spinner con la lista aún cargando.
    expect(service.loading()).toBe(true);
  });
});
