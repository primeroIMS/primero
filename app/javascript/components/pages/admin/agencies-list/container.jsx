import { useDispatch } from "react-redux";
import { Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import { fromJS } from "immutable";

import { useI18n } from "../../../i18n";
import IndexTable from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import { ROUTES } from "../../../../config";
import { usePermissions, getListHeaders } from "../../../user";
import { CREATE_RECORDS, RESOURCES } from "../../../../libs/permissions";
import { headersToColumns, onSubmitFilters } from "../utils";
import { FiltersForm } from "../../../form-filters/components";
import { getMetadata } from "../../../record-list";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { useMetadata } from "../../../records";
import { useApp } from "../../../application";
import { useMemoizedSelector } from "../../../../libs";
import { DEFAULT_DISABLED_FILTER, DATA } from "../constants";

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

  const defaultFilters = metadata.merge(fromJS(DEFAULT_DISABLED_FILTER));

  const columns = headersToColumns(headers, i18n);

  useMetadata(recordType, metadata, fetchAgencies, DATA, { defaultFilterFields: DEFAULT_DISABLED_FILTER });

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

  const onSubmit = data => onSubmitFilters(data)(dispatch, fetchAgencies);

  const filterProps = {
    clearFields: [DISABLED],
    filters: getFilters(i18n),
    onSubmit,
    defaultFilters,
    initialFilters: DEFAULT_DISABLED_FILTER
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
            <FiltersForm {...filterProps} />
          </Grid>
        </Grid>
      </PageContent>
    </>
  );
};

Container.displayName = NAME;

Container.propTypes = {};

export default Container;
