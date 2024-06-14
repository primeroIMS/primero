// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useCallback } from "react";
import PropTypes from "prop-types";

import { useI18n } from "../../../../../i18n";
import FieldsList from "../fields-list";
import CustomFieldDialog from "../custom-field-dialog";
import css from "../field-dialog/styles.css";

import { NAME } from "./constants";

function Component({ formMethods, subformField, subformSortBy, subformGroupBy }) {
  const i18n = useI18n();
  const { getValues } = formMethods;

  const getFieldValues = useCallback(props => getValues(props), []);

  return (
    <>
      <div className={css.subformFieldTitle}>
        <h1>{i18n.t("forms.fields")}</h1>
        <CustomFieldDialog getValues={getFieldValues} />
      </div>
      <FieldsList
        formMethods={formMethods}
        subformField={subformField}
        subformSortBy={subformSortBy}
        subformGroupBy={subformGroupBy}
      />
    </>
  );
}

Component.displayName = NAME;

Component.propTypes = {
  formMethods: PropTypes.object.isRequired,
  subformField: PropTypes.object.isRequired,
  subformGroupBy: PropTypes.string,
  subformSortBy: PropTypes.string
};

export default Component;
