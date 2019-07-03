import React from "react";
import PropTypes from "prop-types";
import { ListItem, ListItemText } from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/styles";
import styles from "./styles.css";

const NavItem = ({ form, isNested, open, handleClick, selectedForm }) => {
  const css = makeStyles(styles)();

  const { formId, name, group } = form;

  const handlerArgs = {
    formId,
    group: isNested ? group : false
  };

  return (
    <ListItem
      selected={selectedForm === formId && !isNested}
      button
      key={formId}
      onClick={() => handleClick(handlerArgs)}
      classes={{ selected: css.navSelected, root: css.root }}
    >
      <ListItemText>{name}</ListItemText>
      {isNested && (open ? <ExpandMore /> : <ExpandLess />)}
    </ListItem>
  );
};

NavItem.propTypes = {
  form: PropTypes.object,
  isNested: PropTypes.bool,
  open: PropTypes.bool,
  handleClick: PropTypes.func,
  selectedForm: PropTypes.string
};

export default NavItem;
