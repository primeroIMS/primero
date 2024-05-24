// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";

import { useI18n } from "../../../i18n";
import ActionDialog from "../../../action-dialog";
import DialogTabs from "../dialog-tabs";
import { NAME as FORM_ID } from "../flag-form/constants";

import { NAME } from "./constants";

const Component = ({ dialogOpen, fetchAction, fetchArgs, children, isBulkFlags, tab, setTab }) => {
  const i18n = useI18n();

  return (
    <ActionDialog
      open={dialogOpen}
      disableBackdropClick
      dialogTitle={i18n.t("flags.title")}
      disableActions={tab === 0}
      fetchAction={fetchAction}
      fetchArgs={fetchArgs}
      fetchLoadingPath={["records", "flags", "loading"]}
      confirmButtonProps={{
        form: FORM_ID,
        type: "submit"
      }}
      confirmButtonLabel={i18n.t("buttons.save")}
    >
      <DialogTabs isBulkFlags={isBulkFlags} tab={tab} setTab={setTab}>
        {children}
      </DialogTabs>
    </ActionDialog>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  children: PropTypes.node.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  fetchAction: PropTypes.func,
  fetchArgs: PropTypes.array,
  isBulkFlags: PropTypes.bool.isRequired,
  setTab: PropTypes.func,
  tab: PropTypes.number
};

export default Component;
