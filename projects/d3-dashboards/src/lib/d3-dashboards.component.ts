import { Component } from '@angular/core';

@Component({
  selector: 'lib-d3-dashboards',
  imports: [],
  template: `
    <section class="library-welcome">
      <h2>D3 Dashboards Library</h2>
      <p>
        Start building dashboard widgets by extending the components, services, and utilities
        provided by this library.
      </p>
    </section>
  `,
  styles: `
    :host {
      display: block;
      padding: 1.5rem;
      border-radius: 0.75rem;
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 64, 175, 0.75));
      color: #fff;
      font-family: 'Inter', 'Segoe UI', sans-serif;
    }

    .library-welcome h2 {
      margin: 0 0 0.75rem;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .library-welcome p {
      margin: 0;
      font-size: 1rem;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.85);
    }
  `,
})
export class D3DashboardsComponent {}
