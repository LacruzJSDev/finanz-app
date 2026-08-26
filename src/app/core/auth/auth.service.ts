import { Injectable, computed, inject, signal } from '@angular/core';
import { catchError, finalize, Observable, of, shareReplay, tap } from 'rxjs';
import {
  AuthService as AuthApi,
  ChangePasswordRequest,
  LoginRequest,
  UserRead,
  RegisterRequest,
} from '../../api';
import { UsersService } from '../users/users.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authApi = inject(AuthApi);
  private readonly usersService = inject(UsersService);

  private readonly currentUserSignal = signal<UserRead | null>(null);
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  private refreshInFlight$: Observable<UserRead | null> | null = null;

  login(credentials: LoginRequest) {
    return this.authApi
      .loginApiV1AuthLoginPost(credentials)
      .pipe(tap((user) => this.currentUserSignal.set(user)));
  }

  register(payload: RegisterRequest) {
    return this.authApi
      .registerApiV1AuthRegisterPost(payload)
      .pipe(tap((user) => this.currentUserSignal.set(user)));
  }

  logout() {
    return this.authApi.logoutApiV1AuthLogoutPost().pipe(
      tap(() => {
        this.currentUserSignal.set(null);
      }),
    );
  }

  changePassword(payload: ChangePasswordRequest) {
    return this.authApi.changePasswordApiV1AuthChangePasswordPatch(payload);
  }

  refresh(): Observable<UserRead | null> {
    if (!this.refreshInFlight$) {
      this.refreshInFlight$ = this.authApi.refreshApiV1AuthRefreshPost().pipe(
        tap((user) => this.currentUserSignal.set(user)),
        catchError(() => {
          this.currentUserSignal.set(null);
          return of(null);
        }),
        finalize(() => (this.refreshInFlight$ = null)),
        shareReplay(1),
      );
    }
    return this.refreshInFlight$;
  }

  bootstrap() {
    return this.usersService.getMe().pipe(
      tap((user) => this.currentUserSignal.set(user)),
      catchError(() => {
        this.currentUserSignal.set(null); // 401 = no había sesión válida, no es un error real
        return of(null);
      }),
    );
  }
}
