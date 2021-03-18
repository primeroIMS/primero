import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";

import { useI18n } from "../../../i18n";
import IndexTable, { DateCell } from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import { ROUTES } from "../../../../config";
import { MANAGE, RESOURCES } from "../../../../libs/permissions";
import { getMetadata } from "../../../record-list";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { useMetadata } from "../../../records";
import Permission from "../../../application/permission";
import { useMemoizedSelector } from "../../../../libs";

import NAMESPACE from "./namespace";
import { NAME } from "./constants";
import { getColumns } from "./utils";
import { fetchConfigurations } from "./action-creators";

const Container = () => {
  const i18n = useI18n();
  const recordType = ["admin", NAMESPACE];

  const metadata = useMemoizedSelector(state => getMetadata(state, recordType));

  const defaultFilters = metadata;

  const columns = () => {
    return getColumns(i18n).map(column => {
      const options = {
        ...(["created_on", "applied_on"].includes(column.name)
          ? {
              // eslint-disable-next-line react/no-multi-comp, react/display-name
              customBodyRender: value => {
                return value ? <DateCell value={value} withTime /> : null;
              }
            }
          : {})
      };

      return {
        name: column.name,
        label: column.label,
        options
      };
    });
  };

  useMetadata(recordType, metadata, fetchConfigurations, "data");

  const tableOptions = {
    recordType,
    columns,
    options: {
      selectableRows: "none"
    },
    defaultFilters,
    onTableChange: fetchConfigurations,
    targetRecordType: NAMESPACE,
    bypassInitialFetch: true
  };

  const newConfigurationButton = (
    <ActionButton
      icon={<AddIcon />}
      text={i18n.t("buttons.new")}
      type={ACTION_BUTTON_TYPES.default}
      rest={{
        to: ROUTES.admin_configurations_new,
        component: Link
      }}
    />
  );

  return (
    <Permission resources={RESOURCES.configurations} actions={MANAGE} redirect>
      <PageHeading title={i18n.t("configurations.label")}>{newConfigurationButton}</PageHeading>
      <PageContent>
        <IndexTable title={i18n.t("configurations.label")} {...tableOptions} />
      </PageContent>
    </Permission>
  );
};

Container.displayName = NAME;

export default Container;
