import trashIcon from "../../images/trash.svg";
import editIcon from "../../images/edit.svg";
import { IWidget } from "../../utils/interfaces";

interface ICard {
  widgetData: IWidget;
  onDelete: (widgetId: string) => void;
  onEdit: (widget: IWidget) => void;
}

function Card({ widgetData, onDelete, onEdit }: ICard) {
  const handleDeleteClick = () => {
    onDelete(widgetData.id);
  };
  const handleEdit = () => {
    onEdit(widgetData);
  };

  return (
    <figure className="card">
      <div className="card__btns">
        <button type="button" className="card__btn" onClick={handleDeleteClick}>
          <img src={trashIcon} alt="trash" className="card__img" />
        </button>
        <button type="button" className="card__btn" onClick={handleEdit}>
          <img src={editIcon} alt="edit" className="card__img" />
        </button>
      </div>
      <img
        alt={widgetData.header}
        className="card__main-img"
        src={widgetData.thumbnail}
      />
      <figcaption className="card__caption">
        <h2 className="card__title">{widgetData.header}</h2>
        <p className="card__subtitle">{widgetData.text}</p>
        <span className="card__data">{widgetData.price}$</span>
        <span className="card__data">{widgetData.showToPercentage}%</span>
      </figcaption>
    </figure>
  );
}

export default Card;
