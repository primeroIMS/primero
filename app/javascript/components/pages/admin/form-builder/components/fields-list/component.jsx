// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/no-multi-comp, react/display-name */
import { useCallback, useEffect } from "react";
import { hash } from "immutable";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { getObjectPath, useMemoizedSelector } from "../../../../../../libs";
import { useI18n } from "../../../../../i18n";
import { getListStyle } from "../../../forms-list/utils";
import { reorderFields } from "../../action-creators";
import { getCopiedFields, getRemovedFields, getSelectedFields } from "../../selectors";
import { getFieldsAttribute, setFieldDataInFormContext } from "../utils";
import Fields from "../fields";
import FieldListHeaders from "../field-list-headers";

import css from "./styles.css";
import { NAME } from "./constants";

const Component = ({ formMethods, subformField, subformSortBy, subformGroupBy }) => {
  const dispatch = useDispatch();
  const isNested = Boolean(subformField?.size || subformField?.toSeq()?.size);

  const fields = useMemoizedSelector(state => getSelectedFields(state, isNested));
  const copiedFields = useMemoizedSelector(state => getCopiedFields(state));
  const removedFields = useMemoizedSelector(state => getRemovedFields(state));

  const i18n = useI18n();
  const fieldsAttribute = getFieldsAttribute(isNested);
  const {
    register,
    setValue,
    unregister,
    control: {
      fieldsRef: { current: formContextFields }
    }
  } = formMethods;

  useEffect(() => {
    fields.forEach(field => {
      const name = field.get("name");

      if (!formContextFields[`${fieldsAttribute}.${name}.order`]) {
        register({ name: `${fieldsAttribute}.${name}.order` });
      }

      if (!formContextFields[`${fieldsAttribute}.${name}.display_conditions_record`]) {
        register({ name: `${fieldsAttribute}.${name}.display_conditions_record` });
      }

      setValue(`${fieldsAttribute}.${name}.order`, field.get("order"), { shouldDirty: true });

      i18n.applicationLocales.forEach(locale => {
        const localeId = locale.id;
        const localizedDisplayName = field.getIn(["display_name", localeId], "");
        const localizedFieldName = `${fieldsAttribute}.${name}.display_name.${localeId}`;

        if (!formContextFields[localizedFieldName]) {
          register({ name: localizedFieldName });
        }

        setValue(localizedFieldName, localizedDisplayName, { shouldDirty: true });
      });
    });

    if (!fields?.toSeq()?.size) {
      register({ name: fieldsAttribute });
      setValue(fieldsAttribute, [], { shouldDirty: true });
    }
  }, [hash(fields)]);

  useEffect(() => {
    copiedFields.forEach(field => {
      setFieldDataInFormContext({
        name: field.get("name"),
        data: field.toJS(),
        fieldsPath: fieldsAttribute,
        contextFields: formContextFields,
        register,
        setValue
      });
    });
  }, [copiedFields]);

  useEffect(() => {
    removedFields.forEach(field => {
      const fieldName = field.get("name");

      getObjectPath("", field.toJS()).forEach(path => {
        unregister(`${fieldsAttribute}.${fieldName}.${path}`);
      });
    });
  }, [removedFields]);

  const handleDragEnd = useCallback(
    result => {
      dispatch(reorderFields(result.draggableId, result.destination.index, isNested));
    },
    [isNested]
  );

  if (!fields.size) {
    return <div className={css.noFiltersAdded}>{i18n.t("forms.no_subform_filters_added")}</div>;
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable" type="field">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
              <div className={css.fieldRow}>
                <FieldListHeaders isNested={isNested} />
              </div>
              <Fields
                fields={fields}
                formMethods={formMethods}
                subformField={subformField}
                subformGroupBy={subformGroupBy}
                subformSortBy={subformSortBy}
              />
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
  formMethods: PropTypes.object.isRequired,
  subformField: PropTypes.object,
  subformGroupBy: PropTypes.string,
  subformSortBy: PropTypes.string
};

export default Component;
