import React from "react";
import { Icon } from "@material-ui/core";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

const DragIndicator = props => (
  <Icon {...props}>
    <DragIndicatorIcon />
  </Icon>
);

DragIndicator.displayName = "DragIndicator";

export default DragIndicator;
