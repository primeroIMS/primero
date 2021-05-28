import { cloneElement } from "react";

import { LISTBOX_PADDING } from "../constants";

const renderRow = props => {
  const { data, index, style } = props;

  return cloneElement(data[index], {
    style: {
      ...style,
      top: style.top + LISTBOX_PADDING,
      lineHeight: "18px",
      fontSize: ".9rem"
    }
  });
};

export default renderRow;
