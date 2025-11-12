import { ComponentFixture, TestBed } from '@angular/core/testing';

import { D3DashboardsComponent } from './d3-dashboards.component';

describe('D3DashboardsComponent', () => {
  let component: D3DashboardsComponent;
  let fixture: ComponentFixture<D3DashboardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [D3DashboardsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(D3DashboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
