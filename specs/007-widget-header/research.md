# Research: Widget Header Component

**Feature**: 007-widget-header  
**Date**: 2025-01-27  
**Status**: Complete

## Research Objectives

This document consolidates research findings for technical decisions required to implement the Widget Header Component. All "NEEDS CLARIFICATION" items from the implementation plan have been resolved.

---

## 1. Action Menu Positioning and Overflow Handling

### Decision
Use PrimeNG Menu component with Angular CDK Overlay for positioning control. Implement custom positioning logic to prevent overflow on small screens.

### Rationale
- PrimeNG Menu (v20.0.0) uses Angular CDK Overlay internally, providing flexible positioning
- CDK Overlay supports viewport boundary detection and automatic repositioning
- Can configure `positionStrategy` to use `FlexibleConnectedPositionStrategy` with fallback positions
- PrimeNG Menu supports `appendTo` property to control menu container placement
- Custom positioning logic can detect viewport boundaries and adjust menu position dynamically

### Implementation Approach
1. Use PrimeNG `Menu` component with `[model]` binding for menu items
2. Configure `appendTo="body"` to prevent overflow issues
3. Use `positionStrategy` with multiple fallback positions (top-right, bottom-right, top-left, bottom-left)
4. Implement viewport boundary detection using `ViewportRuler` from Angular CDK
5. Add responsive breakpoints: on screens < 768px, use full-width menu or bottom sheet pattern

### Alternatives Considered
- **Custom dropdown**: Would require more code and maintenance, PrimeNG provides tested solution
- **Fixed positioning**: Doesn't handle viewport boundaries well, can cause overflow
- **CSS-only solution**: Limited control over dynamic positioning, doesn't work well with Angular change detection

### References
- PrimeNG Menu Documentation: https://primeng.org/menu
- Angular CDK Overlay: https://material.angular.io/cdk/overlay/overview
- PrimeNG Menu API: `appendTo`, `positionStrategy`, `baseZIndex`

---

## 2. Filter Indicator Overflow Handling

### Decision
Implement a horizontal scrollable container with "show more" indicator for filter indicators. Display up to 5 visible indicators, with remaining filters shown in a popover/tooltip.

### Rationale
- Header space is limited, especially on mobile devices
- Showing all 10 filters inline would cause layout issues
- Horizontal scrolling is a common pattern for overflow content
- "Show more" pattern provides visibility into all filters without cluttering the header
- Can use PrimeNG Badge component for individual filter indicators
- PrimeNG Tooltip or OverlayPanel can display additional filters

### Implementation Approach
1. Use flexbox container with `overflow-x: auto` for horizontal scrolling
2. Display up to 5 filter indicators inline (configurable)
3. If more than 5 filters, show a "+N more" badge that opens a tooltip/overlay
4. Each filter indicator is a clickable badge with remove action
5. Use PrimeNG Badge component for consistent styling
6. Implement touch-friendly scrolling on mobile devices
7. Add visual indicator (fade gradient) when content is scrollable

### Alternatives Considered
- **Vertical stacking**: Takes too much vertical space, breaks header layout
- **Dropdown menu**: Requires extra click, less discoverable
- **Truncation with ellipsis**: Loses information, users can't see all filters
- **Separate filter panel**: Too complex, breaks header component simplicity

### References
- PrimeNG Badge: https://primeng.org/badge
- PrimeNG Tooltip: https://primeng.org/tooltip
- CSS Scroll Snap: For smooth scrolling behavior
- Touch scrolling: Native browser support with `-webkit-overflow-scrolling: touch`

---

## 3. Rapid State Changes Handling

### Decision
Use RxJS `debounceTime` operator combined with Angular Signals for reactive state management. Debounce state updates to 100ms to prevent excessive re-renders while maintaining responsiveness.

### Rationale
- Angular Signals provide efficient change detection and reactivity
- RxJS `debounceTime` prevents excessive updates during rapid state changes
- 100ms debounce maintains perceived responsiveness (below human perception threshold of ~150ms)
- OnPush change detection strategy minimizes unnecessary re-renders
- Signals automatically track dependencies and update only affected parts of the template
- Can use `computed()` signals for derived state (e.g., filter indicator count)

### Implementation Approach
1. Use Angular Signals for widget state (`loading`, `error`, `filters`)
2. Create input signals for `@Input()` properties
3. Use `computed()` signals for derived values (e.g., `hasFilters`, `filterCount`)
4. Debounce rapid state changes using RxJS `debounceTime(100)` when needed
5. Use `effect()` for side effects (e.g., updating ARIA attributes)
6. Combine with OnPush change detection for optimal performance
7. Test with rapid state changes (10+ per second) to ensure performance

### Alternatives Considered
- **Throttle instead of debounce**: Throttle would update at fixed intervals, debounce waits for pause (better UX)
- **Manual change detection**: More error-prone, Signals provide automatic tracking
- **No debouncing**: Would cause performance issues with rapid state changes
- **Longer debounce (200ms+)**: Would feel laggy, 100ms is optimal balance

### References
- Angular Signals: https://angular.dev/guide/signals
- RxJS debounceTime: https://rxjs.dev/api/operators/debounceTime
- Angular OnPush Strategy: https://angular.dev/guide/change-detection

