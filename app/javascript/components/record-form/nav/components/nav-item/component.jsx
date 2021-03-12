/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */
import PropTypes from "prop-types";
import { ListItem, ListItemText } from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";
import isEmpty from "lodash/isEmpty";

import Jewel from "../../../../jewel";
import styles from "../../styles.css";
import { useApp } from "../../../../application";

import { NAME } from "./constants";

const useStyles = makeStyles(styles);

const Component = ({
  form,
  groupItem,
  handleClick,
  isNested,
  isNew,
  itemsOfGroup,
  name,
  open,
  recordAlerts,
  selectedForm,
  hasError
}) => {
  const css = useStyles();
  const { disabledApplication } = useApp();

  const { formId, group } = form;

  const handlerArgs = {
    formId,
    group,
    parentItem: isNested
  };

  const formsWithAlerts =
    recordAlerts?.size && [...recordAlerts.map(alert => alert.get("form_unique_id"))].filter(alert => !isEmpty(alert));

  const validateAlert = item => !isEmpty(formsWithAlerts) && formsWithAlerts?.includes(item);

  const showJewel = isNested ? itemsOfGroup?.some(alert => validateAlert(alert)) : validateAlert(formId);
  const handleOnClick = () => handleClick(handlerArgs);

  const formText = () => {
    return (
      <>
        {!isNew && showJewel ? (
          <Jewel value={name} isForm isError={hasError} />
        ) : (
          <>
            {name}
            {hasError && <Jewel isError={hasError} />}
          </>
        )}
      </>
    );
  };

  return (
    <ListItem
      selected={selectedForm === formId && !isNested}
      button
      key={formId}
      onClick={handleOnClick}
      classes={{
        selected: css.navSelected,
        root: css.root
      }}
      disabled={disabledApplication}
    >
      <ListItemText className={groupItem ? css.nestedItem : css.item}>{formText()}</ListItemText>
      {isNested && (open ? <ExpandMore /> : <ExpandLess />)}
    </ListItem>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  form: PropTypes.object,
  groupItem: PropTypes.bool,
  handleClick: PropTypes.func,
  hasError: PropTypes.bool,
  isNested: PropTypes.bool,
  isNew: PropTypes.bool,
  itemsOfGroup: PropTypes.array,
  name: PropTypes.string,
  open: PropTypes.bool,
  recordAlerts: PropTypes.object,
  selectedForm: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default Component;
