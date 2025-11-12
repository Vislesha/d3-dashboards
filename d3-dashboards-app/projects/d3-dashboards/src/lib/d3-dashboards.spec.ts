import { ComponentFixture, TestBed } from '@angular/core/testing';

import { D3Dashboards } from './d3-dashboards';

describe('D3Dashboards', () => {
  let component: D3Dashboards;
  let fixture: ComponentFixture<D3Dashboards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [D3Dashboards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(D3Dashboards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
