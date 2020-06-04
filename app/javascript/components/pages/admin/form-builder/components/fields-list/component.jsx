/* eslint-disable react/no-multi-comp */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormContext } from "react-hook-form";
import clsx from "clsx";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { makeStyles } from "@material-ui/core";

import { compare } from "../../../../../../libs";
import { useI18n } from "../../../../../i18n";
import { getListStyle } from "../../../forms-list/utils";
import FieldListItem from "../field-list-item";
import { reorderFields } from "../../action-creators";
import { getSelectedFields } from "../../selectors";

import { NAME } from "./constants";
import styles from "./styles.css";

const Component = () => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const fields = useSelector(state => getSelectedFields(state), compare);
  const css = makeStyles(styles)();
  const i18n = useI18n();

  useEffect(() => {
    fields.forEach(field => {
      const name = field.get("name");

      if (!methods.control[`fields.${name}.order`]) {
        methods.register({ name: `fields.${name}.order` });
      }

      methods.setValue(`fields.${name}.order`, field.get("order"));
    });
  }, [fields]);

  const handleDragEnd = result => {
    dispatch(reorderFields(result.draggableId, result.destination.index));
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
