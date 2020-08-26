/* eslint-disable react/no-multi-comp, react/display-name */
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { makeStyles } from "@material-ui/core";
import isEqual from "lodash/isEqual";

import { compare } from "../../../../../../libs";
import { useI18n } from "../../../../../i18n";
import { getListStyle } from "../../../forms-list/utils";
import FieldListItem from "../field-list-item";
import { reorderFields } from "../../action-creators";
import { getSelectedFields } from "../../selectors";
import { getFieldsAttribute } from "../utils";
import CustomFieldDialog from "../custom-field-dialog";

import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({
  formContextFields,
  getValues,
  register,
  setValue,
  subformField,
  subformSortBy,
  subformGroupBy
}) => {
  const dispatch = useDispatch();
  const isNested = Boolean(subformField?.size || subformField?.toSeq()?.size);
  const fields = useSelector(state => getSelectedFields(state, isNested), compare);
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const fieldsAttribute = getFieldsAttribute(isNested);

  useEffect(() => {
    fields.forEach(field => {
      const name = field.get("name");

      if (!formContextFields[`${fieldsAttribute}.${name}.order`]) {
        register({ name: `${fieldsAttribute}.${name}.order` });
      }

      setValue(`${fieldsAttribute}.${name}.order`, field.get("order"));

      i18n.applicationLocales.forEach(locale => {
        const localeId = locale.get("id");
        const localizedDisplayName = field.getIn(["display_name", localeId], "");

        setValue(`${fieldsAttribute}.${name}.display_name.${localeId}`, localizedDisplayName);
      });
    });
  }, [fields]);

  const handleDragEnd = result => {
    dispatch(reorderFields(result.draggableId, result.destination.index, isNested));
  };

  const renderFields = () =>
    fields.map((field, index) => {
      const id = field.get("id") || field.get("subform_section_temp_id");

      return (
        <FieldListItem
          getValues={getValues}
          setValue={setValue}
          subformField={subformField}
          field={field}
          index={index}
          subformSortBy={subformSortBy}
          subformGroupBy={subformGroupBy}
          key={`${field.get("name")}_${id}`}
        />
      );
    });

  const renderColumn = text => isNested && <div className={clsx([css.fieldColumn, css.fieldHeader])}>{text}</div>;

  if (!fields.size) {
    return (
      <div className={css.noFiltersAdded}>
        {i18n.t("forms.no_subform_filters_added")}
        <CustomFieldDialog />
      </div>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable" type="field">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
              <div className={css.fieldRow}>
                <div className={clsx([css.fieldColumn, css.fieldName, css.fieldHeader])}>{i18n.t("fields.name")}</div>
                <div className={clsx([css.fieldColumn, css.fieldHeader])}>{i18n.t("fields.type")}</div>
                {renderColumn(i18n.t("fields.subform_sort_by"))}
                {renderColumn(i18n.t("fields.subform_group_by"))}
                <div className={clsx([css.fieldColumn, css.fieldHeader, css.fieldShow])}>{i18n.t("fields.show")}</div>
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

Component.whyDidYouRender = true;

Component.propTypes = {
  formContextFields: PropTypes.object.isRequired,
  getValues: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  subformField: PropTypes.object,
  subformGroupBy: PropTypes.string,
  subformSortBy: PropTypes.string
};

export default React.memo(Component, (prev, next) => {
  const equalProps =
    isEqual(prev.formContextFields, next.formContextFields) &&
    prev.getValues === next.getValues &&
    prev.register === next.register &&
    prev.setValue === next.setValue &&
    prev.subformSortBy === next.subformSortBy &&
    prev.subformGroupBy === next.subformGroupBy;

  if (prev.subformField) {
    return equalProps && prev.subformField.equals(next.subformField);
  }

  return equalProps;
});
