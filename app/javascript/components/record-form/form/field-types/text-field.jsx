// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable camelcase */

import { useEffect } from "react";
import PropTypes from "prop-types";
import { subYears } from "date-fns";
import { useDispatch } from "react-redux";
import { ButtonBase, TextField as MuiTextField } from "@mui/material";
import { FastField, connect, getIn } from "formik";
import { useParams } from "react-router-dom";
import omitBy from "lodash/omitBy";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";

import { toServerDateFormat, useMemoizedSelector } from "../../../../libs";
import { useI18n } from "../../../i18n";
import { saveRecord, selectRecordAttribute } from "../../../records";
import { valueParser } from "../../../form/utils";
import { NUMERIC_FIELD } from "../../constants";
import { TEXT_FIELD_NAME } from "../constants";
import { shouldFieldUpdate } from "../utils";

import css from "./styles.css";

function TextField({ name, field, formik, mode, recordType, recordID, formSection, ...rest }) {
  const { type } = field;
  const i18n = useI18n();
  const dispatch = useDispatch();
  const { id } = useParams();

  const recordName = useMemoizedSelector(state => selectRecordAttribute(state, recordType, recordID, "name"));

  const isHiddenName = /\*{2,}/.test(recordName);
  const hiddenTextField = field.hidden_text_field;
  const ageMatches = type === NUMERIC_FIELD && name.match(/(.*)age$/);

  const dateOfBirthFieldName = isEmpty(ageMatches) ? null : `${ageMatches[1]}date_of_birth`;
  const isDateOfBirthVisible =
    dateOfBirthFieldName &&
    formSection?.fields?.some(formField => formField.name === dateOfBirthFieldName && formField.visible);

  useEffect(() => {
    if (recordName && name === "name" && !formik.touched.name) {
      formik.setFieldValue("name", recordName, false);
    }
  }, [recordName, name, formik.touched.name]);

  const fieldProps = {
    type: type === "numeric_field" ? "number" : "text",
    multiline: type === "textarea",
    name,
    ...omitBy(rest, (value, key) => ["formSection", "field", "displayName", "linkToForm", "tickBoxlabel"].includes(key))
  };

  const updateDateBirthField = (form, value) => {
    if (ageMatches && value && isDateOfBirthVisible) {
      const currentYear = new Date().getFullYear();
      const diff = subYears(new Date(currentYear, 0, 1), value);

      form.setFieldValue(dateOfBirthFieldName, toServerDateFormat(diff), false);
    }
  };

  const hideFieldValue = () => {
    dispatch(saveRecord(recordType, "update", { data: { hidden_name: !isHiddenName } }, id, false, false, false));
  };

  const fieldError = getIn(formik.errors, name);

  return (
    <FastField name={name} shouldUpdate={shouldFieldUpdate} locale={i18n.locale}>
      {renderProps => {
        const handleOnClick = () => hideFieldValue();

        const fieldValue = isNil(renderProps.field.value) ? "" : renderProps.field.value;

        return (
          <>
            <MuiTextField
              id={name}
              data-testid="text-field"
              variant="outlined"
              {...renderProps.field}
              value={fieldValue}
              inputProps={{ ...fieldProps.InputProps, ...(rest.error ? { error: rest.error } : {}) }}
              error={!!fieldError}
              onChange={evt => {
                const value = valueParser(type, evt.target.value);

                updateDateBirthField(renderProps.form, value);

                return renderProps.form.setFieldValue(renderProps.field.name, value, false);
              }}
              {...fieldProps}
              helperText={fieldError || fieldProps?.helperText}
            />
            {hiddenTextField && mode.isEdit && !rest?.formSection?.is_nested && !rest.disabled ? (
              <ButtonBase
                data-testid="button-base"
                id="hidden-name-button"
                className={css.hideNameStyle}
                onClick={handleOnClick}
              >
                {isHiddenName ? i18n.t("logger.hide_name.view") : i18n.t("logger.hide_name.protect")}
              </ButtonBase>
            ) : null}
          </>
        );
      }}
    </FastField>
  );
}

TextField.displayName = TEXT_FIELD_NAME;

TextField.propTypes = {
  field: PropTypes.object,
  formik: PropTypes.object,
  formSection: PropTypes.object,
  mode: PropTypes.object.isRequired,
  name: PropTypes.string,
  recordID: PropTypes.string,
  recordType: PropTypes.string
};

export default connect(TextField);
