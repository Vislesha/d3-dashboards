import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  Signal,
  computed,
  effect,
} from '@angular/core';
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

/**
 * Internal interface for menu items
 */
interface IMenuItem {
  label: string;
  icon: string;
  command: () => void;
  disabled?: boolean;
  separator?: boolean;
  visible?: boolean;
}

/**
 * Widget Header Component
 *
 * Reusable Angular component that displays widget metadata and provides action access.
 * Displays widget title, action menu, filter indicators, and loading/error indicators.
 *
 * @public
 */
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
    MessageModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetHeaderComponent {
  /** Widget configuration and metadata */
  @Input({ required: true }) widget!: ID3Widget;

  /** Whether the widget is in edit mode */
  @Input() isEditMode: boolean = false;

  /** Active filters applied to the widget */
  @Input() filters: IFilterValues[] = [];

  /** Whether the widget is currently loading data */
  @Input() loading: boolean = false;

  /** Error message if the widget encountered an error */
  @Input() error: string | null = null;

  /** Emitted when a widget action is triggered */
  @Output() widgetAction = new EventEmitter<IWidgetActionEvent>();

  /** Emitted when a filter indicator is clicked to remove the filter */
  @Output() filterRemove = new EventEmitter<string>();

  /** Emitted when error indicator is clicked */
  @Output() errorClick = new EventEmitter<void>();

  // Computed signals
  titleSignal: Signal<string> = computed(() => this.widget?.title || 'Untitled Widget');
  hasFiltersSignal: Signal<boolean> = computed(() => this.filters.length > 0);
  visibleFiltersSignal: Signal<IFilterValues[]> = computed(() => this.filters.slice(0, 5));
  hiddenFiltersSignal: Signal<IFilterValues[]> = computed(() => this.filters.slice(5));
  menuItemsSignal: Signal<MenuItem[]> = computed(() => this.getMenuItems());

  /**
   * Emits widget action event
   */
  emitAction(action: 'edit' | 'delete' | 'refresh' | 'export' | 'configure'): void {
    this.widgetAction.emit({
      action,
      widgetId: this.widget.id,
      payload: action === 'export' ? { format: 'csv' } : undefined,
    });
  }

  /**
   * Emits filter remove event
   */
  onFilterRemove(filterKey: string): void {
    this.filterRemove.emit(filterKey);
  }

  /**
   * Emits error click event
   */
  onErrorClick(): void {
    this.errorClick.emit();
  }

  /**
   * Gets menu items based on edit mode and loading state
   */
  private getMenuItems(): MenuItem[] {
    const items: MenuItem[] = [];

    if (this.isEditMode) {
      items.push({
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.emitAction('edit'),
      });
      items.push({
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.emitAction('delete'),
      });
      items.push({ separator: true });
    }

    items.push({
      label: 'Refresh',
      icon: 'pi pi-refresh',
      command: () => this.emitAction('refresh'),
      disabled: this.loading,
    });
    items.push({
      label: 'Export',
      icon: 'pi pi-download',
      command: () => this.emitAction('export'),
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

  /**
   * Gets tooltip text for hidden filters
   */
  getHiddenFiltersTooltip(): string {
    const hiddenFilters = this.hiddenFiltersSignal();
    if (hiddenFilters.length === 0) {
      return '';
    }
    return 'Additional filters: ' + hiddenFilters.map(f => this.getFilterDisplayText(f)).join(', ');
  }
}

