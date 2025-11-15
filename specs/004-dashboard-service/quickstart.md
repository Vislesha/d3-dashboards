# Quickstart: Dashboard Service

**Feature**: 004-dashboard-service  
**Date**: 2025-01-27

## Overview

The Dashboard Service provides dashboard CRUD operations, widget management, configuration persistence, and state management for the D3 dashboards application. It enables creating, loading, updating, and deleting dashboards, managing widgets within dashboards, and maintaining consistent dashboard state across the application.

## Installation

The Dashboard Service is part of the `d3-dashboards` library. Import it in your Angular component or service:

```typescript
import { DashboardService } from '@d3-dashboards/dashboard-service';
import { IDashboard, ID3Widget, IDashboardState } from '@d3-dashboards/entities';
```

## Basic Usage

### 1. Inject the Service

```typescript
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '@d3-dashboards/dashboard-service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `<!-- your template -->`
})
export class DashboardComponent implements OnInit, OnDestroy {
  private dashboardService = inject(DashboardService);
  private destroy$ = new Subject<void>();
  
  ngOnInit(): void {
    // Use service methods here
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### 2. Create a Dashboard

```typescript
// Define dashboard configuration
const config = {
  title: 'Sales Dashboard',
  description: 'Monthly sales performance metrics',
  widgets: []
};

// Create dashboard
this.dashboardService.create(config).subscribe({
  next: (dashboardId) => {
    console.log('Dashboard created with ID:', dashboardId);
    // Use dashboardId to load the dashboard later
  },
  error: (error) => {
    console.error('Failed to create dashboard:', error.message);
  }
});
```

### 3. Load a Dashboard

```typescript
const dashboardId = '550e8400-e29b-41d4-a716-446655440000';

this.dashboardService.load(dashboardId).subscribe({
  next: (dashboard) => {
    console.log('Dashboard loaded:', dashboard.title);
    console.log('Widgets:', dashboard.widgets.length);
    // Use dashboard in your component
  },
  error: (error) => {
    if (error.code === 'DASHBOARD_NOT_FOUND') {
      console.error('Dashboard not found');
    } else {
      console.error('Failed to load dashboard:', error.message);
    }
  }
});
```

### 4. List All Dashboards

```typescript
this.dashboardService.list().subscribe({
  next: (dashboards) => {
    console.log(`Found ${dashboards.length} dashboards`);
    dashboards.forEach(dashboard => {
      console.log(`- ${dashboard.title} (${dashboard.widgets.length} widgets)`);
    });
  },
  error: (error) => {
    console.error('Failed to list dashboards:', error.message);
  }
});
```

### 5. Update a Dashboard

```typescript
// Load dashboard first
this.dashboardService.load(dashboardId).subscribe({
  next: (dashboard) => {
    // Update dashboard
    const updated = {
      ...dashboard,
      title: 'Updated Dashboard Title',
      description: 'New description'
    };
    
    // Save updated dashboard
    this.dashboardService.update(updated).subscribe({
      next: (saved) => {
        console.log('Dashboard updated, new version:', saved.version);
      },
      error: (error) => {
        if (error.code === 'CONCURRENT_MODIFICATION') {
          console.error('Dashboard was modified by another user. Please reload.');
        } else {
          console.error('Failed to update dashboard:', error.message);
        }
      }
    });
  }
});
```

### 6. Delete a Dashboard

```typescript
this.dashboardService.delete(dashboardId).subscribe({
  next: (deleted) => {
    if (deleted) {
      console.log('Dashboard deleted successfully');
    } else {
      console.log('Dashboard not found');
    }
  },
  error: (error) => {
    console.error('Failed to delete dashboard:', error.message);
  }
});
```

## Widget Management

### 7. Add a Widget to a Dashboard

```typescript
import { ID3Widget } from '@d3-dashboards/entities';

const widget: ID3Widget = {
  id: 'widget-123',
  type: 'line',
  position: {
    x: 0,
    y: 0,
    cols: 4,
    rows: 3
  },
  title: 'Sales Chart',
  config: {
    chartOptions: {
      // Chart configuration
    }
  },
  dataSource: {
    type: 'api',
    endpoint: '/api/sales-data',
    method: 'GET'
  }
};

