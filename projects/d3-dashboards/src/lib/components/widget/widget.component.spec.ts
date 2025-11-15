import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { WidgetComponent } from './widget.component';
import { ID3Widget } from '../../entities/widget.interface';
import { IFilterValues } from '../../entities/filter.interface';
import { IWidgetState } from '../../entities/widget-state.interface';
import { DataService } from '../../services/data.service';
import { loadWidgetComponent } from '../../utils/widget-loader.util';
import { DialogService } from 'primeng/dynamicdialog';

// Mock data service
class MockDataService {
  fetchData = jest.fn().mockReturnValue(
    of({
      data: [{ value: 1 }, { value: 2 }],
      success: true,
      cached: false,
    })
  );
}

// Mock dialog service
class MockDialogService {
  open = jest.fn().mockReturnValue({
    onClose: {
      subscribe: jest.fn((callback) => {
        // Return unsubscribe function
        return { unsubscribe: jest.fn() };
      }),
    },
  });
}

// Mock widget loader
jest.mock('../../utils/widget-loader.util', () => ({
  loadWidgetComponent: jest.fn(),
}));

describe('WidgetComponent', () => {
  let component: WidgetComponent;
  let fixture: ComponentFixture<WidgetComponent>;
  let mockDataService: MockDataService;
  let mockDialogService: MockDialogService;
  let mockViewContainerRef: Partial<ViewContainerRef>;
  let mockChangeDetectorRef: Partial<ChangeDetectorRef>;

  const mockWidget: ID3Widget = {
    id: 'test-widget-1',
    type: 'line',
    title: 'Test Widget',
    position: { x: 0, y: 0, cols: 4, rows: 2 },
    config: {
      chartOptions: {},
    },
    dataSource: {
      type: 'static',
      data: [{ value: 1 }, { value: 2 }],
    },
  };

  beforeEach(async () => {
    mockDataService = new MockDataService();
    mockDialogService = new MockDialogService();
    mockViewContainerRef = {
      createComponent: jest.fn().mockReturnValue({
        instance: {},
        destroy: jest.fn(),
      }),
    };
    mockChangeDetectorRef = {
      markForCheck: jest.fn(),
      detectChanges: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [WidgetComponent],
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: DialogService, useValue: mockDialogService },
        { provide: ViewContainerRef, useValue: mockViewContainerRef },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetComponent);
    component = fixture.componentInstance;
    component.widget = mockWidget;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate widget configuration', () => {
    const invalidWidget = { ...mockWidget, id: '' };
    component.widget = invalidWidget;
    component.ngOnInit();
    expect(component.currentState.error).toBeTruthy();
  });

  it('should handle invalid widget type', async () => {
    (loadWidgetComponent as jest.Mock).mockRejectedValue(new Error('Unknown widget type'));
    component.widget = { ...mockWidget, type: 'invalid' as any };
    await component.ngOnInit();
    expect(component.currentState.error).toBeTruthy();
  });

  it('should load data from static data source', async () => {
    (loadWidgetComponent as jest.Mock).mockResolvedValue(class MockComponent {});
    await component.ngOnInit();
    expect(mockDataService.fetchData).not.toHaveBeenCalled(); // Static data doesn't use DataService
    expect(component.currentState.data).toEqual(mockWidget.dataSource?.data);
  });

  it('should handle data loading errors', async () => {
    (loadWidgetComponent as jest.Mock).mockResolvedValue(class MockComponent {});
    component.widget = {
      ...mockWidget,
      dataSource: {
        type: 'api',
        endpoint: 'https://api.example.com/data',
      },
    };
    mockDataService.fetchData.mockReturnValue(throwError(() => new Error('API Error')));
    await component.ngOnInit();
    // Component should handle error gracefully
    expect(component.currentState.error).toBeTruthy();
  });

  it('should emit widgetDelete event on delete action', () => {
    jest.spyOn(component.widgetDelete, 'emit');
    component.onDeleteClick();
    expect(component.widgetDelete.emit).toHaveBeenCalledWith(mockWidget.id);
  });

  it('should emit widgetAction event on action click', () => {
    jest.spyOn(component.widgetAction, 'emit');
    component.onActionClick('refresh');
    expect(component.widgetAction.emit).toHaveBeenCalledWith({
      action: 'refresh',
      widgetId: mockWidget.id,
    });
  });

  it('should clean up resources on destroy', () => {
    const destroySpy = jest.spyOn(component as any, 'cleanup');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
  });

  it('should handle widget type changes', async () => {
    (loadWidgetComponent as jest.Mock).mockResolvedValue(class MockComponent {});
    await component.ngOnInit();
    const previousComponentRef = (component as any).componentRef;

    component.widget = { ...mockWidget, type: 'bar' };
    component.ngOnChanges({
      widget: {
        previousValue: mockWidget,
        currentValue: component.widget,
        firstChange: false,
        isFirstChange: () => false,
      },
    });

    // Should clean up previous component
    expect(previousComponentRef?.destroy).toHaveBeenCalled();
  });

  it('should return state observable', () => {
    const state$ = component.getState();
    expect(state$).toBeInstanceOf(BehaviorSubject);
  });

  it('should refresh data on refresh call', async () => {
    (loadWidgetComponent as jest.Mock).mockResolvedValue(class MockComponent {});
    await component.ngOnInit();
    jest.spyOn(component as any, 'loadData');
    component.refresh();
    expect((component as any).loadData).toHaveBeenCalled();
  });
});

