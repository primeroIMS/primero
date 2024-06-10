// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/no-multi-comp, react/display-name */
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";

import { ACTION_BUTTON_TYPES } from "../../../../../action-button/constants";
import ActionButton from "../../../../../action-button";
import { SUBFORM_GROUP_BY, SUBFORM_SECTION_CONFIGURATION, SUBFORM_SORT_BY } from "../field-list-item/constants";
import { useApp } from "../../../../../application";

import { NAME, GROUP_BY, SORT_BY } from "./constants";
import css from "./styles.css";

const Component = ({ setValue, subformField, subformSortBy, subformGroupBy }) => {
  const { limitedProductionSite } = useApp();
  const fieldName = subformField.get("name");

  const onClearSortBy = () => {
    setValue(`${fieldName}.${SUBFORM_SECTION_CONFIGURATION}.${SUBFORM_SORT_BY}`, "", { shouldDirty: true });
  };

  const onClearGroupBy = () => {
    setValue(`${fieldName}.${SUBFORM_SECTION_CONFIGURATION}.${SUBFORM_GROUP_BY}`, "", { shouldDirty: true });
  };

  const renderClearButton = (fieldBy, onClick) =>
    ((fieldBy === SORT_BY && subformSortBy) || (fieldBy === GROUP_BY && subformGroupBy)) && (
      <ActionButton
        icon={<CloseIcon />}
        text={`fields.clear_${fieldBy}`}
        type={ACTION_BUTTON_TYPES.default}
        cancel
        rest={{
          onClick,
          hide: limitedProductionSite
        }}
      />
    );

  return (
    <div className={css.fieldRow}>
      <div className={css.fieldColumn}>{renderClearButton(SORT_BY, onClearSortBy)}</div>
      <div className={css.fieldColumn}>{renderClearButton(GROUP_BY, onClearGroupBy)}</div>
    </div>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  setValue: PropTypes.func.isRequired,
  subformField: PropTypes.object,
  subformGroupBy: PropTypes.string,
  subformSortBy: PropTypes.string
};

export default Component;
