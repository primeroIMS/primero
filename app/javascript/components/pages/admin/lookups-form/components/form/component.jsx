/* eslint-disable react/display-name, react/no-multi-comp */

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { useForm, useWatch } from "react-hook-form";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { fromJS } from "immutable";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import { yupResolver } from "@hookform/resolvers/yup";
import isEmpty from "lodash/isEmpty";
import find from "lodash/find";
import pull from "lodash/pull";

import {
  buildValues,
  getInitialValues,
  getInitialNames,
  reorderValues,
  validations,
  getDisabledInfo
} from "../../utils";
import { FieldRecord, TEXT_FIELD, SELECT_FIELD, whichFormMode } from "../../../../../form";
import FormSectionField from "../../../../../form/components/form-section-field";
import { useI18n } from "../../../../../i18n";
import { dataToJS } from "../../../../../../libs";
import { LOOKUP_NAME, LOOKUP_VALUES } from "../../constants";
import HeaderValues from "../header-values";
import DraggableRow from "../draggable-row";
import styles from "../styles.css";
import { saveLookup } from "../../action-creators";
import { LOCALE_KEYS, SAVE_METHODS } from "../../../../../../config";
import ActionButton from "../../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../../action-button/constants";

import { NAME, TEMP_OPTION_ID, FORM_ID } from "./constants";

const useStyles = makeStyles(styles);

const Component = ({ mode, lookup }) => {
  const { id } = useParams();
  const i18n = useI18n();
  const dispatch = useDispatch();
  const css = useStyles();
  const formMode = whichFormMode(mode);
  const locales = i18n.applicationLocales;
  const localesKeys = [
    LOCALE_KEYS.en,
    ...pull(
      locales.map(locale => locale.id),
      LOCALE_KEYS.en
    )
  ];
  const firstLocaleOption = find(locales, ["id", LOCALE_KEYS.en]);
  const defaultLocale = LOCALE_KEYS.en;
  const validationsSchema = validations(i18n);
  const currentLookupValues = lookup.get(LOOKUP_VALUES, fromJS([]));

  const formMethods = useForm({
    ...(validationsSchema && { resolver: yupResolver(validationsSchema) }),
    shouldUnregister: false
  });
  const { control, reset, getValues, handleSubmit } = formMethods;

  const watchedOption = useWatch({
    control,
    name: "options"
  });

  const selectedOption = watchedOption?.id || watchedOption;
  const keys = [...currentLookupValues.map(t => t.get("id"))];
  const [items, setItems] = useState(keys);

  const values = getInitialValues(localesKeys, dataToJS(currentLookupValues));

  const defaultValues = {
    name: getInitialNames(localesKeys, dataToJS(lookup.get(LOOKUP_NAME))),
    options: firstLocaleOption,
    disabled: getDisabledInfo(currentLookupValues),
    values
  };

  const onSubmit = data => {
    const { name, values: lookupValues, disabled } = data;

    const body = {
      data: {
        name,
        values: buildValues(lookupValues, i18n.locale, disabled)
      }
    };

    dispatch(
      saveLookup({
        id,
        saveMethod: formMode.get("isEdit") ? SAVE_METHODS.update : SAVE_METHODS.new,
        body,
        message: i18n.t(`lookup.messages.${formMode.get("isEdit") ? "updated" : "created"}`)
      })
    );
  };

  useEffect(() => {
    if (keys.length) {
      setItems(keys);
    }
    reset(defaultValues);
  }, [defaultValues.name[defaultLocale]]);

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

  const handleAdd = () => setItems([...items, `${TEMP_OPTION_ID}_${items.length}`]);

  const renderLookupLocalizedName = () =>
    !isEmpty(localesKeys) &&
    localesKeys.map(localeID => {
      const show = defaultLocale === localeID || selectedOption === localeID;

      return (
        <FormSectionField
          field={FieldRecord({
            display_name:
              defaultLocale === localeID ? i18n.t("lookup.english_label") : i18n.t("lookup.translation_label"),
            name: `name.${localeID}`,
            type: TEXT_FIELD,
            required: true,
            showIf: () => show,
            forceShowIf: true
          })}
          key={`name.${localeID}`}
          formMode={formMode}
          formMethods={formMethods}
        />
      );
    });

  const renderLookupsValues = () => {
    return items.map((item, index) => {
      return (
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
      );
    });
  };

  const renderOptions = () => {
    const renderOptionText = (
      <span className={css.optionsLabel}>
        {formMode.get("isNew") && items.length <= 0 ? i18n.t("lookup.no_options") : i18n.t("lookup.values")}
      </span>
    );
    const renderAddButton = !formMode.get("isShow") && (
      <ActionButton
        icon={<AddIcon />}
        text={i18n.t("fields.add")}
        type={ACTION_BUTTON_TYPES.default}
        rest={{
          onClick: handleAdd
        }}
      />
    );
    const renderValues = items.length > 0 && (
      <Grid item xs={12} className={formMode.get("isShow") ? css.showColor : ""}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppableLookup" type="lookupGroup">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                <HeaderValues hideTranslationColumn={defaultLocale === selectedOption} />
                {renderLookupsValues()}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Grid>
    );

    return (
      <Grid container spacing={1}>
        <div className={css.optionsContainer}>
          {renderOptionText}
          {renderAddButton}
        </div>
        {renderValues}
      </Grid>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={FORM_ID}>
      <FormSectionField
        field={FieldRecord({
          display_name: i18n.t("lookup.language_label"),
          name: "options",
          type: SELECT_FIELD,
          option_strings_text: locales,
          editable: !(locales?.length === 1),
          disabled: locales?.length === 1
        })}
        formMode={formMode}
        formMethods={formMethods}
      />
      {renderLookupLocalizedName()}
      {renderOptions()}
    </form>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  lookup: PropTypes.object,
  mode: PropTypes.string
};

export default Component;
