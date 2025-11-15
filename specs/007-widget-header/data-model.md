# Data Model: Widget Header Component

**Feature**: 007-widget-header  
**Date**: 2025-01-27  
**Status**: Complete

## Overview

The Widget Header Component is a presentation component that displays widget metadata and provides action access. It does not manage its own data but receives all data through inputs and emits events for actions. The data model consists of input interfaces, output event interfaces, and internal state management.

---

## Entities

### 1. WidgetHeaderComponent

**Type**: Angular Component  
**Purpose**: Main component that displays widget header with title, actions, filters, and loading indicators

**Properties**:
- `widget: ID3Widget` (Input, required) - Widget configuration and metadata
- `isEditMode: boolean` (Input, default: false) - Whether widget is in edit mode
- `filters: IFilterValues[]` (Input, default: []) - Active filters applied to widget
- `loading: boolean` (Input, default: false) - Whether widget is loading data
- `error: string | null` (Input, default: null) - Error message if widget encountered error
- `widgetAction: EventEmitter<IWidgetActionEvent>` (Output) - Emitted when action is triggered
- `filterRemove: EventEmitter<string>` (Output) - Emitted when filter is removed (filter key)

**Internal State** (Signals):
- `titleSignal: Signal<string>` - Computed widget title with fallback
- `hasFiltersSignal: Signal<boolean>` - Computed whether filters are active
- `visibleFiltersSignal: Signal<IFilterValues[]>` - Computed visible filters (max 5)
- `hiddenFiltersSignal: Signal<IFilterValues[]>` - Computed hidden filters (beyond 5)
- `menuItemsSignal: Signal<IMenuItem[]>` - Computed menu items based on edit mode

**Validation Rules**:
- `widget` input is required (non-null assertion)
- `widget.title` can be empty string (will show default/placeholder)
- `filters` array can be empty (no filter indicators shown)
- `loading` and `error` are mutually exclusive (error takes precedence)

**State Transitions**:
- Loading → Loaded: `loading: true` → `loading: false, error: null`
- Loading → Error: `loading: true` → `loading: false, error: string`
- Loaded → Error: `loading: false, error: null` → `loading: false, error: string`
- Error → Loading: `loading: false, error: string` → `loading: true, error: null`

---

### 2. IMenuItem (Internal Interface)

**Type**: TypeScript Interface  
**Purpose**: Represents a menu item in the action menu

**Properties**:
- `label: string` - Display label for menu item
- `icon: string` - PrimeIcons class name (e.g., 'pi pi-pencil')
- `command: () => void` - Function to execute when item is clicked
- `disabled?: boolean` - Whether item is disabled
- `separator?: boolean` - Whether item is a separator
- `visible?: boolean` - Whether item is visible (default: true)

**Validation Rules**:
- `label` is required and non-empty
- `icon` is required (PrimeIcons class name)
- `command` is required function
- `disabled` defaults to false
- `visible` defaults to true

**Menu Items**:
- **Edit**: `{ label: 'Edit', icon: 'pi pi-pencil', command: () => emitAction('edit'), visible: isEditMode }`
- **Delete**: `{ label: 'Delete', icon: 'pi pi-trash', command: () => emitAction('delete'), visible: isEditMode }`
- **Refresh**: `{ label: 'Refresh', icon: 'pi pi-refresh', command: () => emitAction('refresh'), visible: true }`
- **Export**: `{ label: 'Export', icon: 'pi pi-download', command: () => emitAction('export'), visible: true }`

---

### 3. IFilterIndicator (Internal Interface)

**Type**: TypeScript Interface  
**Purpose**: Represents a filter indicator displayed in the header

**Properties**:
- `key: string` - Filter key/field name
- `value: any` - Filter value
- `displayText: string` - Formatted display text (e.g., "Status: Active")
- `operator?: string` - Filter operator (optional, for display)

**Computed Properties**:
- `displayText` is computed from `key`, `value`, and `operator`
- Format: `{key}: {value}` or `{key} {operator} {value}` if operator exists
- Examples: "Status: Active", "Date > 2024-01-01", "Name contains 'test'"

**Validation Rules**:
- `key` is required and non-empty
- `value` can be any type (string, number, boolean, array, etc.)
- `displayText` is computed, not user-provided

---

### 4. IWidgetActionEvent (Existing Interface)

**Type**: TypeScript Interface  
**Location**: `projects/d3-dashboards/src/lib/entities/widget-action-event.interface.ts`  
**Purpose**: Represents user actions triggered from widget header

**Properties**:
- `action: 'edit' | 'delete' | 'refresh' | 'export' | 'configure'` - Type of action
- `widgetId: string` - ID of the widget the action applies to
- `payload?: any` - Optional payload for action-specific data

**Validation Rules**:
- `action` must be one of the defined action types
- `widgetId` is required and must match widget.id
- `payload` is optional and action-specific (e.g., export format for 'export' action)

**Event Flow**:
1. User clicks action menu item or filter indicator
2. Component creates `IWidgetActionEvent` object
3. Component emits event via `widgetAction` output
4. Parent component (WidgetComponent) handles event
5. Parent component may show confirmation dialog (for delete action)

