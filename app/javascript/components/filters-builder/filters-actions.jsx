import React from "react";
import PropTypes from "prop-types";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { NAME } from "./config";
import styles from "./styles.css";

const FiltersActions = ({ actions }) => {
  const css = makeStyles(styles)();
  const actionButtons = actions.map(action => {
    return (
      <Button key={action.id} {...action.buttonProps}>
        {action.label}
      </Button>
    );
  });

  return <div className={css.actionButtons}>{actionButtons}</div>;
};

FiltersActions.propTypes = {
  actions: PropTypes.array.isRequired
};

FiltersActions.displayName = `${NAME}FiltersActions`;

export default FiltersActions;
