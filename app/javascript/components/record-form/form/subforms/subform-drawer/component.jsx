// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { Drawer } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import ActionButton from "../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../action-button/constants";

import { NAME } from "./constants";
import css from "./styles.css";

function Component({ open, cancelHandler, children, title }) {
  return (
    <Drawer
      data-testid="drawer"
      anchor="right"
      open={open}
      onClose={cancelHandler}
      classes={{ paper: css.subformDrawer }}
    >
      <div className={css.subformDrawerContent}>
        <div className={css.title}>
          <h2>{title}</h2>
          <div>
            <ActionButton
              icon={<CloseIcon />}
              text="cancel"
              type={ACTION_BUTTON_TYPES.icon}
              isTransparent
              rest={{
                className: css.closeButton,
                onClick: cancelHandler
              }}
            />
          </div>
        </div>
        {children}
      </div>
    </Drawer>
  );
}

Component.propTypes = {
  cancelHandler: PropTypes.func,
  children: PropTypes.node.isRequired,
  open: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};

Component.displayName = NAME;

export default Component;