---

## Relationships

### Component Hierarchy
```
WidgetHeaderComponent
├── Inputs: ID3Widget, boolean, IFilterValues[], boolean, string | null
├── Outputs: IWidgetActionEvent, string (filter key)
├── Uses: PrimeNG Menu, Badge, Tooltip, ProgressSpinner, Message
└── Consumed by: WidgetComponent
```

### Data Flow
```
WidgetComponent
  ↓ (inputs)
WidgetHeaderComponent
  ↓ (outputs - events)
WidgetComponent
  ↓ (handles actions)
DashboardService / DataService
```

### Entity Relationships
- **WidgetHeaderComponent** → **ID3Widget**: One-to-one (component receives one widget)
- **WidgetHeaderComponent** → **IFilterValues[]**: One-to-many (component receives multiple filters)
- **WidgetHeaderComponent** → **IMenuItem[]**: One-to-many (component creates multiple menu items)
- **WidgetHeaderComponent** → **IFilterIndicator[]**: One-to-many (component creates multiple filter indicators)

---

## State Management

### Input State (External)
- Managed by parent component (WidgetComponent)
- Passed via `@Input()` properties
- Changes trigger Angular change detection (OnPush strategy)

### Internal State (Signals)
- Managed using Angular Signals
- Computed signals derive values from inputs
- Debounced for rapid state changes (100ms)

### Output Events
- Emitted via `@Output()` EventEmitters
- Parent component subscribes to events
- Events are synchronous (no async operations in header component)

---

## Validation and Constraints

### Input Validation
- `widget` must be non-null (required input)
- `widget.id` must be valid UUID format
- `widget.title` can be empty (shows default "Untitled Widget")
- `filters` array can be empty (no validation needed)
- `loading` and `error` are boolean and string | null respectively

### Business Rules
- Edit and Delete actions only visible when `isEditMode === true`
- Refresh and Export actions always visible
- Filter indicators only shown when `filters.length > 0`
- Loading indicator shown when `loading === true`
- Error indicator shown when `error !== null` (takes precedence over loading)
- Maximum 5 filter indicators shown inline (remaining in tooltip)

### Performance Constraints
- Header must render within 50ms (SC-001)
- Action menu must open within 100ms (SC-002)
- Filter indicators must update within 200ms (SC-003)
- Loading indicators must appear within 50ms (SC-004)
- Must handle rapid state changes (10+ per second) (SC-010)

---

## Data Transformations

### Title Display
- Input: `widget.title: string`
- Transformation: If empty, use "Untitled Widget"
- Output: Display text (with truncation if > 200 chars)

### Filter Indicator Display
- Input: `IFilterValues[]`
- Transformation: Convert to `IFilterIndicator[]` with computed `displayText`
- Output: Array of filter indicators (max 5 visible, rest in tooltip)

### Menu Items Generation
- Input: `isEditMode: boolean`
- Transformation: Generate menu items array based on edit mode
- Output: `IMenuItem[]` with appropriate visibility flags

### State Indicator Display
- Input: `loading: boolean, error: string | null`
- Transformation: Determine which indicator to show (loading, error, or none)
- Output: Visual indicator (spinner, error icon, or nothing)

---

## Error Handling

### Input Errors
- If `widget` is null/undefined: Component should not render (parent responsibility)
- If `widget.id` is invalid: Component still renders but may cause issues in parent
- If `filters` contains invalid data: Component filters out invalid entries

### Runtime Errors
- Menu positioning errors: Fall back to default position
- Filter indicator rendering errors: Skip problematic indicators, show rest
- State change errors: Log error, continue with previous state

### User Error Feedback
- Error indicator displayed when `error` input is set
- Tooltip shows full error message on hover/focus
- ARIA live region announces errors to screen readers

---

## Accessibility Considerations

### ARIA Attributes
- `aria-label` on all interactive elements (buttons, menu items)
- `aria-live="polite"` for loading state announcements
- `aria-live="assertive"` for error state announcements
- `role="button"` for clickable filter indicators
- `role="menu"` and `role="menuitem"` for action menu

### Keyboard Navigation
- Tab order: Title → Action menu button → Filter indicators → Menu items
- Enter/Space activates menu items and filter removal
- Escape closes action menu
- Arrow keys navigate menu items

### Screen Reader Support
- All actions have descriptive labels
- State changes are announced via ARIA live regions
- Filter indicators have descriptive text
- Menu items have accessible names

---

## Summary

The Widget Header Component data model is simple and focused:
- **Inputs**: Widget data, edit mode, filters, loading/error state
- **Outputs**: Action events, filter removal events
- **Internal**: Computed signals for derived state, menu items, filter indicators
- **No persistence**: Component is stateless, all state comes from inputs
- **No async operations**: Component only emits events, parent handles async work

This design ensures the component is:
- **Testable**: Pure inputs/outputs, no side effects
- **Reusable**: Can be used by any component that needs widget header
- **Performant**: OnPush change detection, signals for reactivity
- **Accessible**: Full ARIA support, keyboard navigation, screen reader friendly

