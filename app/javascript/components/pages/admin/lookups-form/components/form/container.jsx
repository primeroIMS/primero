import React, { useEffect, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import { useForm, FormContext } from "react-hook-form";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { fromJS } from "immutable";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import clsx from "clsx";
import isEmpty from "lodash/isEmpty";

import { form, getInitialValues, translateValues } from "../../utils";
import { FieldRecord, TEXT_FIELD, whichFormMode } from "../../../../../form";
import FormSection from "../../../../../form/components/form-section";
import FormSectionField from "../../../../../form/components/form-section-field";
import { useI18n } from "../../../../../i18n";
import { DragIndicator } from "../../../forms/forms-list/components";
import { dataToJS } from "../../../../../../libs";

import { NAME } from "./constants";
import styles from "./styles.css";

const Container = ({ formRef, mode, lookup }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const formMode = whichFormMode(mode);
  const locales = i18n.applicationLocales.toJS();
  const firstLocaleOption = locales?.[0];
  const defaultLocale = firstLocaleOption?.id;
  const formMethods = useForm();
  const watchedOption = formMethods.watch("options");
  const selectedOption = watchedOption?.id || watchedOption;
  const isFirstLocaleOptionSelected = selectedOption === firstLocaleOption?.id;

  const initialValues = {
    name: lookup.getIn(["name", defaultLocale]),
    options: firstLocaleOption,
    translated_name: "",
    values: getInitialValues(
      locales.map(locale => locale.id),
      dataToJS(lookup.get("values", fromJS({})))
    )
  };

  const onSubmit = data => console.log("ON SUBMIT", data);

  useImperativeHandle(formRef, () => ({
    submitForm(e) {
      formMethods.handleSubmit(data => {
        onSubmit(data);
      })(e);
    }
  }));

  // TODO: Move somewhere else
  const translatedLookupsValues = locale => {
    return translateValues(lookup.get("values", fromJS([])), locale);
  };

  // TODO: Move somewhere else
  const setTranslatedName = locale => {
    formMethods.setValue(
      "translated_name",
      locale ? lookup.getIn(["name", locale]) : ""
    );
  };
  // DEFAULT EN OPTIONS
  const translatedDefaultOptions = translatedLookupsValues(defaultLocale);

  if (isFirstLocaleOptionSelected) {
    setTranslatedName("");
  } else if (watchedOption) {
    setTranslatedName(selectedOption);
  }

  useEffect(() => {
    formMethods.reset(initialValues);
  }, [initialValues.name]);

  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "transparent"
  });

  const hiddenTranslation =
    isFirstLocaleOptionSelected ||
    (typeof selectedOption === "object" && isEmpty(selectedOption?.id))
      ? css.hideTranslationsFields
      : null;

  // TODO: Split component
  return (
    <FormContext {...formMethods} formMode={formMode}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        {form(i18n, locales, hiddenTranslation).map(formSection => (
          <FormSection formSection={formSection} key={formSection.unique_id} />
        ))}

        <Grid container spacing={1}>
          <span className={css.optionsLabel}>Options</span>
          <Grid
            item
            xs={12}
            className={formMode.get("isShow") ? css.showColor : ""}
          >
            <br />
            <DragDropContext onDragEnd={result => console.log(result)}>
              <Droppable droppableId="droppableLookup" type="lookupGroup">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    <div className={clsx(css.row, css.header)}>
                      <div className={css.dragIndicatorContainer} />
                      <div>English Text</div>
                      <div className={hiddenTranslation}>Translation Text</div>
                    </div>
                    {translatedDefaultOptions.map((item, index) => {
                      const defaultValueName = `values[${defaultLocale}][${item.id}]`;
                      const translatedValueName = `values[${selectedOption}][${item.id}]`;

                      const defaultField = FieldRecord({
                        name: defaultValueName,
                        type: TEXT_FIELD
                      });

                      const translatedField = FieldRecord({
                        name: translatedValueName,
                        type: TEXT_FIELD
                      });

                      return (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                          isDragDisabled={!formMode.get("isEdit")}
                        >
                          {(prov, snap) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              className={css.row}
                            >
                              <div className={css.dragIndicatorContainer}>
                                <DragIndicator {...provided.dragHandleProps} />
                              </div>
                              <div>
                                <FormSectionField
                                  field={defaultField}
                                  key={defaultField.name}
                                  checkErrors={fromJS({})}
                                />
                              </div>
                              <div className={hiddenTranslation}>
                                <FormSectionField
                                  field={translatedField}
                                  key={translatedField.name}
                                  checkErrors={fromJS({})}
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Grid>
        </Grid>
      </form>
    </FormContext>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  formRef: PropTypes.object.isRequired,
  lookup: PropTypes.object,
  mode: PropTypes.string
};

export default Container;
