import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

/** Una cosa que la aplicación hace, tal como se cuenta en la portada. */
interface LandingFeature {
  icon: string;
  title: string;
  text: string;
}

@Component({
  selector: 'app-landing',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
  // Solo lo que existe y se puede usar hoy. Una portada que promete pantallas
  // que no están se cobra la confianza en el primer minuto dentro.
  protected readonly features: readonly LandingFeature[] = [
    {
      icon: 'groups',
      title: 'Cuentas compartidas',
      text: 'Invita a quien comparte los gastos contigo. Cada uno con su papel: quién puede tocar las cuentas y quién solo mirarlas.',
    },
    {
      icon: 'account_balance_wallet',
      title: 'Tus cuentas, con su saldo',
      text: 'La cuenta del banco, el efectivo o la tarjeta. Cada una con lo que tiene ahora mismo.',
    },
    {
      icon: 'swap_horiz',
      title: 'Ingresos, gastos y traspasos',
      text: 'Apunta lo que entra y lo que sale, y mueve dinero de una cuenta a otra sin descuadrar ninguna de las dos.',
    },
    {
      icon: 'category',
      title: 'Categorías a tu medida',
      text: 'Con subcategorías, color e icono. Y si empiezas de cero, un cuadro entero hecho de una vez.',
    },
    {
      icon: 'event_repeat',
      title: 'Lo que se repite todos los meses',
      text: 'El alquiler, el seguro, la cuota del gimnasio. Se apuntan una vez y sabes cuándo toca el siguiente.',
    },
    {
      icon: 'insights',
      title: 'En qué se va el mes',
      text: 'El resumen del grupo y el desglose por categorías de cada cuenta, mes a mes.',
    },
  ];
}
