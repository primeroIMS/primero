import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { subYears } from "date-fns";
import { TextField as MuiTextField } from "formik-material-ui";
import { useSelector, useDispatch } from "react-redux";
import { ButtonBase } from "@material-ui/core";
import { FastField, connect } from "formik";

import { useI18n } from "../../i18n";
import { saveRecord, selectRecordAttribute } from "../../records";

import { GuidingQuestions } from "./components";

const useStyles = makeStyles(theme => ({
  hideNameStyle: {
    paddingTop: 6,
    color: theme.primero.colors.blue,
    fontSize: 9,
    fontWeight: "bold"
  }
}));

const TextField = ({ name, field, formik, recordType, recordID, ...rest }) => {
  const css = useStyles();

  const {
    type,
    visible,
    guiding_questions: guidingQuestions,
    hide_on_view_page: hideOnViewPage
  } = field;
  const i18n = useI18n();
  const dispatch = useDispatch();

  const recordName = useSelector(state =>
    selectRecordAttribute(state, recordType, recordID, "name")
  );
  const isHiddenName = /\*{2,}/.test(recordName);

  useEffect(() => {
    if (recordName) {
      formik.setFieldValue("name", recordName, true);
    }
  }, [recordName]);

  const fieldProps = {
    type: type === "numeric_field" ? "number" : "text",
    multiline: type === "textarea",
    name,
    ...rest
  };

  const updateDateBirthField = (form, value) => {
    const matches = name.match(/(.*)age$/);

    if (matches && value) {
      const diff = subYears(new Date(), value);

      form.setFieldValue(`${matches[1]}date_of_birth`, diff, true);
    }
  };

  const hideFieldValue = renderProps => {
    dispatch(
      saveRecord(
        recordType,
        "update",
        { data: { hidden_name: !isHiddenName } },
        renderProps.form.initialValues.id,
        false,
        false
      )
    );
  };

  console.log(rest?.mode?.isShow, hideOnViewPage, visible);

  return !(rest?.mode?.isShow && hideOnViewPage) && visible ? (
    <FastField
      name={name}
      render={renderProps => {
        return (
          <>
            <MuiTextField
              form={renderProps.form}
              field={{
                ...renderProps.field,
                onChange(evt) {
                  const { value } = evt.target;

                  updateDateBirthField(renderProps.form, value);

                  return renderProps.form.setFieldValue(
                    renderProps.field.name,
                    value,
                    true
                  );
                }
              }}
              {...fieldProps}
            />
            {name === "name" && fieldProps.mode.isEdit ? (
              <ButtonBase
                className={css.hideNameStyle}
                onClick={() => hideFieldValue(renderProps)}
              >
                {isHiddenName
                  ? i18n.t("logger.hide_name.view")
                  : i18n.t("logger.hide_name.protect")}
              </ButtonBase>
            ) : null}
            {guidingQuestions &&
            (fieldProps.mode.isEdit || fieldProps.mode.isNew) ? (
              <GuidingQuestions
                label={i18n.t("buttons.guiding_questions")}
                text={guidingQuestions[i18n.locale]}
              />
            ) : null}
          </>
        );
      }}
    />
  ) : null;
};

TextField.propTypes = {
  field: PropTypes.object,
  formik: PropTypes.object,
  name: PropTypes.string,
  recordID: PropTypes.string,
  recordType: PropTypes.string
};

export default connect(TextField);
