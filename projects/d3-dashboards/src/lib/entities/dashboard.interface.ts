/**
 * Dashboard navigation information interface
 */
export interface IDashboardNavigationInfo {
  /** Current dashboard identifier */
  dashboardId: string;
  /** Current route path */
  route: string;
  /** Route parameters */
  params: Record<string, any>;
  /** Query parameters */
  queryParams: Record<string, any>;
}
