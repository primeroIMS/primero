import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FormContext, useForm } from "react-hook-form";
import isEqual from "lodash/isEqual";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import SearchIcon from "@material-ui/icons/Search";
import makeStyles from "@material-ui/core/styles/makeStyles";

import Permission from "../../../../application/permission";
import { RESOURCES, SHOW_FIND_MATCH } from "../../../../../libs/permissions";
import { useI18n } from "../../../../i18n";
import ActionButton from "../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../action-button/constants";
import { whichFormMode } from "../../../../form";
import { MODES } from "../../../../../config";
import FormSection from "../../../../form/components/form-section";
import SubformDrawer from "../subform-drawer";

import { NAME } from "./constants";
import styles from "./styles.css";

const Component = ({ openDrawer, formSection, handleClose, initialValues }) => {
  const [open, setOpen] = useState(openDrawer);
  const methods = useForm({ defaultValues: initialValues || {} });
  const formMode = whichFormMode(MODES.show);
  const i18n = useI18n();
  const css = makeStyles(styles)();

  useEffect(() => {
    if (openDrawer !== open) {
      setOpen(openDrawer);
    }
  }, [openDrawer]);

  useEffect(() => {
    const currentValues = methods.getValues();

    if (!isEqual(currentValues, initialValues)) {
      methods.reset(initialValues);
    }
  }, [initialValues]);

  return (
    <SubformDrawer title="Traces" open={open} cancelHandler={handleClose}>
      <div className={css.buttonsRow}>
        <ActionButton
          icon={<ArrowBackIosIcon />}
          text={i18n.t("tracing_request.back_to_traces")}
          type={ACTION_BUTTON_TYPES.default}
          outlined
          rest={{
            onClick: handleClose
          }}
        />
        <Permission resources={RESOURCES.tracing_requests} actions={SHOW_FIND_MATCH}>
          <ActionButton
            icon={<SearchIcon />}
            text={i18n.t("tracing_request.find_match")}
            type={ACTION_BUTTON_TYPES.default}
            rest={{
              onClick: handleClose
            }}
          />
        </Permission>
      </div>
      <FormContext {...methods} formMode={formMode}>
        <FormSection formSection={formSection} showTitle={false} disableUnderline />
      </FormContext>
    </SubformDrawer>
  );
};

Component.propTypes = {
  formSection: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  openDrawer: PropTypes.bool
};

Component.displayName = NAME;

export default Component;
