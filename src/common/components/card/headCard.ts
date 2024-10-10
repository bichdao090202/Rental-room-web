export interface HeadCard {
  id: string;
  label: string;
  sx?: any;
  render?: (row: any) => React.ReactNode;
}
