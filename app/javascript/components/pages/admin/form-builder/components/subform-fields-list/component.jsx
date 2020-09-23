import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import isEqual from "lodash/isEqual";

import { useI18n } from "../../../../../i18n";
import FieldsList from "../fields-list";
import CustomFieldDialog from "../custom-field-dialog";
import styles from "../field-dialog/styles.css";

import { NAME } from "./constants";

const Component = ({
  formContextFields,
  getValues,
  register,
  setValue,
  subformField,
  subformSortBy,
  subformGroupBy,
  unregister
}) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  return (
    <>
      <div className={css.subformFieldTitle}>
        <h1>{i18n.t("forms.fields")}</h1>
        <CustomFieldDialog getValues={getValues} />
      </div>
      <FieldsList
        formContextFields={formContextFields}
        getValues={getValues}
        register={register}
        unregister={unregister}
        setValue={setValue}
        subformField={subformField}
        subformSortBy={subformSortBy}
        subformGroupBy={subformGroupBy}
      />
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  formContextFields: PropTypes.object.isRequired,
  getValues: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  subformField: PropTypes.object.isRequired,
  subformGroupBy: PropTypes.string,
  subformSortBy: PropTypes.string,
  unregister: PropTypes.func.isRequired
};

Component.whyDidYouRender = true;

export default React.memo(
  Component,
  (prev, next) =>
    isEqual(prev.formContextFields, next.formContextFields) &&
    prev.getValues === next.getValues &&
    prev.register === next.register &&
    prev.setValue === next.setValue &&
    prev.subformSortBy === next.subformSortBy &&
    prev.subformGroupBy === next.subformGroupBy &&
    prev.unregister === next.unregister &&
    prev.subformField.equals(next.subformField)
);
