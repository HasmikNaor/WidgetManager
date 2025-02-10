import { IWidget } from "../../utils/interfaces";
import Card from "../Card/Card";
import { useEffect } from "react";
interface IPageWidgets {
  widget: IWidget;
  currPage: string;
  onWidgetDelete: (widgetId: string) => void;
  onEditBtnClick: (widget: IWidget) => void;
}
const PageWidgets = ({
  widget,
  currPage,
  onWidgetDelete,
  onEditBtnClick,
}: IPageWidgets) => {
  return (
    <main className="page-widgets">
      <h1 className="page-widgets__title">{currPage} Random Widget</h1>
      <ul className="page-widgets__list">
        {widget && (
          <Card
            widgetData={widget}
            key={widget?.id}
            onDelete={onWidgetDelete}
            onEdit={onEditBtnClick}
          />
        )}
      </ul>
    </main>
  );
};

export default PageWidgets;
