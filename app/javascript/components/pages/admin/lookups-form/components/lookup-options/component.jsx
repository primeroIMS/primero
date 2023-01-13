import PropTypes from "prop-types";
import { Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { useI18n } from "../../../../../i18n";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../../../../action-button";
import { TEMP_OPTION_ID } from "../form/constants";
import HeaderValues from "../header-values";
import DraggableRow from "../draggable-row";

import css from "./styles.css";

function Component({
  defaultLocale,
  formMethods,
  formMode,
  items,
  localesKeys,
  reorderValues,
  selectedOption,
  setItems,
  values
}) {
  const i18n = useI18n();
  const { getValues, reset } = formMethods;

  const optionsLabelText =
    formMode.get("isNew") && items.length <= 0 ? i18n.t("lookup.no_options") : i18n.t("lookup.values");

  const gridClassName = formMode.get("isShow") ? css.showColor : "";

  const handleAdd = () => setItems([...items, `${TEMP_OPTION_ID}_${items.length}`]);

  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "transparent" : "ligthblue"
  });

  const onDragEnd = result => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }
    const { index: startIndex } = source;
    const { index: endIndex } = destination;

    const newItems = reorderValues(items, startIndex, endIndex);

    setItems(newItems);
    const newValues = getValues();

    reset({ ...newValues, ...{ values } });
  };

  return (
    <Grid container spacing={1}>
      <div className={css.optionsContainer}>
        <span className={css.optionsLabel}>{optionsLabelText}</span>
        {!formMode.get("isShow") && (
          <ActionButton
            icon={<AddIcon />}
            text="fields.add"
            type={ACTION_BUTTON_TYPES.default}
            rest={{
              onClick: handleAdd
            }}
          />
        )}
      </div>
      {items.length > 0 && (
        <Grid item xs={12} className={gridClassName}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppableLookup" type="lookupGroup">
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                  <HeaderValues hideTranslationColumn={defaultLocale === selectedOption} />
                  {items.map((item, index) => (
                    <DraggableRow
                      key={item}
                      firstLocaleOption={defaultLocale}
                      index={index}
                      isDragDisabled={!formMode.get("isEdit")}
                      localesKeys={localesKeys}
                      selectedOption={selectedOption}
                      uniqueId={item}
                      formMode={formMode}
                      formMethods={formMethods}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Grid>
      )}
    </Grid>
  );
}

Component.displayName = "LookupOptions";

Component.propTypes = {
  defaultLocale: PropTypes.string,
  formMethods: PropTypes.object,
  formMode: PropTypes.object,
  items: PropTypes.array,
  localesKeys: PropTypes.array,
  reorderValues: PropTypes.func,
  selectedOption: PropTypes.string,
  setItems: PropTypes.func,
  values: PropTypes.object
};

export default Component;
