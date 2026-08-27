import { Pipe, PipeTransform } from '@angular/core';
import { CategoryRead } from '../../../core/models';

@Pipe({ name: 'categoryName' })
export class CategoryNamePipe implements PipeTransform {
  transform(categoryId: string | null | undefined, categories: CategoryRead[]): string {
    if (!categoryId) return 'Sin categoría';
    return categories.find((c) => c.id === categoryId)?.name ?? 'Sin categoría';
  }
}
