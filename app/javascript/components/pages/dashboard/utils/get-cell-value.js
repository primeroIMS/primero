// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { isValidElement } from "react";

export default element => {
  if (isValidElement(element)) {
    if (element.props.children?.type === "span") {
      return parseInt(element.props.children.props.children, 10);
    }
  }

  return parseInt(element, 10);
};
