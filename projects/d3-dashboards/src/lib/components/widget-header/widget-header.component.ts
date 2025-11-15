import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  Signal,
  computed,
  effect,
  HostListener,
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
  /**
   * Widget configuration and metadata.
   * Required input that provides widget information including title, id, and type.
   */
  @Input({ required: true }) widget!: ID3Widget;

  /**
   * Whether the widget is in edit mode.
   * When true, edit and delete actions are available in the action menu.
   * Default: false
   */
  @Input() isEditMode: boolean = false;

  /**
   * Active filters applied to the widget.
   * Array of filter values that will be displayed as filter indicators.
   * Default: []
   */
  @Input() filters: IFilterValues[] = [];

  /**
   * Whether the widget is currently loading data.
   * When true, a loading indicator is displayed and refresh action is disabled.
   * Default: false
   */
  @Input() loading: boolean = false;

  /**
   * Error message if the widget encountered an error.
   * When set, an error indicator is displayed (takes precedence over loading indicator).
   * Default: null
   */
  @Input() error: string | null = null;

  /**
   * Emitted when a widget action is triggered (edit, delete, refresh, export, configure).
   * The event contains the action type, widget ID, and optional payload.
   */
  @Output() widgetAction = new EventEmitter<IWidgetActionEvent>();

  /**
   * Emitted when a filter indicator is clicked to remove the filter.
   * The event contains the filter key to be removed.
   */
  @Output() filterRemove = new EventEmitter<string>();

  /**
   * Emitted when error indicator is clicked.
   * Parent component should handle retry or show error details.
   */
  @Output() errorClick = new EventEmitter<void>();

  // Computed signals for reactive state management
  /** Computed signal that returns widget title or "Untitled Widget" if empty */
  titleSignal: Signal<string> = computed(() => this.widget?.title || 'Untitled Widget');
  
  /** Computed signal that returns true if filters are active */
  hasFiltersSignal: Signal<boolean> = computed(() => this.filters.length > 0);
  
  /** Computed signal that returns first 5 visible filter indicators */
  visibleFiltersSignal: Signal<IFilterValues[]> = computed(() => this.filters.slice(0, 5));
  
  /** Computed signal that returns hidden filters beyond the first 5 */
  hiddenFiltersSignal: Signal<IFilterValues[]> = computed(() => this.filters.slice(5));
  
  /** Computed signal that returns menu items based on edit mode and loading state */
  menuItemsSignal: Signal<MenuItem[]> = computed(() => this.getMenuItems());

  /**
   * Emits widget action event.
   * Creates an IWidgetActionEvent with the specified action, widget ID, and optional payload.
   * 
   * @param action - The action type to emit (edit, delete, refresh, export, or configure)
   */
  emitAction(action: 'edit' | 'delete' | 'refresh' | 'export' | 'configure'): void {
    this.widgetAction.emit({
      action,
      widgetId: this.widget.id,
      payload: action === 'export' ? { format: 'csv' } : undefined,
    });
  }

  /**
   * Emits filter remove event.
   * Called when a filter indicator is clicked to remove the filter.
   * 
   * @param filterKey - The key of the filter to remove
   */
  onFilterRemove(filterKey: string): void {
    this.filterRemove.emit(filterKey);
  }

  /**
   * Emits error click event.
   * Called when the error indicator is clicked, typically to trigger a retry or show error details.
   */
  onErrorClick(): void {
    this.errorClick.emit();
  }

  /**
   * Gets menu items based on edit mode and loading state.
   * Returns an array of PrimeNG MenuItem objects configured for the action menu.
   * Edit and Delete items are only included when in edit mode.
   * Refresh action is disabled when loading.
   * 
   * @returns Array of menu items for the action menu
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
   * Formats filter display text.
   * Returns a formatted string in "Key: Value" or "Key operator Value" format.
   * 
   * @param filter - The filter to format
   * @returns Formatted filter display text
   */
  getFilterDisplayText(filter: IFilterValues): string {
    if (filter.operator) {
      return `${filter.key} ${filter.operator} ${filter.value}`;
    }
    return `${filter.key}: ${filter.value}`;
  }

  /**
   * Gets tooltip text for hidden filters.
   * Returns a formatted string listing all hidden filters (beyond the first 5).
   * 
   * @returns Formatted string with all hidden filters, or empty string if none
   */
  getHiddenFiltersTooltip(): string {
    const hiddenFilters = this.hiddenFiltersSignal();
    if (hiddenFilters.length === 0) {
      return '';
    }
    return 'Additional filters: ' + hiddenFilters.map(f => this.getFilterDisplayText(f)).join(', ');
  }

  /**
   * Handles keyboard navigation - Escape key closes menu.
   * PrimeNG Menu handles other keyboard navigation internally.
   * 
   * @param event Keyboard event
   */
  @HostListener('keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    // Menu component handles escape key internally via PrimeNG
    // This is here for potential future custom keyboard handling
    event.stopPropagation();
  }
}

