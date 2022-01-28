/* eslint-disable react/no-multi-comp */
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { useFieldArray, useWatch } from "react-hook-form";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import isNil from "lodash/isNil";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";

import { useI18n } from "../../i18n";
import { getListStyle } from "../../pages/admin/forms-list/utils";
import DraggableOption from "../components/draggable-option";
import { generateIdForNewOption } from "../utils/handle-options";
import ActionButton from "../../action-button";
import { ACTION_BUTTON_TYPES } from "../../action-button/constants";

import { ORDERABLE_OPTIONS_FIELD_NAME } from "./constants";
import css from "./styles.css";

const OrderableOptionsField = ({ commonInputProps, metaInputProps, showActionButtons, formMethods, formMode }) => {
  const i18n = useI18n();
  const [disabledAddAction, setDisabledAddAction] = useState(false);

  const { name } = commonInputProps;
  const {
    selectedValue,
    showDefaultAction,
    showDeleteAction,
    showDisableOption,
    maxOptionsAllowed,
    optionFieldName
  } = metaInputProps;
  const fieldName = name.split(".")[0];
  const { control, setValue } = formMethods;

  const watchSelectedValue = useWatch({ control, name: `${fieldName}.selected_value`, selectedValue });

  const { fields, append, remove, move } = useFieldArray({ control, name, keyName: "fieldID" });

  const handleDragEnd = ({ source, destination }) => {
    if (destination) {
      move(source.index, destination.index);
    }
  };

  const onClearDefault = () => {
    setValue(`${fieldName}.selected_value`, "", { shouldDirty: true });
  };

  const onAddOption = () => {
    append({ id: generateIdForNewOption(), isNew: true, display_text: { en: "" }, disabled: true });
  };

  const onRemoveValue = index => {
    remove(index);
  };

  const renderOptions = () =>
    fields.map((option, index) => (
      <DraggableOption
        defaultOptionId={watchSelectedValue}
        optionFieldName={optionFieldName || "option_strings_text"}
        name={fieldName}
        option={option}
        index={index}
        key={option.fieldID}
        onRemoveClick={onRemoveValue}
        formMethods={formMethods}
        formMode={formMode}
        showDefaultAction={showDefaultAction}
        showDeleteAction={showDeleteAction}
        showDisableOption={showDisableOption}
      />
    ));

  // eslint-disable-next-line react/display-name
  const renderActionButtons = () =>
    showActionButtons ? (
      <div className={css.optionsFieldActions}>
        <ActionButton
          id="add-another-options"
          icon={<AddIcon />}
          text="buttons.add_another_option"
          type={ACTION_BUTTON_TYPES.default}
          disabled={disabledAddAction}
          rest={{
            onClick: onAddOption
          }}
        />
        {showDefaultAction && (
          <ActionButton
            icon={<CloseIcon />}
            text="buttons.clear_default"
            type={ACTION_BUTTON_TYPES.default}
            cancel
            rest={{
              onClick: onClearDefault
            }}
          />
        )}
      </div>
    ) : null;

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
              {renderOptions()}
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
