import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useForm, FormContext } from "react-hook-form";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { fromJS } from "immutable";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import clsx from "clsx";

import { translateValues, form } from "../../utils";
import { whichFormMode } from "../../../../../form";
import FormSection from "../../../../../form/components/form-section";
import { useI18n } from "../../../../../i18n";
import { DragIndicator } from "../../../forms/forms-list/components";

import { NAME } from "./constants";
import styles from "./styles.css";

const Container = ({ mode, lookup }) => {
  const i18n = useI18n();
  const css = makeStyles(styles)();
  const formMode = whichFormMode(mode);
  const options = i18n.applicationLocales.toJS();
  const firstOption = options?.[0];
  const defaultLocale = firstOption?.id;
  const initialValues = {
    options: firstOption,
    name: lookup.getIn(["name", defaultLocale]),
    translated_name: ""
  };
  const formMethods = useForm();
  const watchedOption = formMethods.watch("options");
  const selectedOption = watchedOption?.id || watchedOption;
  const isFirstOptionSelected = selectedOption === firstOption?.id;

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

  const translatedDefaultOptions = translatedLookupsValues(defaultLocale);
  let translatedOptions = [];

  if (isFirstOptionSelected) {
    setTranslatedName("");
    translatedOptions = translatedLookupsValues("");
  } else if (watchedOption) {
    setTranslatedName(selectedOption);
    translatedOptions = translatedLookupsValues(selectedOption);
  }

  useEffect(() => {
    formMethods.reset(initialValues);
  }, [initialValues.name]);

  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "transparent"
  });

  const hiddenTranslation = isFirstOptionSelected
    ? css.hideTranslationsFields
    : null;

  // TODO: Split component
  return (
    <FormContext {...formMethods} formMode={formMode}>
      <form noValidate>
        {form(i18n, options, hiddenTranslation).map(formSection => (
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
                      <div />
                      <div>English Text</div>
                      <div className={hiddenTranslation}>Translation Text</div>
                    </div>
                    {translatedDefaultOptions.map((item, index) => {
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
                              <div>
                                <DragIndicator {...provided.dragHandleProps} />
                              </div>
                              <div>{item.display_text}</div>
                              <div>
                                {
                                  translatedOptions?.find(
                                    to => to.id === item.id
                                  )?.display_text
                                }
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
          {/* TODO: Remove when ready to review */}
          <Grid hidden item xs={5}>
            <ul>
              {translatedDefaultOptions.map(item => {
                return (
                  <li>
                    <pre>{JSON.stringify(item)}</pre>
                  </li>
                );
              })}
            </ul>
          </Grid>
          <Grid hidden item xs={5}>
            <ul>
              {translatedOptions.map(item => {
                return (
                  <li>
                    <pre>{JSON.stringify(item)}</pre>
                  </li>
                );
              })}
            </ul>
          </Grid>
          <br />
        </Grid>
      </form>
    </FormContext>
  );
};

Container.displayName = NAME;

Container.propTypes = {
  lookup: PropTypes.object,
  mode: PropTypes.string
};

export default Container;
