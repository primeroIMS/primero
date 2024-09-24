// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import "../wdyr";
import "core-js/stable";
import "regenerator-runtime/runtime";

import { createRoot } from "react-dom/client";

import App from "../app";
import serviceWorker from "../service-worker";
import ErrorLogger from "../libs/error-logger";

serviceWorker();

ErrorLogger.startErrorListeners();

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);
