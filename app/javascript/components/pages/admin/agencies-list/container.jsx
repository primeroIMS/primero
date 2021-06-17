import { useEffect } from "react";
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
import { filterOnTableChange, headersToColumns, onSubmitFilters } from "../utils";
import { FiltersForm } from "../../../form-filters/components";
import { getAppliedFilters, getMetadata } from "../../../record-list";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { useMetadata } from "../../../records";
import { useApp } from "../../../application";
import { useMemoizedSelector } from "../../../../libs";
import { DEFAULT_FILTERS, DATA } from "../constants";

import { fetchAgencies, setAgenciesFilter } from "./action-creators";
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
  const currentFilters = useMemoizedSelector(state => getAppliedFilters(state, recordType));

  const defaultFilters = fromJS(DEFAULT_FILTERS).merge(metadata).set("locale", i18n.locale);

  const columns = headersToColumns(headers, i18n);

  useMetadata(recordType, metadata, fetchAgencies, DATA, {
    defaultFilterFields: { ...DEFAULT_FILTERS, locale: i18n.locale }
  });

  const onTableChange = filterOnTableChange(dispatch, fetchAgencies, setAgenciesFilter);

  const tableOptions = {
    recordType,
    columns,
    options: {
      selectableRows: "none"
    },
    defaultFilters,
    onTableChange,
    localizedFields: ["name", "description"],
    bypassInitialFetch: true
  };

  const onSubmit = data =>
    onSubmitFilters(
      currentFilters.merge(fromJS(data || DEFAULT_FILTERS)).set("locale", i18n.locale),
      dispatch,
      fetchAgencies,
      setAgenciesFilter
    );

  const filterProps = {
    clearFields: [DISABLED],
    filters: getFilters(i18n),
    onSubmit,
    defaultFilters,
    initialFilters: DEFAULT_FILTERS
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

  useEffect(() => {
    dispatch(setAgenciesFilter({ data: defaultFilters }));
  }, []);

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
