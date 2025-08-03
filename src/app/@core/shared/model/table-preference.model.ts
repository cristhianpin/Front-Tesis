export interface ITablePreference {
  id: string;
  table_name: string;
  user_id: string;
  pageable: boolean;
  pageSize: string;
  sortable: boolean;
  resizable: boolean;
  reorderable: boolean;
  filterable: boolean;
  global_filter: boolean;
  exportable: boolean;
  pdf_export: boolean;
  xls_export: boolean;
  csv_export: boolean;
  cols?: string;
  selected_cols?: string;
}
