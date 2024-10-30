// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Grid from "@mui/material/Unstable_Grid2";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import { fromJS } from "immutable";

import { useI18n } from "../../../i18n";
import IndexTable from "../../../index-table";
import { PageHeading, PageContent } from "../../../page";
import { ROUTES } from "../../../../config";
import { getListHeaders, useApp } from "../../../application";
import { usePermissions, CREATE_RECORDS, RESOURCES } from "../../../permissions";
import { filterOnTableChange, getFilters, headersToColumns, onSubmitFilters } from "../utils";
import { FiltersForm } from "../../../form-filters/components";
import { getAppliedFilters, getMetadata } from "../../../record-list";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { useMetadata } from "../../../records";
import { useMemoizedSelector } from "../../../../libs";
import { DEFAULT_FILTERS, DATA } from "../constants";

import { fetchAgencies, setAgenciesFilter } from "./action-creators";
import { NAME, DISABLED } from "./constants";
import NAMESPACE from "./namespace";

function Container() {
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
      text="buttons.new"
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
          <Grid item xs={12} sm={8}>
            <IndexTable title={i18n.t("agencies.label")} {...tableOptions} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FiltersForm {...filterProps} noMargin />
          </Grid>
        </Grid>
      </PageContent>
    </>
  );
}

Container.displayName = NAME;

Container.propTypes = {};

export default Container;
