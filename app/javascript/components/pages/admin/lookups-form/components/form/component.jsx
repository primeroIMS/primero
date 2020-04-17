import React, { useEffect, useImperativeHandle, useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { useForm, FormContext } from "react-hook-form";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { fromJS } from "immutable";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";

import {
  getInitialValues,
  getInitialNames,
  reorderValues,
  validations
} from "../../utils";
import {
  FieldRecord,
  TEXT_FIELD,
  SELECT_FIELD,
  whichFormMode
} from "../../../../../form";
import FormSectionField from "../../../../../form/components/form-section-field";
import { useI18n } from "../../../../../i18n";
import { dataToJS } from "../../../../../../libs";
import { LOOKUP_NAME, LOOKUP_VALUES } from "../../constants";
import HeaderValues from "../header-values";
import DraggableRow from "../draggable-row";
import styles from "../styles.css";
import { saveLookup } from "../../action-creators";
import { SAVE_METHODS } from "../../../../../../config";

import { NAME } from "./constants";

const Component = ({ formRef, mode, lookup }) => {
  const { id } = useParams();
  const i18n = useI18n();
  const dispatch = useDispatch();
  const css = makeStyles(styles)();
  const formMode = whichFormMode(mode);
  const locales = i18n.applicationLocales.toJS();
  const localesKeys = locales.map(locale => locale.id);
  const firstLocaleOption = locales?.[0];
  const defaultLocale = firstLocaleOption?.id;
  const validationsSchema = validations(i18n);

  const formMethods = useForm({
    ...(validationsSchema && { validationSchema: validationsSchema })
  });
  const watchedOption = formMethods.watch("options");
  const selectedOption = watchedOption?.id || watchedOption;
  const keys = [...lookup.get(LOOKUP_VALUES, fromJS([])).map(t => t.get("id"))];
  const [items, setItems] = useState(keys);
  const [removed, setRemoved] = useState([]);
  const values = getInitialValues(
    localesKeys,
    dataToJS(lookup.get(LOOKUP_VALUES, fromJS([])))
  );

  const defaultValues = {
    name: getInitialNames(localesKeys, dataToJS(lookup.get(LOOKUP_NAME))),
    options: firstLocaleOption,
    values
  };

  const onSubmit = data => {
    const { name } = data;

    const body = {
      data: {
        name
      }
    };

    dispatch(
      saveLookup({
        id,
        saveMethod: formMode.get("isEdit")
          ? SAVE_METHODS.update
          : SAVE_METHODS.new,
        body,
        message: i18n.t(
          `lookup.messages.${formMode.get("isEdit") ? "updated" : "created"}`
        )
      })
    );
  };

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
  }, [defaultValues.name[defaultLocale]]);

  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "transparent" : "ligthblue"
  });

  const onRemoveValue = item => {
    setRemoved([...removed, item]);
    setItems([...items.filter(key => key !== item)]);
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

  const renderLookupLocalizedName = () =>
    locales.length &&
    locales.map(locale => {
      const show = defaultLocale === locale.id || selectedOption === locale.id;

      return (
        <FormSectionField
          field={FieldRecord({
            display_name:
              defaultLocale === locale.id
                ? i18n.t("lookup.english_label")
                : i18n.t("lookup.translation_label"),
            name: `name.${locale.id}`,
            type: TEXT_FIELD,
            required: true,
            customClass: !show ? css.hideTranslationsFields : null
          })}
          key={`name.${locale.id}`}
        />
      );
    });

  const renderLookupsValues = () => {
    return items
      .filter(item => !removed.includes(item))
      .map((item, index) => {
        return (
          <DraggableRow
            key={item}
            firstLocaleOption={defaultLocale}
            index={index}
            isDragDisabled={!formMode.get("isEdit")}
            localesKeys={localesKeys}
            onRemoveClick={onRemoveValue}
            selectedOption={selectedOption}
            uniqueId={item}
          />
        );
      });
  };

  return (
    <FormContext {...formMethods} formMode={formMode}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <FormSectionField
          field={FieldRecord({
            display_name: i18n.t("lookup.language_label"),
            name: "options",
            type: SELECT_FIELD,
            option_strings_text: locales,
            editable: !(locales?.length === 1),
            disabled: locales?.length === 1
          })}
        />
        {renderLookupLocalizedName()}
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
                    <HeaderValues
                      hideTranslationColumn={defaultLocale === selectedOption}
                    />
                    {renderLookupsValues()}
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
