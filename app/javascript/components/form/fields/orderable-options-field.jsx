/* eslint-disable react/no-multi-comp */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { useFormContext } from "react-hook-form";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";

import { useI18n } from "../../i18n";
import { getListStyle } from "../../pages/admin/forms-list/utils";
import DraggableOption from "../components/draggable-option";
import { generateIdForNewOption, mergeOptions } from "../utils/handle-options";
import ActionButton from "../../action-button";
import { ACTION_BUTTON_TYPES } from "../../action-button/constants";

import { ORDERABLE_OPTIONS_FIELD_NAME } from "./constants";
import styles from "./styles.css";

const OrderableOptionsField = ({ commonInputProps, metaInputProps, options, showActionButtons }) => {
  const i18n = useI18n();
  const [fieldOptions, setFieldOptions] = useState(options);
  const [removed, setRemoved] = useState([]);
  const css = makeStyles(styles)();
  const { name } = commonInputProps;
  const { selectedValue } = metaInputProps;
  const fieldName = name.split(".")[0];
  const { control, getValues, register, reset, setValue, unregister, watch, formMode } = useFormContext();

  const watchSelectedValue = watch(`${fieldName}.selected_value`, selectedValue);

  useEffect(() => {
    fieldOptions.forEach((option, index) => {
      register(`${fieldName}.option_strings_text.en[${index}].id`);
      setValue(`${fieldName}.option_strings_text.en[${index}].id`, option.id);
    });

    return () => {
      fieldOptions.forEach((option, index) => {
        unregister(`${fieldName}.option_strings_text.en[${index}].id`);
      });
    };
  }, [register]);

  useEffect(() => {
    reset(
      {
        [fieldName]: {
          option_strings_text: {
            en: [...fieldOptions]
          }
        }
      },
      {
        errors: true,
        dirtyFields: true,
        dirty: true,
        touched: true
      }
    );

    setValue(`${fieldName}.selected_value`, watchSelectedValue);
  }, [fieldOptions]);

  const handleDragEnd = result => {
    if (result && result.source && result.destination) {
      const currentOptionValues = getValues({ nest: true })[fieldName].option_strings_text?.en;
      const reorderedOptions = mergeOptions(fieldOptions, currentOptionValues);
      const sourceIndex = result.source.index;
      const targetIndex = result.destination.index;
      const sourceOption = reorderedOptions.splice(sourceIndex, 1)[0];

      reorderedOptions.splice(targetIndex, 0, sourceOption);

      reorderedOptions.forEach((option, index) => {
        if (!control.fields[`${fieldName}.option_strings_text.en[${index}].id`]) {
          register(`${fieldName}.option_strings_text.en[${index}].id`);
        }
        setValue(`${fieldName}.option_strings_text.en[${index}].id`, option.id);
      });

      setFieldOptions([...reorderedOptions]);
    }
  };

  const onClearDefault = () => {
    setValue(`${fieldName}.selected_value`, "");
  };

  const onAddOption = () => {
    const currentOptionValues = getValues({ nest: true })[fieldName].option_strings_text?.en;
    const reorderedOptions = mergeOptions(fieldOptions, currentOptionValues);

    setFieldOptions(
      reorderedOptions.concat({
        id: generateIdForNewOption(),
        isNew: true,
        display_text: ""
      })
    );
  };
  const onRemoveValue = item => {
    const currentOptionValues = getValues({ nest: true })[fieldName].option_strings_text?.en;

    setRemoved([...removed, item]);
    setFieldOptions([...currentOptionValues.filter(key => key.id !== item)]);
  };

  const renderOptions = () =>
    fieldOptions.map((option, index) => (
      <DraggableOption
        defaultOptionId={watchSelectedValue}
        name={fieldName}
        option={option}
        index={index}
        key={option.id}
        onRemoveClick={onRemoveValue}
      />
    ));

  // eslint-disable-next-line react/display-name
  const renderActionButtons = () =>
    showActionButtons ? (
      <div className={css.optionsFieldActions}>
        <ActionButton
          icon={<AddIcon />}
          text={i18n.t("buttons.add_another_option")}
          type={ACTION_BUTTON_TYPES.default}
          rest={{
            "aria-label": i18n.t("buttons.add_another_option"),
            onClick: onAddOption
          }}
        />
        <ActionButton
          icon={<CloseIcon />}
          text={i18n.t("buttons.clear_default")}
          type={ACTION_BUTTON_TYPES.default}
          isCancel
          rest={{
            "aria-label": i18n.t("buttons.clear_default"),
            onClick: onClearDefault
          }}
        />
      </div>
    ) : null;

  const renderLastColumn = formMode.get("isNew") ? i18n.t("fields.remove") : i18n.t("fields.enabled");

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable" type="option">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
              <div className={css.fieldHeaderRow}>
                <div className={clsx([css.fieldColumn, css.fieldInput, css.fieldHeader])}>
                  {i18n.t("fields.english_text")}
                </div>
                <div className={clsx([css.fieldColumn, css.fieldHeader])}>{i18n.t("fields.default")}</div>
                <div className={clsx([css.fieldColumn, css.fieldHeader])}>{renderLastColumn}</div>
              </div>
              {renderOptions(fieldOptions)}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {renderActionButtons()}
    </div>
  );
};

OrderableOptionsField.displayName = ORDERABLE_OPTIONS_FIELD_NAME;

OrderableOptionsField.defaultProps = {
  options: [],
  showActionButtons: true
};

OrderableOptionsField.propTypes = {
  commonInputProps: PropTypes.shape({
    disabled: PropTypes.bool,
    helperText: PropTypes.string,
    name: PropTypes.string.isRequired
  }),
  metaInputProps: PropTypes.object,
  options: PropTypes.array,
  showActionButtons: PropTypes.bool
};

export default OrderableOptionsField;
