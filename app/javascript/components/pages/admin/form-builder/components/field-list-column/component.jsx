import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { Radio } from "@material-ui/core";

import { SUBFORM_SECTION_CONFIGURATION } from "../field-list-item/constants";
import css from "../fields-list/styles.css";

import { NAME } from "./constants";

function Component({ checked, columnName, fieldName, formMethods, limitedProductionSite, parentFieldName }) {
  const { control } = formMethods;

  return (
    <div className={css.fieldColumn}>
      <Controller
        control={control}
        as={<Radio />}
        inputProps={{ value: fieldName }}
        checked={checked}
        name={`${parentFieldName}.${SUBFORM_SECTION_CONFIGURATION}.${columnName}`}
        disabled={limitedProductionSite}
      />
    </div>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  checked: PropTypes.bool,
  columnName: PropTypes.string,
  fieldName: PropTypes.string,
  formMethods: PropTypes.object.isRequired,
  limitedProductionSite: PropTypes.bool,
  parentFieldName: PropTypes.string
};

export default Component;
