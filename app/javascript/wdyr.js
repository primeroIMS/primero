/* eslint-disable import/no-namespace */
import * as React from "react";
import whyDidYouRender from "@welldone-software/why-did-you-render";
import * as ReactRedux from "react-redux/lib";

if (process.env.NODE_ENV === "development") {
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackExtraHooks: [[ReactRedux, "useSelector", "useMemoizedSelector"]]
  });
}
