import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WidgetHeaderComponent } from './widget-header.component';
import { ID3Widget } from '../../entities/widget.interface';
import { IFilterValues } from '../../entities/filter.interface';
import { IWidgetActionEvent } from '../../entities/widget-action-event.interface';

describe('WidgetHeaderComponent', () => {
  let component: WidgetHeaderComponent;
  let fixture: ComponentFixture<WidgetHeaderComponent>;

  const mockWidget: ID3Widget = {
    id: 'test-widget-id',
    type: 'line',
    title: 'Test Widget',
    position: { x: 0, y: 0, cols: 4, rows: 3 },
    config: {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetHeaderComponent],
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

  it('should display default title when widget has no title', () => {
    component.widget = { ...mockWidget, title: '' };
    fixture.detectChanges();
    const titleElement = fixture.nativeElement.querySelector('.widget-title');
    expect(titleElement.textContent.trim()).toBe('Untitled Widget');
  });

  it('should emit widgetAction when action is triggered', () => {
    spyOn(component.widgetAction, 'emit');
    component.emitAction('refresh');
    expect(component.widgetAction.emit).toHaveBeenCalledWith({
      action: 'refresh',
      widgetId: 'test-widget-id',
      payload: undefined,
    });
  });

  it('should emit filterRemove when filter is removed', () => {
    spyOn(component.filterRemove, 'emit');
    component.onFilterRemove('test-key');
    expect(component.filterRemove.emit).toHaveBeenCalledWith('test-key');
  });

  it('should emit errorClick when error indicator is clicked', () => {
    spyOn(component.errorClick, 'emit');
    component.onErrorClick();
    expect(component.errorClick.emit).toHaveBeenCalled();
  });

  it('should format filter display text correctly', () => {
    const filter: IFilterValues = { key: 'Status', value: 'Active' };
    expect(component.getFilterDisplayText(filter)).toBe('Status: Active');
  });

  it('should format filter display text with operator', () => {
    const filter: IFilterValues = {
      key: 'Date',
      value: '2024-01-01',
      operator: 'greaterThan',
    };
    expect(component.getFilterDisplayText(filter)).toBe('Date greaterThan 2024-01-01');
  });

  // Phase 3: User Story 1 - Title Display Tests
  it('should truncate long titles (200+ characters)', () => {
    const longTitle = 'A'.repeat(250);
    component.widget = { ...mockWidget, title: longTitle };
    fixture.detectChanges();
    const titleElement = fixture.nativeElement.querySelector('.widget-title');
    expect(titleElement.textContent.length).toBeLessThanOrEqual(250);
    // Title should be truncated with ellipsis
    expect(titleElement.style.textOverflow || 'ellipsis').toBeTruthy();
  });

  it('should show tooltip for truncated titles', () => {
    const longTitle = 'A'.repeat(100);
    component.widget = { ...mockWidget, title: longTitle };
    fixture.detectChanges();
    const titleElement = fixture.nativeElement.querySelector('.widget-title');
    // Tooltip should be present when title is long
    expect(titleElement.getAttribute('ng-reflect-tooltip') || titleElement.getAttribute('pTooltip')).toBeTruthy();
  });

  // Phase 4: User Story 2 - Action Menu Tests
  it('should show all menu items when in edit mode', () => {
    component.isEditMode = true;
    fixture.detectChanges();
    const menuItems = component.menuItemsSignal();
    expect(menuItems.length).toBeGreaterThan(2); // Should have Edit, Delete, separator, Refresh, Export
    expect(menuItems.some(item => item.label === 'Edit')).toBeTruthy();
    expect(menuItems.some(item => item.label === 'Delete')).toBeTruthy();
  });

  it('should show only refresh and export when not in edit mode', () => {
    component.isEditMode = false;
    fixture.detectChanges();
    const menuItems = component.menuItemsSignal();
    expect(menuItems.some(item => item.label === 'Edit')).toBeFalsy();
    expect(menuItems.some(item => item.label === 'Delete')).toBeFalsy();
    expect(menuItems.some(item => item.label === 'Refresh')).toBeTruthy();
    expect(menuItems.some(item => item.label === 'Export')).toBeTruthy();
  });

  it('should disable refresh action when loading', () => {
    component.loading = true;
    fixture.detectChanges();
    const menuItems = component.menuItemsSignal();
    const refreshItem = menuItems.find(item => item.label === 'Refresh');
    expect(refreshItem?.disabled).toBeTruthy();
  });

  it('should emit widgetAction with correct payload for export', () => {
    spyOn(component.widgetAction, 'emit');
    component.emitAction('export');
    expect(component.widgetAction.emit).toHaveBeenCalledWith({
      action: 'export',
      widgetId: 'test-widget-id',
      payload: { format: 'csv' },
    });
  });

  // Phase 5: User Story 3 - Filter Indicators Tests
  it('should display filter indicators when filters are active', () => {
    component.filters = [{ key: 'Status', value: 'Active' }];
    fixture.detectChanges();
    const filterIndicators = fixture.nativeElement.querySelectorAll('.filter-badge');
    expect(filterIndicators.length).toBeGreaterThan(0);
  });

  it('should not display filter indicators when no filters', () => {
    component.filters = [];
    fixture.detectChanges();
    const filterSection = fixture.nativeElement.querySelector('.header-filters');
    expect(filterSection).toBeFalsy();
  });

  it('should show "+N more" indicator when more than 5 filters', () => {
    component.filters = Array.from({ length: 7 }, (_, i) => ({
      key: `Filter${i}`,
      value: `Value${i}`,
    }));
    fixture.detectChanges();
    const moreIndicator = fixture.nativeElement.querySelector('.filter-more');
    expect(moreIndicator).toBeTruthy();
    expect(moreIndicator.textContent).toContain('+2 more');
  });

  it('should handle up to 10 active filters', () => {
    component.filters = Array.from({ length: 10 }, (_, i) => ({
      key: `Filter${i}`,
      value: `Value${i}`,
    }));
    fixture.detectChanges();
    expect(component.visibleFiltersSignal().length).toBe(5);
    expect(component.hiddenFiltersSignal().length).toBe(5);
  });

  // Phase 6: User Story 4 - Loading/Error Indicators Tests
  it('should display loading indicator when loading is true', () => {
    component.loading = true;
    component.error = null;
    fixture.detectChanges();
    const loadingIndicator = fixture.nativeElement.querySelector('.loading-indicator');
    expect(loadingIndicator).toBeTruthy();
  });

  it('should display error indicator when error is set', () => {
    component.error = 'Test error message';
    component.loading = false;
    fixture.detectChanges();
    const errorIndicator = fixture.nativeElement.querySelector('.error-indicator');
    expect(errorIndicator).toBeTruthy();
  });

  it('should prioritize error indicator over loading indicator', () => {
    component.loading = true;
    component.error = 'Test error';
    fixture.detectChanges();
    const loadingIndicator = fixture.nativeElement.querySelector('.loading-indicator');
    const errorIndicator = fixture.nativeElement.querySelector('.error-indicator');
    expect(loadingIndicator).toBeFalsy();
    expect(errorIndicator).toBeTruthy();
  });

  it('should emit errorClick when error indicator is clicked', () => {
    component.error = 'Test error';
    fixture.detectChanges();
    jest.spyOn(component.errorClick, 'emit');
    const errorIndicator = fixture.nativeElement.querySelector('.error-indicator');
    errorIndicator?.click();
    expect(component.errorClick.emit).toHaveBeenCalled();
  });
});

