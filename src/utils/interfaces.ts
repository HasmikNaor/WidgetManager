export interface IWidgetForUpdate {
  header: string;
  price: string;
  showToPercentage: number;
  text: string;
  thumbnail: string;
}

export interface IWidget extends IWidgetForUpdate {
  id: string;
  page_name: string;
}
