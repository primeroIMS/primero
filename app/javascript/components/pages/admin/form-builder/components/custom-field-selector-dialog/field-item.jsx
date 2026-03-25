import PropTypes from "prop-types";
import { Radio, ListItem, ListItemText } from "@mui/material";
import { cx } from "@emotion/css";

import { TICK_FIELD, RADIO_FIELD, SUBFORM_SECTION } from "../../../../../form/constants";
import { useI18n } from "../../../../../i18n";

import css from "./styles.css";

function Component({ name, Icon, onItemChange, isSubform, selectedItem }) {
  const i18n = useI18n();

  const classes = cx(css.inputIcon, {
    [css.inputIconTickBox]: [RADIO_FIELD, TICK_FIELD].includes(name)
  });

  if (name === SUBFORM_SECTION && isSubform) {
    return null;
  }

  return (
    <ListItem secondaryAction={<Radio value={name} checked={name === selectedItem} onChange={onItemChange} />}>
      <ListItemText className={css.label}>
        <div data-testid="field">{i18n.t(`fields.${name}`)}</div>
        <div className={css.inputPreviewContainer}>
          <Icon className={classes} />
        </div>
      </ListItemText>
    </ListItem>
  );
}

Component.displayName = "FieldItem";

Component.propTypes = {
  Icon: PropTypes.elementType,
  isSubform: PropTypes.bool,
  name: PropTypes.string,
  onItemChange: PropTypes.func,
  selectedItem: PropTypes.string
};

export default Component;
