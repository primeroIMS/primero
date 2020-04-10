import React from "react";
import { Icon } from "@material-ui/core";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";

const Component = props => (
  <Icon {...props}>
    <DragIndicatorIcon />
  </Icon>
);

Component.displayName = "DragIndicator";

export default Component;
