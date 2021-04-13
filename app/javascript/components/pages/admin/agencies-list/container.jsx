import { useDispatch } from "react-redux";
import { fromJS } from "immutable";
import { Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";

import { useI18n } from "../../../i18n";
import IndexTable from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import { ROUTES } from "../../../../config";
import { usePermissions, getListHeaders } from "../../../user";
import { CREATE_RECORDS, RESOURCES } from "../../../../libs/permissions";
import { headersToColumns } from "../utils";
import { FormFilters } from "../../../form";
import { getMetadata } from "../../../record-list";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { useMetadata } from "../../../records";
import { useApp } from "../../../application";
import { useMemoizedSelector } from "../../../../libs";

import { fetchAgencies } from "./action-creators";
import { NAME, DISABLED } from "./constants";
import { getFilters } from "./utils";
import NAMESPACE from "./namespace";

const Container = () => {
  const recordType = RESOURCES.agencies;

  const i18n = useI18n();
  const dispatch = useDispatch();
  const { limitedProductionSite } = useApp();
  const canAddAgencies = usePermissions(NAMESPACE, CREATE_RECORDS);

  const metadata = useMemoizedSelector(state => getMetadata(state, recordType));
  const headers = useMemoizedSelector(state => getListHeaders(state, RESOURCES.agencies));

  const defaultFilterFields = fromJS({
    [DISABLED]: ["false"]
  });

  const defaultFilters = metadata.merge(defaultFilterFields);

  const columns = headersToColumns(headers, i18n);

  useMetadata(recordType, metadata, fetchAgencies, "data", { defaultFilterFields });

  const tableOptions = {
    recordType,
    columns,
    options: {
      selectableRows: "none"
    },
    defaultFilters,
    onTableChange: fetchAgencies,
    localizedFields: ["name", "description"],
    bypassInitialFetch: true
  };

  const filterProps = {
    clearFields: [DISABLED],
    filters: getFilters(i18n),
    onSubmit: data => dispatch(fetchAgencies({ data })),
    defaultFilters
  };

  const newAgencyBtn = canAddAgencies ? (
    <ActionButton
      icon={<AddIcon />}
      text={i18n.t("buttons.new")}
      stype={ACTION_BUTTON_TYPES.default}
      rest={{
        to: ROUTES.admin_agencies_new,
        component: Link,
        hide: limitedProductionSite
      }}
    />
  ) : null;

  return (
    <>
      <PageHeading title={i18n.t("agencies.label")}>{newAgencyBtn}</PageHeading>
      <PageContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={9}>
            <IndexTable title={i18n.t("agencies.label")} {...tableOptions} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormFilters {...filterProps} />
          </Grid>
        </Grid>
      </PageContent>
    </>
  );
};

Container.displayName = NAME;

Container.propTypes = {};

export default Container;
