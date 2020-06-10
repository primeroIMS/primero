/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { useEffect } from "react";
import PropTypes from "prop-types";
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
import { getFieldsAttribute } from "../utils";

import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({ subformField }) => {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const isNested = Boolean(subformField?.size);
  const fields = useSelector(
    state => getSelectedFields(state, isNested),
    compare
  );
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const fieldsAttribute = getFieldsAttribute(isNested);

  useEffect(() => {
    fields.forEach(field => {
      const name = field.get("name");

      if (!methods.control[`${fieldsAttribute}.${name}.order`]) {
        methods.register({ name: `${fieldsAttribute}.${name}.order` });
      }

      methods.setValue(`${fieldsAttribute}.${name}.order`, field.get("order"));
    });
  }, [fields]);

  const handleDragEnd = result => {
    dispatch(
      reorderFields(result.draggableId, result.destination.index, isNested)
    );
  };

  const renderFields = () =>
    fields.map((field, index) => (
      <FieldListItem
        subformField={subformField}
        field={field}
        index={index}
        key={field.get("name")}
      />
    ));

  const renderColumn = text =>
    isNested && (
      <div className={clsx([css.fieldColumn, css.fieldHeader])}>{text}</div>
    );

  return (
    <>
      <div className={css.tabContent}>
        <h1>{i18n.t("forms.fields")}</h1>
      </div>
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
                {renderColumn(i18n.t("fields.subform_sort_by"))}
                {renderColumn(i18n.t("fields.subform_group_by"))}
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
    </>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  subformField: PropTypes.object
};

export default Component;
