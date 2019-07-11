import React from "react";
import PropTypes from "prop-types";
import { ListItem, ListItemText } from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/styles";
import styles from "./styles.css";

const NavItem = ({
  form,
  isNested,
  open,
  handleClick,
  selectedForm,
  groupItem,
  name
}) => {
  const css = makeStyles(styles)();

  const { formId, group } = form;

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
      classes={{
        selected: css.navSelected,
        root: css.root
      }}
    >
      <ListItemText className={groupItem ? css.nestedItem : css.item}>
        {name}
      </ListItemText>
      {isNested && (open ? <ExpandMore /> : <ExpandLess />)}
    </ListItem>
  );
};

NavItem.propTypes = {
  form: PropTypes.object,
  isNested: PropTypes.bool,
  open: PropTypes.bool,
  handleClick: PropTypes.func,
  selectedForm: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  groupItem: PropTypes.bool,
  name: PropTypes.string
};

export default NavItem;
