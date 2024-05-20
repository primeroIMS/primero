// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import "../wdyr";
import "core-js/stable";
import "regenerator-runtime/runtime";

import { render } from "react-dom";
import { StrictMode } from "react";
import isEmpty from "lodash/isEmpty";

import App from "../app";
import serviceWorker from "../service-worker";
import ErrorLogger from "../libs/error-logger";
import Translations from "../db/collections/translations";

serviceWorker();

ErrorLogger.startErrorListeners();

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root"),
  () => {
    const loadTranslations = async () => {
      if (isEmpty(window.I18n.translations)) {
        const translations = await Translations.find();

        window.I18n.translations = translations;
      } else {
        Translations.save(window.I18n.translations);
      }
    };

    loadTranslations();
  }
);
