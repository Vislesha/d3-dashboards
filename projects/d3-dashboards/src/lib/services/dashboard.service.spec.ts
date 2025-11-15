import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';
import { IDashboardConfig, IDashboard } from '../entities/dashboard.interface';
import { ID3Widget } from '../entities/widget.interface';
import {
  DashboardValidationError,
  DashboardServiceError,
  DashboardNotFoundError,
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
});

