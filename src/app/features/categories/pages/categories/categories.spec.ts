import { Component, input, output, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CategoryRead } from '../../../../core/models';
import { CategoriesService } from '../../../../core/categories/categories.service';
import { AccountGroupsService } from '../../../../core/account-groups/account-groups.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { AppSheetService } from '../../../../shared/ui/app-sheet';
import { Categories } from './categories';

@Component({
  selector: 'app-page-content',
  standalone: true,
  template: '<ng-content />',
})
class PageContentStub {}

@Component({
  selector: 'app-categories-list',
  standalone: true,
  template: '<div data-testid="categories-list"></div>',
})
class CategoriesListStub {
  readonly categories = input.required<CategoryRead[]>();
  readonly blockedIds = input<ReadonlySet<string>>(new Set());
  readonly canManage = input(false);
  readonly editClick = output<CategoryRead>();
  readonly toggleActive = output<CategoryRead>();
}

@Component({ selector: 'app-page-loader', standalone: true, template: '' })
class PageLoaderStub {}

@Component({ selector: 'app-empty-state', standalone: true, template: '' })
class EmptyStateStub {
  readonly icon = input('');
  readonly message = input('');
  readonly hint = input('');
}

@Component({ selector: 'app-starter-categories', standalone: true, template: '' })
class StarterCategoriesStub {
  readonly count = input(0);
  readonly creating = input(false);
  readonly create = output<void>();
}

@Component({ selector: 'app-icon', standalone: true, template: '' })
class IconStub {
  readonly name = input('');
}

const category = (
  id: string,
  is_active: boolean,
  parent_id: string | null = null,
): CategoryRead => ({
  id,
  group_id: 'group-1',
  parent_id,
  name: id,
  color: '#000000',
  icon: null,
  is_active,
  created_by: null,
  updated_by: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
});

describe('Categories archived view', () => {
  let fixture: ComponentFixture<Categories>;
  let categoriesService: {
    categories: ReturnType<typeof signal<CategoryRead[]>>;
    loading: ReturnType<typeof signal<boolean>>;
    getCategories: ReturnType<typeof vi.fn>;
  };

  const listComponents = () => fixture.debugElement.queryAll(By.directive(CategoriesListStub));
  const listCategoryIds = () =>
    listComponents()[0]
      .componentInstance.categories()
      .map((item: CategoryRead) => item.id);

  beforeEach(() => {
    categoriesService = {
      categories: signal<CategoryRead[]>([
        category('active-parent', true),
        category('archived-child', false, 'active-parent'),
      ]),
      loading: signal(false),
      getCategories: vi.fn(() => of({ items: [] })),
    };

    TestBed.configureTestingModule({
      imports: [Categories],
      providers: [
        { provide: CategoriesService, useValue: categoriesService },
        { provide: AccountGroupsService, useValue: { groups: signal([]) } },
        { provide: AuthService, useValue: { currentUser: signal(null) } },
        { provide: AppSheetService, useValue: { open: vi.fn() } },
      ],
    });
    TestBed.overrideComponent(Categories, {
      set: {
        imports: [
          CategoriesListStub,
          PageContentStub,
          PageLoaderStub,
          EmptyStateStub,
          StarterCategoriesStub,
          IconStub,
        ],
      },
    });

    fixture = TestBed.createComponent(Categories);
    fixture.componentRef.setInput('id', 'group-1');
    fixture.detectChanges();
  });

  it('renders one page content and one active list, including no archived child', () => {
    expect(fixture.debugElement.queryAll(By.css('app-page-content'))).toHaveLength(1);
    expect(listComponents()).toHaveLength(1);
    expect(listCategoryIds()).toEqual(['active-parent']);
    expect(fixture.nativeElement.textContent).toContain('Ver categorías archivadas (1)');
  });

  it('shows the archived child in the same list and returns to active categories', () => {
    const toggle = fixture.nativeElement.querySelector(
      '.archived-toggle',
    ) as HTMLButtonElement | null;
    expect(toggle).not.toBeNull();

    toggle!.click();
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('app-page-content'))).toHaveLength(1);
    expect(listComponents()).toHaveLength(1);
    expect(listCategoryIds()).toEqual(['archived-child']);
    expect(fixture.nativeElement.textContent).toContain('Volver a categorías activas');

    toggle!.click();
    fixture.detectChanges();

    expect(listComponents()).toHaveLength(1);
    expect(listCategoryIds()).toEqual(['active-parent']);
    expect(fixture.nativeElement.textContent).toContain('Ver categorías archivadas (1)');
  });
});
