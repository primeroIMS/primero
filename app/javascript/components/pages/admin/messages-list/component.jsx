import PageContent from "../../../page/components/page-content";
import PageHeading from "../../../page/components/page-heading";
import Permission, { MANAGE, RESOURCES } from "../../../permissions";
import IndexTable from "../../../index-table";
import { useI18n } from "../../../i18n";
import { default as NAMESPACE } from "./namespace";
import { fetchMessages } from "./action-creators";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../../action-button";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import MessageDialog from "./message-dialog";

function Component() {
  const i18n = useI18n();

  const [open, setOpen] = useState(false);

  const tableOptions = {
    recordType: ["admin", NAMESPACE],
    columns: [
      { name: "created_at", label: i18n.t("messages.attributes.created_at") },
      { name: "body", label: i18n.t("messages.attributes.body") }
    ],
    onTableChange: fetchMessages
  };

  const newMessageButton = (
    <ActionButton
      icon={<AddIcon />}
      text="buttons.new"
      type={ACTION_BUTTON_TYPES.default}
      onClick={() => setOpen(true)}
    />
  );
  return (
    <Permission resources={RESOURCES.metadata} actions={MANAGE} redirect>
      <PageHeading title={i18n.t("settings.navigation.messages")}>{newMessageButton}</PageHeading>
      <MessageDialog open={open} />
      <PageContent>
        <IndexTable title={i18n.t("settings.navigation.messages")} {...tableOptions} />
      </PageContent>
    </Permission>
  );
}

Component.propTypes = {};
Component.displayName = "MessagesList";

export default Component;
