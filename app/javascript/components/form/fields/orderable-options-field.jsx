// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

/* eslint-disable react/no-multi-comp */
import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { useFieldArray, useWatch } from "react-hook-form";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import isNil from "lodash/isNil";

import { useI18n } from "../../i18n";
import { getListStyle } from "../../pages/admin/forms-list/utils";
import OrderableOptionList from "../components/orderable-option-list";
import OrderableOptionButtons from "../components/orderable-option-buttons";
import { generateIdForNewOption } from "../utils/handle-options";

import { ORDERABLE_OPTIONS_FIELD_NAME } from "./constants";
import css from "./styles.css";

const OrderableOptionsField = ({ commonInputProps, metaInputProps, showActionButtons, formMethods, formMode }) => {
  const i18n = useI18n();
  const [disabledAddAction, setDisabledAddAction] = useState(false);

  const { name } = commonInputProps;
  const { selectedValue, showDefaultAction, showDeleteAction, showDisableOption, maxOptionsAllowed, optionFieldName } =
    metaInputProps;
  const fieldName = name.split(".")[0];
  const { control, setValue } = formMethods;

  const watchSelectedValue = useWatch({ control, name: `${fieldName}.selected_value`, selectedValue });

  const { fields, append, remove, move } = useFieldArray({ control, name, keyName: "fieldID" });

  const handleDragEnd = useCallback(({ source, destination }) => {
    if (destination) {
      move(source.index, destination.index);
    }
  }, []);

  const onClearDefault = useCallback(() => {
    setValue(`${fieldName}.selected_value`, "", { shouldDirty: true });
  }, [fieldName]);

  const onAddOption = useCallback(() => {
    append({ id: generateIdForNewOption(), isNew: true, display_text: { en: "" }, disabled: true });
  }, []);

  const onRemoveValue = useCallback(index => {
    remove(index);
  }, []);

  const lastColumnTitle = formMode.get("isNew") ? i18n.t("fields.remove") : i18n.t("fields.enabled");
  const renderLastColumn = (formMode.get("isNew") && showDeleteAction) || showDisableOption;
  const classes = [css.fieldColumn, css.fieldHeader];
  const fieldHeaderClasses = clsx([...classes, css.fieldInput]);
  const fieldRowClasses = clsx(classes);

  useEffect(() => {
    if (!isNil(maxOptionsAllowed) && fields.length >= maxOptionsAllowed && !disabledAddAction) {
      setDisabledAddAction(true);
    } else if (disabledAddAction) {
      setDisabledAddAction(false);
    }
  }, [fields.length]);

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable" type="option">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
              <div className={css.fieldHeaderRow}>
                <div className={fieldHeaderClasses}>{i18n.t("fields.english_text")}</div>
                {showDefaultAction && <div className={fieldRowClasses}>{i18n.t("fields.default")}</div>}
                {renderLastColumn && <div className={fieldRowClasses}>{lastColumnTitle}</div>}
              </div>
              <OrderableOptionList
                defaultOptionId={watchSelectedValue}
                fieldName={fieldName}
                fields={fields}
                formMethods={formMethods}
                formMode={formMode}
                onRemoveValue={onRemoveValue}
                optionFieldName={optionFieldName}
                showDefaultAction={showDefaultAction}
                showDeleteAction={showDeleteAction}
                showDisableOption={showDisableOption}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {showActionButtons && (
        <OrderableOptionButtons
          disabledAddAction={disabledAddAction}
          onAddOption={onAddOption}
          onClearDefault={onClearDefault}
          showDefaultAction={showDefaultAction}
        />
      )}
    </div>
  );
};

OrderableOptionsField.displayName = ORDERABLE_OPTIONS_FIELD_NAME;

OrderableOptionsField.defaultProps = {
  showActionButtons: true
};

OrderableOptionsField.propTypes = {
  commonInputProps: PropTypes.shape({
    disabled: PropTypes.bool,
    helperText: PropTypes.string,
    name: PropTypes.string.isRequired
  }),
  formMethods: PropTypes.object.isRequired,
  formMode: PropTypes.object.isRequired,
  metaInputProps: PropTypes.object,
  showActionButtons: PropTypes.bool
};

export default OrderableOptionsField;
