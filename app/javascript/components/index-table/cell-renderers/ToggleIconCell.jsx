import React from "react";
import PropTypes from "prop-types";
import { IconButton } from "@material-ui/core";
import { Photo, Flag } from "@material-ui/icons";

const ToggleIconCell = ({ value, icon }) =>
  value ? (
    <IconButton color="primary">
      {
        {
          photo: <Photo />,
          flag_count: <Flag />
        }[icon]
      }
    </IconButton>
  ) : null;

ToggleIconCell.displayName = "ToggleIconCell";

ToggleIconCell.propTypes = {
  icon: PropTypes.oneOf(["photo", "flag"]),
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
    PropTypes.number
  ])
};

export default ToggleIconCell;
