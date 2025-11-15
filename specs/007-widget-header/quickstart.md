# Quickstart: Widget Header Component

**Feature**: 007-widget-header  
**Date**: 2025-01-27

## Overview

This guide provides a quick start for implementing the Widget Header Component. The component displays widget metadata (title, filters, loading/error states) and provides action access (edit, delete, refresh, export) through a menu.

## Prerequisites

- Angular v20.2.0
- TypeScript ~5.8.0
- PrimeNG v20.0.0
- PrimeIcons ^7.0.0
- RxJS ~7.8.0

## Implementation Steps

### 1. Create Component Structure

```bash
# Create component directory
mkdir -p projects/d3-dashboards/src/lib/components/widget-header

# Create component files
touch projects/d3-dashboards/src/lib/components/widget-header/widget-header.component.ts
touch projects/d3-dashboards/src/lib/components/widget-header/widget-header.component.html
touch projects/d3-dashboards/src/lib/components/widget-header/widget-header.component.scss
touch projects/d3-dashboards/src/lib/components/widget-header/widget-header.component.spec.ts
```

### 2. Component Implementation

#### TypeScript Component (`widget-header.component.ts`)

```typescript
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, Signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { MenuItem } from 'primeng/api';
import { ID3Widget } from '../../entities/widget.interface';
import { IFilterValues } from '../../entities/filter.interface';
import { IWidgetActionEvent } from '../../entities/widget-action-event.interface';

@Component({
  selector: 'lib-widget-header',
  templateUrl: './widget-header.component.html',
  styleUrls: ['./widget-header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MenuModule,
    BadgeModule,
    TooltipModule,
    ProgressSpinnerModule,
    MessageModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetHeaderComponent {
  @Input({ required: true }) widget!: ID3Widget;
  @Input() isEditMode: boolean = false;
  @Input() filters: IFilterValues[] = [];
  @Input() loading: boolean = false;
  @Input() error: string | null = null;

  @Output() widgetAction = new EventEmitter<IWidgetActionEvent>();
  @Output() filterRemove = new EventEmitter<string>();

  // Computed signals
  titleSignal = computed(() => this.widget?.title || 'Untitled Widget');
  hasFiltersSignal = computed(() => this.filters.length > 0);
  visibleFiltersSignal = computed(() => this.filters.slice(0, 5));
  hiddenFiltersSignal = computed(() => this.filters.slice(5));
  menuItemsSignal = computed(() => this.getMenuItems());

  // Menu reference for PrimeNG Menu
  menu: MenuItem[] = [];

  constructor() {
    // Update menu when edit mode or widget changes
    effect(() => {
      this.menu = this.menuItemsSignal();
    });
  }

  /**
   * Emits widget action event
   */
  emitAction(action: 'edit' | 'delete' | 'refresh' | 'export' | 'configure'): void {
    this.widgetAction.emit({
      action,
      widgetId: this.widget.id,
      payload: action === 'export' ? { format: 'csv' } : undefined
    });
  }

  /**
   * Emits filter remove event
   */
  onFilterRemove(filterKey: string): void {
    this.filterRemove.emit(filterKey);
  }

  /**
   * Gets menu items based on edit mode
   */
  private getMenuItems(): MenuItem[] {
    const items: MenuItem[] = [];

    if (this.isEditMode) {
      items.push({
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.emitAction('edit')
      });
      items.push({
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.emitAction('delete')
      });
      items.push({ separator: true });
    }

    items.push({
      label: 'Refresh',
      icon: 'pi pi-refresh',
      command: () => this.emitAction('refresh')
    });
    items.push({
      label: 'Export',
      icon: 'pi pi-download',
      command: () => this.emitAction('export')
    });

    return items;
  }

  /**
   * Formats filter display text
   */
  getFilterDisplayText(filter: IFilterValues): string {
    if (filter.operator) {
      return `${filter.key} ${filter.operator} ${filter.value}`;
    }
    return `${filter.key}: ${filter.value}`;
  }
}
```

#### HTML Template (`widget-header.component.html`)

```html
<div class="widget-header" [attr.data-widget-id]="widget.id">
  <!-- Title Section -->
  <div class="header-title">
    <h3 
      class="widget-title" 
      [pTooltip]="titleSignal().length > 50 ? titleSignal() : null"
      [attr.aria-label]="'Widget title: ' + titleSignal()">
      {{ titleSignal() }}
    </h3>
  </div>

  <!-- Filter Indicators -->
  <div class="header-filters" *ngIf="hasFiltersSignal()">
    <div class="filter-indicators" [class.scrollable]="filters.length > 5">
      <span
        *ngFor="let filter of visibleFiltersSignal()"
        class="filter-badge"
        [pTooltip]="getFilterDisplayText(filter)"
        (click)="onFilterRemove(filter.key)"
        [attr.aria-label]="'Remove filter: ' + getFilterDisplayText(filter)"
        role="button"
        tabindex="0">
        <p-badge [value]="getFilterDisplayText(filter)" severity="info"></p-badge>
        <i class="pi pi-times" aria-hidden="true"></i>
      </span>
      <span
        *ngIf="hiddenFiltersSignal().length > 0"
        class="filter-more"
        [pTooltip]="'Additional filters: ' + hiddenFiltersSignal().map(f => getFilterDisplayText(f)).join(', ')"
        [attr.aria-label]="hiddenFiltersSignal().length + ' more filters'">
        +{{ hiddenFiltersSignal().length }} more
      </span>
    </div>
  </div>

  <!-- State Indicators -->
  <div class="header-indicators">
    <!-- Loading Indicator -->
    <div
      *ngIf="loading && !error"
      class="loading-indicator"
      role="status"
      aria-live="polite"
      [attr.aria-label]="'Loading widget ' + titleSignal()">
      <p-progressSpinner [style]="{ width: '16px', height: '16px' }"></p-progressSpinner>
    </div>

    <!-- Error Indicator -->
    <div
      *ngIf="error"
      class="error-indicator"
      role="alert"
      aria-live="assertive"
      [pTooltip]="error"
      [attr.aria-label]="'Error: ' + error">
      <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
    </div>
  </div>

  <!-- Action Menu -->
  <div class="header-actions">
    <p-menu
      #menu
      [model]="menu"
      [popup]="true"
      [appendTo]="'body'">
    </p-menu>
    <button
      type="button"
      class="action-menu-button"
      (click)="menu.toggle($event)"
      [attr.aria-label]="'Widget actions for ' + titleSignal()"
      [attr.aria-expanded]="menu.visible"
      tabindex="0">
      <i class="pi pi-ellipsis-v" aria-hidden="true"></i>
    </button>
  </div>
</div>
```

