/* eslint-disable import/no-namespace */
import React from "react";
import whyDidYouRender from "@welldone-software/why-did-you-render";
import * as ReactRedux from "react-redux/lib";

if (process.env.NODE_ENV === "profile") {
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackExtraHooks: [[ReactRedux, "useSelector"]]
  });
}
