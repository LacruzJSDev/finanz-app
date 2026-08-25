import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CategoryRead } from '../../../../api';
import { IconOrDefaultPipe } from '../../../../shared/icons/icon-or-default.pipe';

@Component({
  selector: 'app-category-card',
  imports: [MatCardModule, MatIconModule, MatButtonModule, IconOrDefaultPipe],
  templateUrl: 'category-card.html',
  styleUrl: 'category-card.scss',
})
export class CategoryCard {
  readonly category = input.required<CategoryRead>();
  readonly children = input<CategoryRead[]>([]);

  readonly editClick = output<CategoryRead>();
  readonly archiveClick = output<CategoryRead>();
}
