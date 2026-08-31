import { Injectable, inject, signal } from '@angular/core';
import { finalize, tap } from 'rxjs';
import { AccountGroupsService as AccountGroupsApi, GroupOverviewRead } from '../../api';
import { LatestRequest } from '../http/latest-request';

/**
 * El resumen del grupo: patrimonio, gasto de hoy, saldo real y la proyección
 * hasta el cobro, todo calculado contra el mismo día y la misma ancla.
 *
 * Servicio propio y no un método más de `account-groups` porque no es la
 * entidad grupo: es un modelo de lectura que compone datos de cuentas,
 * transacciones y planes de pago, y tiene su propia carga y su propio estado.
 */
@Injectable({ providedIn: 'root' })
export class OverviewService {
  private readonly api = inject(AccountGroupsApi);

  private readonly overviewSignal = signal<GroupOverviewRead | null>(null);
  readonly overview = this.overviewSignal.asReadonly();

  private readonly loadingSignal = signal(false);
  readonly loading = this.loadingSignal.asReadonly();

  // Cambiar de grupo de trabajo relanza el resumen desde la misma pantalla.
  private readonly overviewRequest = new LatestRequest();

  getGroupOverview(groupId: string) {
    const token = this.overviewRequest.next();
    this.loadingSignal.set(true);
    return this.api.getGroupOverviewApiV1AccountGroupsGroupIdOverviewGet(groupId).pipe(
      tap((overview) => {
        if (!this.overviewRequest.isCurrent(token)) return;
        this.overviewSignal.set(overview);
      }),
      finalize(() => {
        if (this.overviewRequest.isCurrent(token)) this.loadingSignal.set(false);
      }),
    );
  }
}
