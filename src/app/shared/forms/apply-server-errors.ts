import { FormGroup } from '@angular/forms';
import { ApiError } from '../../core/http/api-error.interceptor';

const GENERIC_MESSAGE = 'No se ha podido guardar. Inténtalo de nuevo.';

// Reparte los errores de validación del back por sus campos y devuelve lo que
// no ha encontrado sitio, para pintarlo como mensaje del formulario.
export function applyServerErrors(form: FormGroup, error: unknown): string | null {
  if (!(error instanceof ApiError)) return GENERIC_MESSAGE;

  const details = error.details ?? [];
  if (details.length === 0) return error.message;

  let hasUnmapped = false;
  for (const detail of details) {
    const control = form.get(detail.field);
    if (control) {
      control.setErrors({ ...control.errors, server: detail.message });
      control.markAsTouched();
    } else {
      hasUnmapped = true;
    }
  }

  return hasUnmapped ? error.message : null;
}
