import React, { useEffect, useState } from "react";
import "./App.scss";
import { IWidget, IWidgetForUpdate } from "../../utils/interfaces";
import PopupWithForm from "../FormPopup/FormPopup";
import Header from "../Header/Header";
import { api } from "../../utils/api";
import PageWidgets from "../PageWidgets/PageWidgets";
import { generateRandomNumber, showRandomWidget } from "../../utils/functions";
import {
  Route,
  Router,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

function App() {
  const location = useLocation();
  const [, pageName, widgetId] = location.pathname.split("/");
  const navigate = useNavigate();
  const [widgetToRender, setWidgetTorender] = useState({
    header: "",
    id: "",
    page_name: "",
    price: "",
    showToPercentage: 100,
    text: "",
    thumbnail: "",
  });
  const [formBtnTxt, setFormBtnTxt] = useState("Submit");
  const [pages, setPages] = useState<string[]>([]);
  const [widgets, setWidgets] = useState<IWidget[]>([]);

  const [formWidgetData, setFormWidgetData] = useState<IWidget>({
    header: "",
    id: "",
    page_name: "",
    price: "",
    showToPercentage: 100,
    text: "",
    thumbnail: "",
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const checkInputValid = (key: string, value: string) => {
    if (key === "price") {
      if (typeof +value === "number" && +value >= 0) return true;

      return false;
    }
    if (key === "showToPercentage") {
      const val = +value;
      if (typeof val === "number" && val <= 100 && val > 0) {
        return true;
      }
      return false;
    }

    return true;
  };

  const handleInputChange = (key: string, value: string) => {
    const isValid = checkInputValid(key, value);
    if (isValid) {
      setFormWidgetData(
        (prev) =>
          ({
            ...prev,
            [key]: value,
          } as IWidget)
      );
    }
  };

  const close = () => {
    setIsPopupOpen(false);
    setFormWidgetData({
      header: "",
      id: "",
      page_name: "",
      price: "",
      showToPercentage: 100,
      text: "",
      thumbnail: "",
    });
    setFormBtnTxt("Submit");
    navigate(`${pageName}`);
  };

  const getAllWidgets = () => {
    api
      .getAllWidgets()
      .then((res) => {
        setPages(Object.keys(res));
      })
      .catch((err) => console.log(err));
  };

  const createWidget = () => {
    api
      .createNewWidget(formWidgetData)
      .then(() => {
        close();
        getAllWidgets();
        getPageWidgets(pageName);
      })
      .catch((err) => console.log(err));
  };

  const updateWidget = (
    pageName: string,
    id: string,
    data: IWidgetForUpdate
  ) => {
    api
      .updateWidget(pageName, id, data)
      .then(() => {
        close();
        getPageWidgets(pageName);
        getAllWidgets();
      })
      .catch((err) => console.log(err));
  };

  function changeAllWidgetsPercentageVal(
    widgets: IWidget[],
    totalPercentage: number
  ) {
    return widgets.map((widget) => ({
      ...widget,
      showToPercentage: (+widget.showToPercentage / totalPercentage) * 100,
    }));
  }
  const updateWidgetInBackend = async (
    updatedWidgetsPercanteages: IWidget[]
  ) => {
    for (let i = 0; i < updatedWidgetsPercanteages.length; i++) {
      const { page_name, id, ...data } = updatedWidgetsPercanteages[i];
      await api.updateWidget(page_name, id, data);
    }
  };

  const updateCurrPageWidgets = async (
    totalPercentages: number,
    widgets: IWidget[]
  ) => {
    const updatedWidgetsPercanteages = changeAllWidgetsPercentageVal(
      widgets,
      totalPercentages
    );
    try {
      await updateWidgetInBackend(updatedWidgetsPercanteages);
    } catch (error) {
      console.error("Error updating widgets:", error);
    }
  };
  const updateExistingPageWidgets = async (totalPercentages: number) => {
    try {
      const pageWidgets: IWidget[] = await api.getWidgetsByPageName(
        formWidgetData.page_name
      );
      const updatedWidgetsPercanteages = changeAllWidgetsPercentageVal(
        pageWidgets,
        totalPercentages
      );

      await updateWidgetInBackend(updatedWidgetsPercanteages);
    } catch (err) {
      console.error("Error updating widgets:", err);
    }
  };

  const updateWidgetsPercentages = async (totalPercentages: number) => {
    const pegesSet = new Set(pages);
    if (pegesSet.has(formWidgetData.page_name)) {
      if (formWidgetData.page_name === pageName) {
        await updateCurrPageWidgets(totalPercentages, widgets);
      } else {
        await updateExistingPageWidgets(totalPercentages);
      }
    }
  };

  const handleSubmit = async () => {
    if (formBtnTxt === "Submit") {
      const totalPercentages = +formWidgetData.showToPercentage + 100;
      const pagesSet = new Set(pages);

      await updateWidgetsPercentages(totalPercentages);

      if (pagesSet.has(formWidgetData.page_name)) {
        formWidgetData.showToPercentage =
          (+formWidgetData.showToPercentage / totalPercentages) * 100;
      } else {
        formWidgetData.showToPercentage = 100;
      }

      createWidget();
    }
    if (formBtnTxt === "Edit") {
      const otherWidgets = widgets.filter(
        (widget) => widget.id !== formWidgetData.id
      );

      const otherWidgetsSum = otherWidgets.reduce(
        (sum, widget) => sum + Number(widget.showToPercentage),
        0
      );
      const totalPercentages =
        +formWidgetData.showToPercentage + otherWidgetsSum;
      await updateCurrPageWidgets(totalPercentages, otherWidgets);

      const { id, page_name, ...data } = formWidgetData;
      data.showToPercentage = (data.showToPercentage / totalPercentages) * 100;

      updateWidget(page_name, id, data);
    }
  };

  useEffect(() => {
    getAllWidgets();
  }, []);

  function wrapObjectInArray<T>(data: T | T[]): T[] {
    if (typeof data === "object" && !Array.isArray(data) && data !== null) {
      return [data];
    }
    return Array.isArray(data) ? data : [data];
  }

  const getPageWidgets = (pageName: string) => {
    api
      .getWidgetsByPageName(pageName)
      .then((res) => {
        const widgets = wrapObjectInArray(res);
        setWidgets(widgets);
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = async (widgetId: string) => {
    const otherWidgets = widgets.filter((widget) => widget.id !== widgetId);

    const otherWidgetsSum = otherWidgets.reduce(
      (sum, widget) => sum + Number(widget.showToPercentage),
      0
    );
    const totalPercentages = otherWidgetsSum;
    await updateCurrPageWidgets(totalPercentages, otherWidgets);

    api
      .deleteWidget(pageName, widgetId)
      .then((res) => {
        getPageWidgets(pageName);
        getAllWidgets();
      })
      .catch((err) => console.log(err));
  };

  const handleEditBtnClick = (widget: IWidget) => {
    openPopup();
    setFormWidgetData(widget);
    setFormBtnTxt("Edit");
  };
  const getRandomWidget = () => {
    const num = generateRandomNumber();
    const randomWidget = showRandomWidget(num, widgets);
    if (randomWidget) {
      navigate(`${pageName}/${randomWidget.id}`);
      setWidgetTorender(randomWidget);
    }
  };

  const openPopup = () => {
    setIsPopupOpen(true);
    handleInputChange("page_name", pageName);
    const pagesSet = new Set(pages);
    if (!pagesSet.has(formWidgetData.page_name)) {
      handleInputChange("showToPercentage", "100");
    }
  };

  useEffect(() => {
    const pagesSet = new Set(pages);
    if (pagesSet.has(pageName) && pageName) {
      getPageWidgets(pageName);
    }
  }, [pageName, widgetId, pages]);

  useEffect(() => {
    getRandomWidget();
  }, [widgets]);

  return (
    <div className="App">
      <Header pages={pages} currentPage={pageName} onPopupOpen={openPopup} />
      <PopupWithForm
        isOpen={isPopupOpen}
        onClosePopup={close}
        widgetData={formWidgetData}
        onSubmit={handleSubmit}
        formBtnTxt={formBtnTxt}
        onInputChange={handleInputChange}
      />

      <Routes>
        {widgetToRender.id ? (
          <Route
            path={`/${pageName}/${widgetId || ""}`}
            element={
              <PageWidgets
                widget={widgetToRender}
                currPage={pageName}
                onWidgetDelete={handleDelete}
                onEditBtnClick={handleEditBtnClick}
                key={window.location.pathname}
              />
            }
          />
        ) : (
          <Route
            path={`/${pageName}/${widgetId || ""}`}
            element={<p className="App__err">There is no Widget to display</p>}
          />
        )}
      </Routes>
    </div>
  );
}

export default App;
