import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import {
  PaymentPlansService as PaymentPlansApi,
  CreatePaymentPlanRequest,
  PaymentPlanRead,
  UpdatePaymentPlanRequest,
} from '../../api';

@Injectable({ providedIn: 'root' })
export class PaymentPlansService {
  private readonly api = inject(PaymentPlansApi);

  private readonly paymentPlansSignal = signal<PaymentPlanRead[]>([]);
  readonly paymentPlans = this.paymentPlansSignal.asReadonly();
  private readonly paymentPlanSignal = signal<PaymentPlanRead | null>(null);
  readonly paymentPlan = this.paymentPlanSignal.asReadonly();

  getPaymentPlans(accountId: string) {
    return this.api.getPaymentPlansApiV1AccountsAccountIdPaymentPlansGet(accountId).pipe(
      tap((res) => {
        this.paymentPlansSignal.set(res.items);
      }),
    );
  }

  createPaymentPlan(accountId: string, payload: CreatePaymentPlanRequest) {
    return this.api
      .createPaymentPlanApiV1AccountsAccountIdPaymentPlansPost(accountId, payload)
      .pipe(
        tap((paymentPlan) => {
          this.paymentPlansSignal.update((paymentPlans) => [...paymentPlans, paymentPlan]);
        }),
      );
  }

  updatePaymentPlan(accountId: string, paymentPlanId: string, payload: UpdatePaymentPlanRequest) {
    return this.api
      .updatePaymentPlanApiV1AccountsAccountIdPaymentPlansPaymentPlanIdPatch(
        accountId,
        paymentPlanId,
        payload,
      )
      .pipe(
        tap((paymentPlan) => {
          this.paymentPlansSignal.update((paymentPlans) => {
            return paymentPlans.map((p) => (p.id === paymentPlan.id ? paymentPlan : p));
          });
        }),
      );
  }

  getPaymentPlanById(accountId: string, paymentPlanId: string) {
    return this.api
      .getPaymentPlanApiV1AccountsAccountIdPaymentPlansPaymentPlanIdGet(accountId, paymentPlanId)
      .pipe(
        tap((paymentPlan) => {
          this.paymentPlansSignal.update((paymentPlans) => {
            return paymentPlans.map((p) => (p.id === paymentPlan.id ? paymentPlan : p));
          });
          this.paymentPlanSignal.set(paymentPlan);
        }),
      );
  }
}
