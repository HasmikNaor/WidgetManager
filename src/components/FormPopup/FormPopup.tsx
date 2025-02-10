import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import closebtn from "../../images/close.svg";
import { IWidget } from "../../utils/interfaces";
import Input from "../shared/Input";
import { api } from "../../utils/api";

interface IFormPopup {
  isOpen: boolean;
  onClosePopup: () => void;
  widgetData: IWidget;
  onSubmit: () => void;
  formBtnTxt: string;
  onInputChange: (key: string, value: string) => void;
}

function FormPopup({
  isOpen,
  onClosePopup,
  widgetData,
  onSubmit,
  formBtnTxt,
  onInputChange,
}: IFormPopup) {
  const formIsOpen = isOpen ? "popup_open" : "";
  const [title, setTitle] = useState("");
  const isSubmitBtnDisabled = Object.values(widgetData).some(
    (item) => item === ""
  );

  const close = () => {
    onClosePopup();
  };

  const handleClickOnOverlayClose = () => {
    close();
  };

  const createID = () => {
    return new Date().getTime();
  };

  useEffect(() => {
    if (!widgetData.id) {
      const id = createID();
      onInputChange("id", id.toString());
    }
    setTitle(widgetData?.header ? widgetData.header : "create new page");
  }, [formIsOpen]);

  const isInputDisabled = (data: string) => {
    if (data === "id") return true;
    if (formBtnTxt === "Edit" && data === "page_name") return true;
    // if (data === "showToPercentage") return isShowPercentageDisabled;

    return false;
  };
  const createInfo = (key: string) => {
    if (key === "showToPercentage") {
      return `you can enter not more than ${100}`;
    }
  };

  const createInputFields = () => {
    return (Object.keys(widgetData) as Array<keyof IWidget>).map((data, i) => (
      <Input
        key={i}
        label={data}
        name={data}
        type="text"
        className="popup"
        value={widgetData[data]?.toString() || ""}
        onChange={onInputChange}
        isDisabled={isInputDisabled(data)}
        inputInfo={createInfo(data)}
      />
    ));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className={`popup ${formIsOpen}`} onClick={handleClickOnOverlayClose}>
      <div className="popup__content" onClick={(e) => e.stopPropagation()}>
        <button className={`popup__close-btn `} onClick={close}>
          <img
            src={closebtn}
            alt="close-btn"
            className="popup__close-btn-img"
          />
        </button>
        <form onSubmit={handleSubmit} className="popup__form">
          <h2 className="popup__title">{title}</h2>
          {createInputFields()}

          <button
            type="submit"
            className={`popup__submit-btn`}
            disabled={isSubmitBtnDisabled}
          >
            {formBtnTxt}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormPopup;
