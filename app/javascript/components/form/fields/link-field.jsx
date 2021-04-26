import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { FormControl } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useWatch } from "react-hook-form";

import InputLabel from "../components/input-label";

import styles from "./styles.css";

const useStyles = makeStyles(styles);

const LinkField = ({ commonInputProps, metaInputProps, formMethods }) => {
  const css = useStyles();
  const { tooltip, href } = metaInputProps;
  const { name, label } = commonInputProps;
  const { control } = formMethods;

  const fieldValue = useWatch({ control, name });

  return (
    <FormControl>
      <div className={css.linkFieldLabel}>
        <InputLabel tooltip={tooltip} text={label} />
      </div>
      <NavLink to={`${href}`} className={css.linkField}>
        {fieldValue}
      </NavLink>
    </FormControl>
  );
};

LinkField.displayName = "LinkField";

LinkField.propTypes = {
  commonInputProps: PropTypes.object.isRequired,
  formMethods: PropTypes.object.isRequired,
  metaInputProps: PropTypes.object
};

export default LinkField;