#### SCSS Styles (`widget-header.component.scss`)

```scss
.widget-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--surface-border);
  background: var(--surface-card);
  min-height: 3.5rem;

  .header-title {
    flex: 1;
    min-width: 0; // Allows truncation

    .widget-title {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
  }

  .header-filters {
    flex-shrink: 0;

    .filter-indicators {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      max-width: 300px;

      &.scrollable {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: thin;

        &::-webkit-scrollbar {
          height: 4px;
        }
      }

      .filter-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        cursor: pointer;
        touch-action: manipulation;
        min-height: 44px; // Touch target
        min-width: 44px;
        padding: 0.25rem;

        &:hover {
          opacity: 0.8;
        }

        &:focus {
          outline: 2px solid var(--primary-color);
          outline-offset: 2px;
        }

        i {
          font-size: 0.75rem;
        }
      }

      .filter-more {
        display: inline-flex;
        align-items: center;
        padding: 0.25rem 0.5rem;
        background: var(--surface-100);
        border-radius: var(--border-radius);
        font-size: 0.875rem;
        color: var(--text-color-secondary);
        cursor: help;
      }
    }
  }

  .header-indicators {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;

    .loading-indicator,
    .error-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 44px;
      min-height: 44px;
    }

    .error-indicator {
      color: var(--red-500);
      cursor: help;
    }
  }

  .header-actions {
    flex-shrink: 0;

    .action-menu-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border: none;
      background: transparent;
      border-radius: var(--border-radius);
      cursor: pointer;
      touch-action: manipulation;
      color: var(--text-color-secondary);

      &:hover {
        background: var(--surface-hover);
        color: var(--text-color);
      }

      &:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }

      i {
        font-size: 1.25rem;
      }
    }
  }

  // Responsive adjustments
  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    gap: 0.5rem;

    .header-filters .filter-indicators {
      max-width: 200px;
    }
  }
}
```

### 3. Export Component

Add to `projects/d3-dashboards/src/lib/public-api.ts`:

```typescript
export * from './components/widget-header/widget-header.component';
```

### 4. Update Widget Component

Replace inline header in `widget.component.html`:

```html
<!-- Replace existing header section with: -->
<lib-widget-header
  [widget]="widget"
  [isEditMode]="isEditMode"
  [filters]="filters"
  [loading]="currentState.loading"
  [error]="currentState.error"
  (widgetAction)="onActionClick($event.action)"
  (filterRemove)="onFilterRemove($event)">
</lib-widget-header>
```

### 5. Write Tests

Create comprehensive unit tests in `widget-header.component.spec.ts`:

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetHeaderComponent } from './widget-header.component';
import { ID3Widget } from '../../entities/widget.interface';
import { IFilterValues } from '../../entities/filter.interface';

describe('WidgetHeaderComponent', () => {
  let component: WidgetHeaderComponent;
  let fixture: ComponentFixture<WidgetHeaderComponent>;

  const mockWidget: ID3Widget = {
    id: 'test-widget-id',
    type: 'line',
    title: 'Test Widget',
    position: { x: 0, y: 0, cols: 4, rows: 3 },
    config: {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetHeaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetHeaderComponent);
    component = fixture.componentInstance;
    component.widget = mockWidget;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display widget title', () => {
    const titleElement = fixture.nativeElement.querySelector('.widget-title');
    expect(titleElement.textContent.trim()).toBe('Test Widget');
  });

  it('should emit widgetAction when action is triggered', () => {
    spyOn(component.widgetAction, 'emit');
    component.emitAction('refresh');
    expect(component.widgetAction.emit).toHaveBeenCalledWith({
      action: 'refresh',
      widgetId: 'test-widget-id',
      payload: undefined
    });
  });

  // Add more tests...
});
```

## Integration Checklist

- [ ] Component created with all required files
- [ ] Component exported in `public-api.ts`
- [ ] Widget component updated to use new header component
- [ ] Unit tests written (80%+ coverage)
- [ ] Accessibility attributes added
- [ ] Responsive design tested
- [ ] Performance requirements verified
- [ ] Error handling implemented
- [ ] Documentation updated

## Next Steps

1. Implement component following the code above
2. Write comprehensive unit tests
3. Update widget component to use new header
4. Test integration with dashboard container
5. Verify all success criteria (SC-001 through SC-010)
6. Update documentation

## References

- [Component API Contract](./contracts/component-api-contract.md)
- [Data Model](./data-model.md)
- [Research Findings](./research.md)
- [Implementation Plan](./plan.md)

