/* eslint-disable react/no-multi-comp */
import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { makeStyles } from "@material-ui/core";

import { useI18n } from "../../../../../i18n";
import { getListStyle } from "../../../forms-list/utils";
import FieldListItem from "../field-list-item";

import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({ fields }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  // TODO: Handle sorting logic once endpoint available.
  const handleDragEnd = result => {
    // eslint-disable-next-line no-console
    console.error(result);
  };

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
            {fields.map((field, index) => (
              <FieldListItem
                field={field}
                index={index}
                key={field.get("name")}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  fields: PropTypes.object.isRequired
};

export default Component;
