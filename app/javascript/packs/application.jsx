import "core-js/stable";
import "regenerator-runtime/runtime";

import React from "react";
import { render } from "react-dom";

import App from "../app";
import serviceWorker from "../service-worker";

serviceWorker();

render(<App />, document.getElementById("root"));