this.dashboardService.addWidget(dashboardId, widget).subscribe({
  next: (dashboard) => {
    console.log('Widget added, dashboard now has', dashboard.widgets.length, 'widgets');
  },
  error: (error) => {
    if (error.code === 'WIDGET_VALIDATION_ERROR') {
      console.error('Widget validation failed:', error.message);
    } else if (error.code === 'WIDGET_ID_CONFLICT') {
      console.error('Widget ID already exists');
    } else {
      console.error('Failed to add widget:', error.message);
    }
  }
});
```

### 8. Update a Widget

```typescript
// Load dashboard first
this.dashboardService.load(dashboardId).subscribe({
  next: (dashboard) => {
    // Find widget to update
    const widget = dashboard.widgets.find(w => w.id === 'widget-123');
    
    if (widget) {
      // Update widget
      const updated: ID3Widget = {
        ...widget,
        title: 'Updated Chart Title',
        config: {
          ...widget.config,
          chartOptions: {
            // Updated chart configuration
          }
        }
      };
      
      // Save updated widget
      this.dashboardService.updateWidget(dashboardId, updated).subscribe({
        next: (dashboard) => {
          console.log('Widget updated successfully');
        },
        error: (error) => {
          if (error.code === 'WIDGET_NOT_FOUND') {
            console.error('Widget not found');
          } else {
            console.error('Failed to update widget:', error.message);
          }
        }
      });
    }
  }
});
```

### 9. Remove a Widget

```typescript
this.dashboardService.removeWidget(dashboardId, 'widget-123').subscribe({
  next: (dashboard) => {
    console.log('Widget removed, remaining widgets:', dashboard.widgets.length);
  },
  error: (error) => {
    if (error.code === 'WIDGET_NOT_FOUND') {
      console.error('Widget not found');
    } else {
      console.error('Failed to remove widget:', error.message);
    }
  }
});
```

## State Management

### 10. Subscribe to State Changes

```typescript
this.dashboardService.getState()
  .pipe(takeUntil(this.destroy$))
  .subscribe({
    next: (state: IDashboardState) => {
      console.log('Active dashboard:', state.activeDashboardId);
      console.log('Edit mode:', state.editMode);
      console.log('Filters:', state.filters);
      console.log('Selected widgets:', state.selectedWidgets);
      
      // Update UI based on state
      if (state.activeDashboardId) {
        this.loadDashboard(state.activeDashboardId);
      }
    }
  });
```

### 11. Update State

```typescript
// Set active dashboard
this.dashboardService.updateState({
  activeDashboardId: 'dashboard-123',
  editMode: true
});

// Update filters
this.dashboardService.updateState({
  filters: [
    { key: 'date', value: '2025-01', operator: 'equals' }
  ]
});

// Select widgets
this.dashboardService.updateState({
  selectedWidgets: ['widget-123', 'widget-456']
});
```

### 12. Get Current State Synchronously

```typescript
const state = this.dashboardService.getCurrentState();

if (state.activeDashboardId) {
  console.log('Currently viewing dashboard:', state.activeDashboardId);
}

if (state.editMode) {
  console.log('Dashboard is in edit mode');
}
```

### 13. Reset State

```typescript
this.dashboardService.resetState();
// State is now reset to initial values:
// - activeDashboardId: null
// - editMode: false
// - filters: []
// - selectedWidgets: []
```

## Validation

### 14. Validate Dashboard Before Save

```typescript
const dashboard: IDashboard = {
  id: 'dashboard-123',
  title: 'My Dashboard',
  widgets: [],
  version: 1,
  createdAt: new Date(),
  updatedAt: new Date()
};

const validation = this.dashboardService.validateDashboard(dashboard);

if (!validation.valid) {
  console.error('Dashboard validation failed:');
  validation.errors.forEach(error => console.error(`- ${error}`));
} else {
  // Dashboard is valid, proceed with save
  this.dashboardService.update(dashboard).subscribe({
    next: (saved) => {
      console.log('Dashboard saved successfully');
    }
  });
}
```

### 15. Validate Widget Before Add

```typescript
const widget: ID3Widget = {
  id: 'widget-123',
  type: 'line',
  position: { x: 0, y: 0, cols: 4, rows: 3 },
  title: 'My Chart',
  config: {}
};

const validation = this.dashboardService.validateWidget(widget);

