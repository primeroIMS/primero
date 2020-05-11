/* eslint-disable react/no-multi-comp */
import React from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { makeStyles } from "@material-ui/core";

import { compare } from "../../../../../../libs";
import { useI18n } from "../../../../../i18n";
import { getListStyle } from "../../../forms-list/utils";
import FieldListItem from "../field-list-item";
import { getSelectedFields } from "../../selectors";

import { NAME } from "./constants";
import styles from "./styles.css";

const Component = () => {
  const fields = useSelector(state => getSelectedFields(state), compare);
  const css = makeStyles(styles)();
  const i18n = useI18n();

  // TODO: Handle sorting logic once endpoint available.
  const handleDragEnd = result => {
    // eslint-disable-next-line no-console
    console.error(result);
  };

  const renderFields = () =>
    fields.map((field, index) => (
      <FieldListItem field={field} index={index} key={field.get("name")} />
    ));

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable" type="field">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            <div className={css.fieldRow}>
              <div
                className={clsx([
                  css.fieldColumn,
                  css.fieldName,
                  css.fieldHeader
                ])}
              >
                {i18n.t("fields.name")}
              </div>
              <div className={clsx([css.fieldColumn, css.fieldHeader])}>
                {i18n.t("fields.type")}
              </div>
              <div
                className={clsx([
                  css.fieldColumn,
                  css.fieldHeader,
                  css.fieldShow
                ])}
              >
                {i18n.t("fields.show")}
              </div>
            </div>
            {renderFields()}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

Component.displayName = NAME;

export default Component;
