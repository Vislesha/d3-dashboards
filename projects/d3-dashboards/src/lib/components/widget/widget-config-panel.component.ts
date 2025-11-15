import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ID3Widget, ID3WidgetConfig } from '../../entities/widget.interface';

/**
 * Widget Configuration Panel Component
 *
 * Modal dialog component for configuring widget settings.
 * Used by WidgetComponent to provide configuration UI.
 *
 * @internal
 */
@Component({
  selector: 'lib-widget-config-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
  template: `
    <div class="widget-config-panel">
      <form (ngSubmit)="onSave()">
        <div class="config-section">
          <label for="widget-title">Widget Title</label>
          <input
            id="widget-title"
            type="text"
            pInputText
            [(ngModel)]="configData.title"
            name="title"
            required
            class="w-full" />
        </div>

        <div class="config-section">
          <h4>Configuration Options</h4>
          <p class="text-muted">Configuration options are type-specific and will be expanded in future iterations.</p>
          <pre class="config-preview">{{ configData.config | json }}</pre>
        </div>

        <div class="config-actions">
          <button type="button" pButton label="Cancel" (click)="onCancel()" class="p-button-secondary"></button>
          <button type="submit" pButton label="Save" class="p-button-primary"></button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .widget-config-panel {
        padding: 1rem;
      }

      .config-section {
        margin-bottom: 1.5rem;
      }

      .config-section label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
      }

      .config-section h4 {
        margin: 0 0 0.5rem 0;
      }

      .text-muted {
        color: #6c757d;
        font-size: 0.875rem;
      }

      .config-preview {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        padding: 1rem;
        font-size: 0.75rem;
        overflow-x: auto;
        max-height: 300px;
        overflow-y: auto;
      }

      .config-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid #dee2e6;
      }
    `,
  ],
})
export class WidgetConfigPanelComponent implements OnInit {
  configData: {
    title: string;
    config: ID3WidgetConfig;
  } = {
    title: '',
    config: {},
  };

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    if (this.config.data) {
      const widget: ID3Widget = this.config.data.widget;
      const config: ID3WidgetConfig = this.config.data.config || {};

      this.configData = {
        title: widget.title || '',
        config: { ...config },
      };
    }
  }

  onSave(): void {
    // Emit the updated configuration
    this.ref.close({
      config: this.configData.config,
      title: this.configData.title,
    });
  }

  onCancel(): void {
    this.ref.close();
  }
}

