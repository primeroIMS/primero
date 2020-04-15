import React, { useEffect, useImperativeHandle, useState } from "react";
import PropTypes from "prop-types";
import { useForm, FormContext } from "react-hook-form";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { fromJS } from "immutable";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import isEmpty from "lodash/isEmpty";

import { form, getInitialValues, reorderValues } from "../../utils";
import { FieldRecord, TEXT_FIELD, whichFormMode } from "../../../../../form";
import FormSection from "../../../../../form/components/form-section";
import { useI18n } from "../../../../../i18n";
import { dataToJS } from "../../../../../../libs";
import {
  LOOKUP_NAME,
  LOOKUP_TRANSLATED_NAME,
  LOOKUP_VALUES
} from "../../constants";
import HeaderValues from "../header-values";
import DraggableRow from "../draggable-row";
import styles from "../styles.css";

import { NAME } from "./constants";

const Component = ({ formRef, mode, lookup }) => {
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
  const keys = [...lookup.get(LOOKUP_VALUES, fromJS([])).map(t => t.get("id"))];

  const [items, setItems] = useState(keys);
  const [removed, setRemoved] = useState([]);
  const values = getInitialValues(
    locales.map(locale => locale.id),
    dataToJS(lookup.get(LOOKUP_VALUES, fromJS([])))
  );

  const defaultValues = {
    name: lookup.getIn([LOOKUP_NAME, defaultLocale]),
    options: firstLocaleOption,
    translated_name: "",
    values
  };

  const onSubmit = data => console.log("ON SUBMIT", data, "SORT", items);

  useImperativeHandle(formRef, () => ({
    submitForm(e) {
      formMethods.handleSubmit(data => {
        onSubmit(data);
      })(e);
    }
  }));

  useEffect(() => {
    if (keys.length) {
      setItems(keys);
    }
    formMethods.reset(defaultValues);
  }, [defaultValues.name]);

  // Setting translated value
  if (watchedOption && selectedOption !== defaultLocale) {
    formMethods.setValue(
      LOOKUP_TRANSLATED_NAME,
      selectedOption
        ? formMethods.getValues().translated_name ||
            lookup.getIn([LOOKUP_NAME, selectedOption])
        : ""
    );
  }

  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "transparent" : "ligthblue"
  });

  const hiddenTranslation =
    isFirstLocaleOptionSelected ||
    (typeof selectedOption === "object" && isEmpty(selectedOption?.id))
      ? css.hideTranslationsFields
      : null;

  const removeValue = item => {
    setRemoved([...removed, item]);
    setItems([...keys.filter(key => key !== item)]);
  };

  const onDragEnd = result => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }
    const { index: startIndex } = source;
    const { index: endIndex } = destination;

    const newItems = reorderValues(items, startIndex, endIndex);

    setItems(newItems);
    const newValues = formMethods.getValues();

    formMethods.reset({ ...newValues, ...{ values } });
  };

  const renderValues = () => {
    return items
      .filter(item => !removed.includes(item))
      .map((item, index) => {
        const fieldName = locale => `values[${locale}][${item}]`;

        const defaultField = FieldRecord({
          name: fieldName(defaultLocale),
          type: TEXT_FIELD
        });

        const translatedField = FieldRecord({
          name: fieldName(
            selectedOption === defaultLocale ? null : selectedOption
          ),
          type: TEXT_FIELD
        });

        return (
          <DraggableRow
            defaultField={defaultField}
            hiddenClassName={hiddenTranslation}
            index={index}
            isDragDisabled={!formMode.get("isEdit")}
            removeValue={removeValue}
            translatedField={translatedField}
            uniqueId={item}
          />
        );
      });
  };

  return (
    <FormContext {...formMethods} formMode={formMode}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        {form(i18n, locales, hiddenTranslation).map(formSection => (
          <FormSection formSection={formSection} key={formSection.unique_id} />
        ))}

        <Grid container spacing={1}>
          <span className={css.optionsLabel}>{i18n.t("lookup.values")}</span>
          <Grid
            item
            xs={12}
            className={formMode.get("isShow") ? css.showColor : ""}
          >
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppableLookup" type="lookupGroup">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    <HeaderValues hiddenClassName={hiddenTranslation} />
                    {renderValues()}
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

Component.displayName = NAME;

Component.propTypes = {
  formRef: PropTypes.object.isRequired,
  lookup: PropTypes.object,
  mode: PropTypes.string
};

export default Component;
