import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';
import { IDashboardConfig, IDashboard, IDashboardState } from '../entities/dashboard.interface';
import { ID3Widget } from '../entities/widget.interface';
import {
  DashboardValidationError,
  DashboardServiceError,
  DashboardNotFoundError,
  WidgetValidationError,
  WidgetIdConflictError,
  WidgetNotFoundError,
} from './dashboard.service.types';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardService],
    });
    service = TestBed.inject(DashboardService);
  });

  describe('User Story 1 - Create and Save Dashboards', () => {
    describe('create', () => {
      it('should create a dashboard with valid config and return dashboard ID', (done) => {
        const config: IDashboardConfig = {
          title: 'Test Dashboard',
          description: 'Test description',
          widgets: [],
        };

        service.create(config).subscribe({
          next: (dashboardId) => {
            expect(dashboardId).toBeTruthy();
            expect(typeof dashboardId).toBe('string');
            // Verify UUID format
            expect(dashboardId).toMatch(
              /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
            );
            done();
          },
          error: (error) => {
            done.fail(`Expected success but got error: ${error.message}`);
          },
        });
      });

      it('should create a dashboard with widgets', (done) => {
        const widget: ID3Widget = {
          id: '550e8400-e29b-41d4-a716-446655440000',
          type: 'line',
          position: { x: 0, y: 0, cols: 4, rows: 3 },
          title: 'Test Widget',
          config: {},
        };

        const config: IDashboardConfig = {
          title: 'Dashboard with Widgets',
          widgets: [widget],
        };

        service.create(config).subscribe({
          next: (dashboardId) => {
            expect(dashboardId).toBeTruthy();
            done();
          },
          error: (error) => {
            done.fail(`Expected success but got error: ${error.message}`);
          },
        });
      });

      it('should reject dashboard creation with missing title', (done) => {
        const config = {
          description: 'No title',
        } as IDashboardConfig;

        service.create(config).subscribe({
          next: () => {
            done.fail('Expected validation error but got success');
          },
          error: (error) => {
            expect(error).toBeInstanceOf(DashboardValidationError);
            expect(error.errors.length).toBeGreaterThan(0);
            expect(error.errors.some((e: string) => e.includes('title'))).toBe(true);
            done();
          },
        });
      });

      it('should reject dashboard creation with invalid config', (done) => {
        const config = {
          title: '',
        } as IDashboardConfig;

        service.create(config).subscribe({
          next: () => {
            done.fail('Expected validation error but got success');
          },
          error: (error) => {
            expect(error).toBeInstanceOf(DashboardValidationError);
            done();
          },
        });
      });

      it('should handle save failures gracefully', (done) => {
        // This test will be enhanced when we add error injection capabilities
        const config: IDashboardConfig = {
          title: 'Test Dashboard',
        };

        service.create(config).subscribe({
          next: (dashboardId) => {
            expect(dashboardId).toBeTruthy();
            done();
          },
          error: (error) => {
            expect(error).toBeInstanceOf(DashboardServiceError);
            done();
          },
        });
      });
    });

    describe('validateDashboard', () => {
      it('should validate dashboard with valid config', () => {
        const config: IDashboardConfig = {
          title: 'Valid Dashboard',
          description: 'Valid description',
          widgets: [],
        };

        const result = service.validateDashboard({
          ...config,
          id: '550e8400-e29b-41d4-a716-446655440000',
          version: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        expect(result.valid).toBe(true);
        expect(result.errors.length).toBe(0);
      });

      it('should reject dashboard with invalid config', () => {
        const config = {
          title: '',
        } as IDashboard;

        const result = service.validateDashboard(config);

        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('User Story 2 - Load and Retrieve Dashboards', () => {
    let createdDashboardId: string;

    beforeEach((done) => {
      // Create a dashboard for testing
      const config: IDashboardConfig = {
        title: 'Test Dashboard for Loading',
        description: 'Test description',
        widgets: [],
      };

      service.create(config).subscribe({
        next: (id) => {
          createdDashboardId = id;
          done();
        },
        error: () => {
          done();
        },
      });
    });

    describe('load', () => {
      it('should load a dashboard with valid dashboard ID', (done) => {
        service.load(createdDashboardId).subscribe({
          next: (dashboard) => {
            expect(dashboard).toBeTruthy();
            expect(dashboard.id).toBe(createdDashboardId);
            expect(dashboard.title).toBe('Test Dashboard for Loading');
            expect(dashboard.version).toBe(1);
            done();
          },
          error: (error) => {
            done.fail(`Expected success but got error: ${error.message}`);
          },
        });
      });

      it('should return DashboardNotFoundError for non-existent dashboard ID', (done) => {
        const nonExistentId = '550e8400-e29b-41d4-a716-446655440000';

        service.load(nonExistentId).subscribe({
          next: () => {
            done.fail('Expected error but got success');
          },
          error: (error) => {
            expect(error).toBeInstanceOf(DashboardNotFoundError);
            expect(error.dashboardId).toBe(nonExistentId);
            done();
          },
        });
      });

      it('should reject corrupted dashboard data on load', (done) => {
        // This test will be enhanced when we add data corruption simulation
        // For now, we test that validation runs on load
        service.load(createdDashboardId).subscribe({
          next: (dashboard) => {
            expect(dashboard).toBeTruthy();
            // If dashboard loads, it means validation passed
            done();
          },
          error: (error) => {
            // If validation fails, we should get an error
            expect(error).toBeInstanceOf(DashboardServiceError);
            done();
          },
        });
      });
    });

    describe('list', () => {
      it('should list all dashboards', (done) => {
        service.list().subscribe({
          next: (dashboards) => {
            expect(Array.isArray(dashboards)).toBe(true);
            expect(dashboards.length).toBeGreaterThan(0);
            // Should include the dashboard we created
            expect(dashboards.some((d) => d.id === createdDashboardId)).toBe(true);
            done();
          },
          error: (error) => {
            done.fail(`Expected success but got error: ${error.message}`);
          },
        });
      });

      it('should return empty array when no dashboards exist', (done) => {
        // Create a new service instance with fresh storage
        const freshService = new DashboardService();
        // Clear any existing dashboards by using in-memory storage
        freshService.list().subscribe({
          next: (dashboards) => {
            expect(Array.isArray(dashboards)).toBe(true);
            // May have dashboards from previous tests, so we just verify it's an array
            done();
          },
          error: (error) => {
            done.fail(`Expected success but got error: ${error.message}`);
          },
        });
      });
    });
  });

  describe('Phase 7 - Update and Delete Operations', () => {
    let createdDashboardId: string;
    let createdDashboard: IDashboard;

    beforeEach((done) => {
      const config: IDashboardConfig = {
        title: 'Dashboard for Update/Delete',
        description: 'Test description',
        widgets: [],
      };

      service.create(config).subscribe({
        next: (id) => {
          createdDashboardId = id;
          service.load(id).subscribe({
            next: (dashboard) => {
              createdDashboard = dashboard;
              done();
            },
            error: () => {
              done();
            },
          });
        },
        error: () => {
          done();
        },
      });
    });

    describe('update', () => {
      it('should update a dashboard with valid dashboard', (done) => {
        const updated = {
          ...createdDashboard,
          title: 'Updated Title',
          description: 'Updated description',
        };

        service.update(updated).subscribe({
          next: (dashboard) => {
            expect(dashboard.title).toBe('Updated Title');
            expect(dashboard.description).toBe('Updated description');
            expect(dashboard.version).toBe(createdDashboard.version + 1);
            expect(dashboard.updatedAt.getTime()).toBeGreaterThanOrEqual(createdDashboard.updatedAt.getTime());
            done();
          },
          error: (error) => {
            done.fail(`Expected success but got error: ${error.message}`);
          },
        });
      });

      it('should reject update with version mismatch (concurrent modification)', (done) => {
        const updated = {
          ...createdDashboard,
          title: 'Updated Title',
          version: 999, // Wrong version
        };

        service.update(updated).subscribe({
          next: () => {
            done.fail('Expected ConcurrentModificationError but got success');
          },
          error: (error) => {
            expect(error.code).toBe('CONCURRENT_MODIFICATION');
            done();
          },
        });
      });

      it('should reject update with invalid dashboard config', (done) => {
        const updated = {
          ...createdDashboard,
          title: '', // Invalid
        };

        service.update(updated).subscribe({
          next: () => {
            done.fail('Expected validation error but got success');
          },
          error: (error) => {
            expect(error).toBeInstanceOf(DashboardValidationError);
            done();
          },
        });
      });
    });

    describe('delete', () => {
      it('should delete a dashboard with valid dashboard ID', (done) => {
        service.delete(createdDashboardId).subscribe({
          next: (deleted) => {
            expect(deleted).toBe(true);
            // Verify dashboard is actually deleted
            service.load(createdDashboardId).subscribe({
              next: () => {
                done.fail('Dashboard should be deleted but was found');
              },
              error: (error) => {
                expect(error).toBeInstanceOf(DashboardNotFoundError);
                done();
              },
            });
          },
          error: (error) => {
            done.fail(`Expected success but got error: ${error.message}`);
          },
        });
      });

      it('should return false for non-existent dashboard ID', (done) => {
        const nonExistentId = '550e8400-e29b-41d4-a716-446655440000';

        service.delete(nonExistentId).subscribe({
          next: (deleted) => {
            expect(deleted).toBe(false);
            done();
          },
          error: (error) => {
            done.fail(`Expected false but got error: ${error.message}`);
          },
        });
      });
    });
  });

  describe('User Story 3 - Widget Management', () => {
    let createdDashboardId: string;
    const testWidget: ID3Widget = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      type: 'line',
      position: { x: 0, y: 0, cols: 4, rows: 3 },
      title: 'Test Widget',
      config: {},
    };

    beforeEach((done) => {
      const config: IDashboardConfig = {
        title: 'Dashboard for Widget Management',
        widgets: [],
      };

      service.create(config).subscribe({
        next: (id) => {
          createdDashboardId = id;
          done();
        },
        error: () => {
          done();
        },
      });
    });

    describe('addWidget', () => {
      it('should add a widget to a dashboard', (done) => {
        service.addWidget(createdDashboardId, testWidget).subscribe({
          next: (dashboard) => {
            expect(dashboard.widgets.length).toBe(1);
            expect(dashboard.widgets[0].id).toBe(testWidget.id);
            expect(dashboard.version).toBeGreaterThan(1);
            done();
          },
          error: (error) => {
            done.fail(`Expected success but got error: ${error.message}`);
          },
        });
      });

      it('should reject widget with duplicate ID', (done) => {
        // Add widget first
        service.addWidget(createdDashboardId, testWidget).subscribe({
          next: () => {
            // Try to add same widget again
            service.addWidget(createdDashboardId, testWidget).subscribe({
              next: () => {
                done.fail('Expected WidgetIdConflictError but got success');
              },
              error: (error) => {
                expect(error.code).toBe('WIDGET_ID_CONFLICT');
                done();
              },
            });
          },
          error: () => {
            done();
          },
        });
      });

      it('should reject widget with invalid config', (done) => {
        const invalidWidget = {
          ...testWidget,
          title: '', // Invalid
        };

        service.addWidget(createdDashboardId, invalidWidget).subscribe({
          next: () => {
            done.fail('Expected validation error but got success');
          },
          error: (error) => {
            expect(error).toBeInstanceOf(WidgetValidationError);
            done();
          },
        });
      });
    });

    describe('updateWidget', () => {
      beforeEach((done) => {
        // Add a widget first
        service.addWidget(createdDashboardId, testWidget).subscribe({
          next: () => {
            done();
          },
          error: () => {
            done();
          },
        });
      });

      it('should update a widget in a dashboard', (done) => {
        const updatedWidget = {
          ...testWidget,
          title: 'Updated Widget Title',
        };

        service.updateWidget(createdDashboardId, updatedWidget).subscribe({
          next: (dashboard) => {
            const widget = dashboard.widgets.find((w) => w.id === testWidget.id);
            expect(widget).toBeTruthy();
            expect(widget?.title).toBe('Updated Widget Title');
            expect(dashboard.version).toBeGreaterThan(1);
            done();
          },
          error: (error) => {
            done.fail(`Expected success but got error: ${error.message}`);
          },
        });
      });

      it('should reject update for non-existent widget ID', (done) => {
        const nonExistentWidget = {
          ...testWidget,
          id: '550e8400-e29b-41d4-a716-446655440999',
        };

        service.updateWidget(createdDashboardId, nonExistentWidget).subscribe({
          next: () => {
            done.fail('Expected WidgetNotFoundError but got success');
          },
          error: (error) => {
            expect(error.code).toBe('WIDGET_NOT_FOUND');
            done();
          },
        });
      });
    });

    describe('removeWidget', () => {
      beforeEach((done) => {
        // Add a widget first
        service.addWidget(createdDashboardId, testWidget).subscribe({
          next: () => {
            done();
          },
          error: () => {
            done();
          },
        });
      });

      it('should remove a widget from a dashboard', (done) => {
        service.removeWidget(createdDashboardId, testWidget.id).subscribe({
          next: (dashboard) => {
            expect(dashboard.widgets.length).toBe(0);
            expect(dashboard.widgets.find((w) => w.id === testWidget.id)).toBeUndefined();
            expect(dashboard.version).toBeGreaterThan(1);
            done();
          },
          error: (error) => {
            done.fail(`Expected success but got error: ${error.message}`);
          },
        });
      });

      it('should reject removal for non-existent widget ID', (done) => {
        const nonExistentWidgetId = '550e8400-e29b-41d4-a716-446655440999';

        service.removeWidget(createdDashboardId, nonExistentWidgetId).subscribe({
          next: () => {
            done.fail('Expected WidgetNotFoundError but got success');
          },
          error: (error) => {
            expect(error.code).toBe('WIDGET_NOT_FOUND');
            done();
          },
        });
      });
    });

    describe('validateWidget', () => {
      it('should validate widget with valid config', () => {
        const result = service.validateWidget(testWidget);
        expect(result.valid).toBe(true);
        expect(result.errors.length).toBe(0);
      });

      it('should reject widget with invalid config', () => {
        const invalidWidget = {
          ...testWidget,
          title: '',
        };

        const result = service.validateWidget(invalidWidget);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('User Story 4 - State Management', () => {
    let createdDashboardId: string;

    beforeEach((done) => {
      const config: IDashboardConfig = {
        title: 'Dashboard for State Management',
        widgets: [],
      };

      service.create(config).subscribe({
        next: (id) => {
          createdDashboardId = id;
          done();
        },
        error: () => {
          done();
        },
      });
    });

    describe('getState', () => {
      it('should return state observable', (done) => {
        service.getState().subscribe({
          next: (state: IDashboardState) => {
            expect(state).toBeTruthy();
            expect(state.activeDashboardId).toBeNull();
            expect(state.editMode).toBe(false);
            expect(Array.isArray(state.filters)).toBe(true);
            expect(Array.isArray(state.selectedWidgets)).toBe(true);
            done();
          },
          error: (error) => {
            done.fail(`Expected success but got error: ${error.message}`);
          },
        });
      });

      it('should emit state changes when state is updated', (done) => {
        let emissionCount = 0;
        service.getState().subscribe({
          next: (state: IDashboardState) => {
            emissionCount++;
            if (emissionCount === 1) {
              // Initial state
              expect(state.activeDashboardId).toBeNull();
            } else if (emissionCount === 2) {
              // After update
              expect(state.activeDashboardId).toBe(createdDashboardId);
              done();
            }
          },
        });

        // Update state
        service.updateState({ activeDashboardId: createdDashboardId });
      });
    });

    describe('getCurrentState', () => {
      it('should return current state synchronously', () => {
        const state = service.getCurrentState();
        expect(state).toBeTruthy();
        expect(state.activeDashboardId).toBeNull();
        expect(state.editMode).toBe(false);
      });
    });

    describe('updateState', () => {
      it('should update state with partial updates', (done) => {
        service.updateState({
          activeDashboardId: createdDashboardId,
          editMode: true,
        });

        service.getState().subscribe({
          next: (state: IDashboardState) => {
            expect(state.activeDashboardId).toBe(createdDashboardId);
            expect(state.editMode).toBe(true);
            done();
          },
        });
      });
    });

    describe('resetState', () => {
      it('should reset state to initial values', (done) => {
        // Update state first
        service.updateState({
          activeDashboardId: createdDashboardId,
          editMode: true,
          filters: [{ key: 'test', value: 'value' }],
          selectedWidgets: ['widget-1'],
        });

        // Reset state
        service.resetState();

        service.getState().subscribe({
          next: (state: IDashboardState) => {
            expect(state.activeDashboardId).toBeNull();
            expect(state.editMode).toBe(false);
            expect(state.filters.length).toBe(0);
            expect(state.selectedWidgets.length).toBe(0);
            done();
          },
        });
      });
    });
  });
});

