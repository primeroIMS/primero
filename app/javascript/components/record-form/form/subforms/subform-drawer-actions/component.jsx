// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { NAME } from "./constants";

const Component = ({ showActions, editActions, isShow }) => {
  if (isShow) {
    return showActions;
  }

  return editActions;
};

Component.propTypes = {
  editActions: PropTypes.node,
  isShow: PropTypes.object,
  showActions: PropTypes.node
};

Component.displayName = NAME;

export default Component;
