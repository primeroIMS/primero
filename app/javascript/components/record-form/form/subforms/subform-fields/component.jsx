/* eslint-disable  react/no-array-index-key */
import { useState } from "react";
import PropTypes from "prop-types";
import sortBy from "lodash/sortBy";
import isEmpty from "lodash/isEmpty";
import omit from "lodash/omit";
import DeleteIcon from "@material-ui/icons/Delete";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import makeStyles from "@material-ui/core/styles/makeStyles";

import SubformMenu from "../subform-menu";
import SubformHeader from "../subform-header";
import { SUBFORM_FIELDS } from "../constants";
import { serviceHasReferFields } from "../../utils";
import ActionDialog from "../../../../action-dialog";
import Jewel from "../../../../jewel";
import { useI18n } from "../../../../i18n";
import ActionButton from "../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../action-button/constants";
import { useMemoizedSelector, useThemeHelper } from "../../../../../libs";
import { getValidationErrors } from "../../..";
import styles from "../styles.css";

import { TracingRequestStatus } from "./components";

const useStyles = makeStyles(styles);

const Component = ({
  arrayHelpers,
  field,
  isTracesSubform,
  locale,
  mode,
  setDialogIsNew,
  setOpen,
  values,
  formik,
  parentForm
}) => {
  const i18n = useI18n();
  const css = useStyles();
  const { isRTL } = useThemeHelper();
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const validationErrors = useMemoizedSelector(state => getValidationErrors(state));

  // eslint-disable-next-line camelcase
  const parentFormUniqueId = parentForm?.unique_id || "";

  const {
    subform_sort_by: subformSortBy,
    display_name: displayName,
    name,
    subform_section_id: subformField,
    disabled: isDisabled
  } = field;

  const { subform_prevent_item_removal: subformPreventItemRemoval } = subformField;

  const { isEdit, isNew } = mode;

  const handleDelete = () => {
    const index = selectedIndex;

    if (isEdit || isNew) {
      // eslint-disable-next-line camelcase
      const uniqueId = values?.[index]?.unique_id;

      if (uniqueId) {
        arrayHelpers.replace(index, { _destroy: true, unique_id: uniqueId });
      } else {
        if (formik.values[name].length) {
          formik.setTouched(omit(formik.touched, name));
        }
        arrayHelpers.remove(index);
      }

      setSelectedIndex(null);
    }
  };

  const handleOpenModal = index => {
    setSelectedIndex(index);
    setDeleteModal(true);
  };

  const cancelHandler = () => {
    setDeleteModal(false);
    setSelectedIndex(null);
  };

  const handleEdit = index => () => {
    setDialogIsNew(false);
    setOpen({ open: true, index });
  };

  const hasError = index =>
    Boolean(
      validationErrors?.size &&
        validationErrors
          .find(error => error.get("unique_id") === parentFormUniqueId)
          ?.getIn(["errors", subformField.get("unique_id"), index], false)
    );

  if (values && values.length > 0) {
    let sortedValues = [];

    if (subformSortBy) {
      sortedValues = sortBy(values, v => {
        let criteria;

        if (!Number.isNaN(Date.parse(v[subformSortBy]))) {
          criteria = new Date(v[subformSortBy]);
        } else {
          criteria = subformSortBy;
        }

        return criteria;
      });
    } else {
      sortedValues = values;
    }

    return (
      <>
        {sortedValues.map((sortedValue, index) => {
          if (
            values?.[index]?._destroy ||
            isEmpty(sortedValue) ||
            // eslint-disable-next-line camelcase
            (values?.[index]?._hidden && field?.subform_section_configuration?.display_conditions)
          ) {
            return false;
          }

          return (
            <div key={`${name}-${index}`} className={css.subformFields}>
              <div className={css.subformHeaderBox}>
                <SubformHeader
                  field={field}
                  index={index}
                  displayName={displayName}
                  locale={locale}
                  values={values}
                  onClick={handleEdit(index)}
                />
              </div>
              <div className={css.subformHeaderActions}>
                {isTracesSubform && <TracingRequestStatus values={values[index]} />}
                {hasError(index) && <Jewel isError />}
                {!subformPreventItemRemoval && !isDisabled && !mode.isShow ? (
                  <ActionButton
                    icon={<DeleteIcon />}
                    type={ACTION_BUTTON_TYPES.icon}
                    rest={{
                      onClick: () => handleOpenModal(index)
                    }}
                  />
                ) : null}
                {mode.isShow && serviceHasReferFields(values[index]) ? (
                  <SubformMenu index={index} values={values} />
                ) : null}
                <ActionButton
                  icon={isRTL ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                  type={ACTION_BUTTON_TYPES.icon}
                  rest={{
                    className: css.subformShow,
                    onClick: handleEdit(index)
                  }}
                />
              </div>
            </div>
          );
        })}
        <ActionDialog
          open={deleteModal}
          successHandler={handleDelete}
          cancelHandler={cancelHandler}
          dialogTitle={i18n.t("fields.remove")}
          dialogText={i18n.t("fields.subform_remove_message")}
          confirmButtonLabel={i18n.t("buttons.ok")}
        />
      </>
    );
  }

  return null;
};

Component.displayName = SUBFORM_FIELDS;

Component.propTypes = {
  arrayHelpers: PropTypes.object.isRequired,
  field: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
  isTracesSubform: PropTypes.bool,
  locale: PropTypes.string.isRequired,
  mode: PropTypes.object.isRequired,
  parentForm: PropTypes.object.isRequired,
  setDialogIsNew: PropTypes.func.isRequired,
  setOpen: PropTypes.func.isRequired,
  values: PropTypes.array.isRequired
};

export default Component;
