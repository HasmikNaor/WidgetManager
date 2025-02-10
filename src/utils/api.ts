import { IWidget, IWidgetForUpdate } from "./interfaces";

class Api {
  baseUrl: string;
  headers: any;

  constructor({ baseUrl, headers }: { baseUrl: string; headers?: any }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  customFetch(url: string, headers?: any) {
    return fetch(url, headers).then((res) => {
      return res.ok ? res.json() : Promise.reject(res.statusText);
    });
  }

  getAllWidgets() {
    return this.customFetch(`${this.baseUrl}/widgets`, {
      headers: this.headers,
    });
  }
  getWidgetsByPageName(pageName: string) {
    return this.customFetch(`${this.baseUrl}/widget/${pageName}`);
  }

  createNewWidget(newWidget: IWidget) {
    return this.customFetch(`${this.baseUrl}/widget`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(newWidget),
    });
  }

  deleteWidget(pageName: string, widgetID: string) {
    return this.customFetch(`${this.baseUrl}/widget/${pageName}/${widgetID}`, {
      headers: this.headers,
      method: "DELETE",
    });
  }

  updateWidget(pageName: string, widgetID: string, data: IWidgetForUpdate) {
    return this.customFetch(`${this.baseUrl}/widget/${pageName}/${widgetID}`, {
      headers: this.headers,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
}

export const api = new Api({
  baseUrl: "http://127.0.0.1:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default Api;
