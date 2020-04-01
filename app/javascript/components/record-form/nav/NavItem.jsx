import React from "react";
import PropTypes from "prop-types";
import { ListItem, ListItemText } from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/styles";

import Jewel from "../../jewel";

import styles from "./styles.css";
import { NAV_ITEM } from "./constants";

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
    group: isNested ? group : false,
    parentItem: isNested
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
        {/* TODO: This will need to be dynamic once connected to endpoint */}
        {name === "Case Plan" ? <Jewel value={name} isForm /> : name}
      </ListItemText>
      {isNested && (open ? <ExpandMore /> : <ExpandLess />)}
    </ListItem>
  );
};

NavItem.displayName = NAV_ITEM;

NavItem.propTypes = {
  form: PropTypes.object,
  groupItem: PropTypes.bool,
  handleClick: PropTypes.func,
  isNested: PropTypes.bool,
  name: PropTypes.string,
  open: PropTypes.bool,
  selectedForm: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default NavItem;