---

## 4. Touch Device Interactions

### Decision
Use PrimeNG Menu component with touch-friendly configuration. Add custom touch event handlers for filter indicator interactions. Implement touch-optimized spacing and hit targets.

### Rationale
- PrimeNG Menu (v20.0.0) has built-in touch support
- Menu items have adequate touch targets (minimum 44x44px recommended)
- Can configure menu for touch devices with larger spacing
- Filter indicators need custom touch handling for remove action
- Touch events require larger hit targets than mouse interactions
- Need to prevent accidental triggers (e.g., scroll vs. tap)

### Implementation Approach
1. Use PrimeNG Menu with default touch support (already implemented)
2. Ensure all interactive elements have minimum 44x44px touch targets
3. Add `touch-action: manipulation` CSS to prevent double-tap zoom
4. Implement touch-friendly filter indicator removal (long-press or swipe)
5. Use `@HostListener` for touch events if custom handling needed
6. Test on actual touch devices (iOS Safari, Android Chrome)
7. Add visual feedback for touch interactions (active states)
8. Consider haptic feedback on supported devices (optional)

### Alternatives Considered
- **Separate mobile UI**: Too complex, breaks component reusability
- **CSS-only touch handling**: Limited control, may not work well with Angular
- **No touch optimization**: Poor UX on mobile devices
- **Native mobile app**: Out of scope for web component

### References
- Touch Target Guidelines: https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
- PrimeNG Touch Support: Built into PrimeNG components
- CSS touch-action: https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action
- Angular HostListener: https://angular.dev/api/core/HostListener

---

## 5. Title Truncation Strategy

### Decision
Use CSS-based truncation with `text-overflow: ellipsis` for single-line titles, with optional tooltip showing full title on hover/focus.

### Rationale
- CSS truncation is performant and doesn't require JavaScript calculations
- `text-overflow: ellipsis` is well-supported across browsers
- Tooltip provides access to full title when needed
- Single-line truncation maintains consistent header height
- Can handle titles up to 200 characters gracefully (SC-007)
- PrimeNG Tooltip can be used for accessibility

### Implementation Approach
1. Use CSS `overflow: hidden`, `text-overflow: ellipsis`, `white-space: nowrap`
2. Set max-width based on available header space (responsive)
3. Add PrimeNG Tooltip to show full title on hover/focus
4. Ensure tooltip is accessible (keyboard navigation, screen readers)
5. Test with various title lengths (0, 10, 50, 100, 200+ characters)
6. Handle edge cases (very short titles, special characters, emojis)

### Alternatives Considered
- **Multi-line wrapping**: Breaks consistent header height, harder to align
- **JavaScript truncation**: More complex, requires change detection, less performant
- **Character limit**: Loses information, poor UX
- **Scrollable title**: Takes up space, not intuitive

### References
- CSS text-overflow: https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow
- PrimeNG Tooltip: https://primeng.org/tooltip
- WCAG Text Spacing: https://www.w3.org/WAI/WCAG21/Understanding/text-spacing.html

---

## 6. Loading and Error Indicator Implementation

### Decision
Use PrimeNG ProgressSpinner for loading state and PrimeNG Message/Toast for error state. Implement inline indicators that don't disrupt header layout.

### Rationale
- PrimeNG ProgressSpinner provides accessible, styled loading indicator
- PrimeNG Message component provides consistent error display
- Inline indicators maintain header layout consistency
- Can use small spinner (16px) to minimize space usage
- Error indicator can be a small icon with tooltip for details
- Both components support ARIA attributes for accessibility

### Implementation Approach
1. Use PrimeNG `ProgressSpinner` with `[style]` binding for size (16px)
2. Show spinner inline next to title or in action menu area
3. Use PrimeNG `Message` component or custom error icon for errors
4. Error indicator shows icon with tooltip containing error message
5. Implement smooth transitions between states (loading → loaded → error)
6. Ensure indicators don't cause layout shift
7. Add ARIA live regions for screen reader announcements

### Alternatives Considered
- **Custom spinner**: More code, PrimeNG provides tested solution
- **Separate error panel**: Too intrusive, breaks header simplicity
- **No visual indicators**: Poor UX, users need feedback
- **Toast notifications**: Too disruptive, inline is better for header

### References
- PrimeNG ProgressSpinner: https://primeng.org/progressspinner
- PrimeNG Message: https://primeng.org/message
- ARIA Live Regions: https://www.w3.org/WAI/ARIA/apg/patterns/alert/

---

## Summary

All technical decisions have been made based on:
- PrimeNG component capabilities (v20.0.0)
- Angular best practices (v20.2.0)
- Performance requirements (SC-001 through SC-010)
- Accessibility standards (WCAG 2.1)
- Responsive design principles

The implementation will use:
- **PrimeNG components**: Menu, Badge, Tooltip, ProgressSpinner, Message
- **Angular CDK**: Overlay for positioning, ViewportRuler for boundary detection
- **Angular Signals**: For reactive state management
- **RxJS**: For debouncing rapid state changes
- **CSS**: For truncation, responsive layout, touch optimization

All "NEEDS CLARIFICATION" items from the implementation plan have been resolved.