if (!validation.valid) {
  console.error('Widget validation failed:');
  validation.errors.forEach(error => console.error(`- ${error}`));
} else {
  // Widget is valid, proceed with add
  this.dashboardService.addWidget(dashboardId, widget).subscribe({
    next: (dashboard) => {
      console.log('Widget added successfully');
    }
  });
}
```

## Complete Example: Dashboard Component

```typescript
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '@d3-dashboards/dashboard-service';
import { IDashboard, ID3Widget, IDashboardState } from '@d3-dashboards/entities';
import { Subject, Observable } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div *ngIf="dashboard$ | async as dashboard">
      <h1>{{ dashboard.title }}</h1>
      <p>{{ dashboard.description }}</p>
      <div>
        <button (click)="toggleEditMode()">
          {{ editMode ? 'Exit Edit' : 'Edit' }}
        </button>
        <button (click)="saveDashboard()">Save</button>
      </div>
      <div class="widgets">
        <app-widget
          *ngFor="let widget of dashboard.widgets"
          [widget]="widget"
          [editMode]="editMode"
          (remove)="removeWidget(widget.id)"
        ></app-widget>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  private dashboardService = inject(DashboardService);
  private destroy$ = new Subject<void>();
  
  dashboard$: Observable<IDashboard | null> = new Observable();
  editMode = false;
  dashboardId: string | null = null;
  
  ngOnInit(): void {
    // Subscribe to state changes
    this.dashboardService.getState()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (state: IDashboardState) => {
          this.editMode = state.editMode;
          this.dashboardId = state.activeDashboardId;
          
          if (this.dashboardId) {
            this.loadDashboard(this.dashboardId);
          }
        }
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadDashboard(id: string): void {
    this.dashboard$ = this.dashboardService.load(id);
  }
  
  toggleEditMode(): void {
    this.dashboardService.updateState({
      editMode: !this.editMode
    });
  }
  
  saveDashboard(): void {
    if (!this.dashboardId) return;
    
    this.dashboard$.pipe(
      takeUntil(this.destroy$),
      switchMap(dashboard => {
        if (!dashboard) throw new Error('No dashboard to save');
        return this.dashboardService.update(dashboard);
      })
    ).subscribe({
      next: (saved) => {
        console.log('Dashboard saved, version:', saved.version);
      },
      error: (error) => {
        console.error('Failed to save dashboard:', error.message);
      }
    });
  }
  
  removeWidget(widgetId: string): void {
    if (!this.dashboardId) return;
    
    this.dashboardService.removeWidget(this.dashboardId, widgetId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (dashboard) => {
          console.log('Widget removed');
          this.dashboard$ = this.dashboardService.load(this.dashboardId!);
        },
        error: (error) => {
          console.error('Failed to remove widget:', error.message);
        }
      });
  }
}
```

## Error Handling Best Practices

### Handle Specific Error Types

```typescript
this.dashboardService.load(dashboardId).subscribe({
  next: (dashboard) => {
    // Success
  },
  error: (error) => {
    if (error instanceof DashboardNotFoundError) {
      // Handle not found
      this.showNotFoundMessage();
    } else if (error instanceof ConcurrentModificationError) {
      // Handle concurrent modification
      this.showConcurrentModificationWarning();
      this.reloadDashboard();
    } else if (error instanceof DashboardValidationError) {
      // Handle validation error
      this.showValidationErrors(error.errors);
    } else {
      // Handle generic error
      this.showGenericError(error.message);
    }
  }
});
```

### Retry on Transient Errors

```typescript
import { retry, delay } from 'rxjs/operators';

this.dashboardService.load(dashboardId).pipe(
  retry({
    count: 3,
    delay: 1000
  })
).subscribe({
  next: (dashboard) => {
    // Success after retry
  },
  error: (error) => {
    // Failed after retries
    console.error('Failed to load after retries:', error.message);
  }
});
```

## Performance Tips

1. **Use takeUntil pattern** for subscription cleanup to prevent memory leaks
2. **Cache dashboard data** in component state to avoid repeated loads
3. **Batch widget operations** when possible to reduce save operations
4. **Validate before save** to catch errors early
5. **Use state management** to avoid prop drilling and maintain consistency

## Next Steps

- See [data-model.md](./data-model.md) for complete entity definitions
- See [contracts/service-api-contract.md](./contracts/service-api-contract.md) for complete API documentation
- See [research.md](./research.md) for implementation details and design decisions

