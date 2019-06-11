import React from "react";
import PropTypes from "prop-types";
import { IconButton } from "@material-ui/core";
import { Photo, Flag } from "@material-ui/icons";
import isEmpty from "lodash/isEmpty";

const ToggleIconCell = ({ value, icon }) => (
  <IconButton disabled={isEmpty(value)} color="primary">
    {
      {
        photo: <Photo />,
        flag: <Flag />
      }[icon]
    }
  </IconButton>
);

ToggleIconCell.propTypes = {
  value: PropTypes.bool,
  icon: PropTypes.oneOf(["photo", "flag"])
};

export default ToggleIconCell;
