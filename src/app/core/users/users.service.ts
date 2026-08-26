import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { UsersService as UsersApi, UpdateUserRequest, UserRead } from '../../api';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly api = inject(UsersApi);

  private readonly userSignal = signal<UserRead | null>(null);
  readonly user = this.userSignal.asReadonly();

  getMe() {
    return this.api.getMeApiV1MeGet().pipe(
      tap((user) => {
        this.userSignal.set(user);
      }),
    );
  }

  updateMe(payload: UpdateUserRequest) {
    return this.api.updateMeApiV1MePatch(payload).pipe(
      tap((user) => {
        this.userSignal.set(user);
      }),
    );
  }
}
