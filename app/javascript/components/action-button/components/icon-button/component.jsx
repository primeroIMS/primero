// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { Fragment } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { IconButton, Tooltip } from "@mui/material";

import css from "./styles.css";
import { NAME } from "./constants";

function Component({ icon, id, rest, ...otherProps }) {
  const { tooltip } = otherProps;
  const Parent = tooltip ? Tooltip : Fragment;
  const spanClasses = clsx({ [css.isDisabled]: rest.disabled });

  return (
    <Parent {...(tooltip ? { title: tooltip } : {})}>
      <span className={spanClasses}>
        <IconButton id={id} size="small" color="primary" variant="text" {...rest} {...otherProps}>
          {icon}
        </IconButton>
      </span>
    </Parent>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  icon: PropTypes.object,
  id: PropTypes.string.isRequired,
  isTransparent: PropTypes.bool,
  rest: PropTypes.object,
  text: PropTypes.string
};

export default Component;
