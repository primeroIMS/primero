/* eslint-disable react/no-array-index-key  */
import React from "react";
import PropTypes from "prop-types";
import { FieldArray, connect, getIn } from "formik";
import {
  Button,
  Box,
  IconButton,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary
} from "@material-ui/core";
import { useI18n } from "components/i18n";
import { makeStyles } from "@material-ui/styles";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FormSectionField from "./FormSectionField";
import { constructInitialValues } from "../helpers";
import styles from "./styles.css";

const SubformField = ({
  field,
  formik,
  mode,
  subformFields,
  setSubformFields
}) => {
  const css = makeStyles(styles)();

  const {
    display_name: displayName,
    name,
    subform_section_id: subformSectionID
  } = field;

  const i18n = useI18n();

  const initialSubformValue = constructInitialValues([subformSectionID]);

  const values = getIn(formik.values, name);

  const renderSubformHeading = (arrayHelpers, index, fieldSubform) => {
    return (
      <Box display="flex">
        <Box flexGrow="1">
          <h3 className={css.subformHeading}>{displayName[i18n.locale]}</h3>
        </Box>
        <Box>
          {!mode.isShow && (
            <>
              <IconButton
                onClick={() => {
                  if (mode.isEdit) {
                    values[index]._destroy = true;
                    const uniqueId = values[index].unique_id;
                    const formName = fieldSubform.name;
                    if (uniqueId) {
                      let updatedData = subformFields[formName] || [];
                      updatedData = [
                        ...updatedData,
                        {
                          _destroy: true,
                          unique_id: uniqueId
                        }
                      ];
                      setSubformFields({
                        ...subformFields,
                        [formName]: updatedData
                      });
                    }
                  }
                  arrayHelpers.remove(index);
                }}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton onClick={() => arrayHelpers.push({})}>
                <AddIcon />
              </IconButton>
            </>
          )}
        </Box>
      </Box>
    );
  };

  const ConditionalWrapper = (condition, wrapper, header, children) =>
    condition ? (
      wrapper(children, header)
    ) : (
      <>
        {header}
        {children}
      </>
    );

  const ExpansionWrapper = (children, header) => {
    return (
      <ExpansionPanel className={css.expansionPanel}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          {header}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>{children}</ExpansionPanelDetails>
      </ExpansionPanel>
    );
  };

  const renderFields = arrayHelpers => {
    if (values && values.length > 0) {
      return values.map((subForm, index) => {
        return (
          <div key={index}>
            {ConditionalWrapper(
              mode.isShow,
              ExpansionWrapper,
              renderSubformHeading(arrayHelpers, index, field),
              <div className={css.exandedSubform}>
                {field.subform_section_id.fields.map(f => {
                  const fieldProps = {
                    name: `${field.name}[${index}].${f.name}`,
                    field: f,
                    mode,
                    index,
                    parentField: field
                  };
                  return (
                    <Box my={3} key={f.name}>
                      <FormSectionField {...fieldProps} />
                    </Box>
                  );
                })}
              </div>
            )}
          </div>
        );
      });
    }

    return null;
  };

  const renderFieldArray = arrayHelpers => {
    return (
      <>
        {renderFields(arrayHelpers)}
        {!mode.isShow && (
          <Button
            size="medium"
            variant="contained"
            onClick={() => arrayHelpers.push(initialSubformValue)}
          >
            {i18n.t("form_section.buttons.add")}
          </Button>
        )}
      </>
    );
  };

  return (
    <>
      <FieldArray name={name} render={renderFieldArray} />
    </>
  );
};

SubformField.propTypes = {
  field: PropTypes.object.isRequired,
  mode: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  subformFields: PropTypes.object.isRequired,
  setSubformFields: PropTypes.func.isRequired
};

export default connect(SubformField);
