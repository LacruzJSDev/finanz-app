import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { AuthService } from './auth.service';
import { guestGuard } from './guest.guard';

/** Solo hace falta saber si hay sesión: el guard no mira nada más. */
class AuthFalso {
  constructor(private readonly conSesion: boolean) {}
  isAuthenticated = () => this.conSesion;
}

function ejecutar(conSesion: boolean) {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: AuthService, useValue: new AuthFalso(conSesion) }],
  });
  return TestBed.runInInjectionContext(() => guestGuard(null as never, null as never));
}

describe('guestGuard', () => {
  it('deja pasar a quien no ha entrado', () => {
    expect(ejecutar(false)).toBe(true);
  });

  it('manda a la aplicación a quien ya tiene sesión', () => {
    const resultado = ejecutar(true);
    expect(resultado).toBeInstanceOf(UrlTree);
    // Al mismo sitio al que lleva iniciar sesión, para que la portada y el
    // formulario no dejen a la misma persona en pantallas distintas.
    expect(TestBed.inject(Router).serializeUrl(resultado as UrlTree)).toBe('/grupos');
  });
});
