/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */
import { useCallback, useEffect, useState } from "react";
import { List, ListItem, ListItemSecondaryAction, ListItemText } from "@material-ui/core";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import { fromJS } from "immutable";

import SubformDrawer from "../../subforms/subform-drawer";
import Form, { FieldRecord, FormSectionRecord, SELECT_FIELD } from "../../../../form";
import { useI18n } from "../../../../i18n";
import { useMemoizedSelector, useThemeHelper } from "../../../../../libs";
import { getFieldByName } from "../../../selectors";
import { CASE } from "../../../../../config";
import ActionButton, { ACTION_BUTTON_TYPES } from "../../../../action-button";
import css from "../../subforms/styles.css";
import IndexTable from "../../../../index-table";
import LoadingIndicator from "../../../../loading-indicator";

import { fetchFarmerSearchResults } from "./action-creators";
import { getLoading, getMetadata, getRegistrySearchResults } from "./selectors";
// TODO: i18n, endpoints/state,

const LINK_FIELD = "_id"; // 'registry_record_id'
const FORM_ID = "registry-search";

const SearchForm = ({ setComponent, setSearchParams, handleCancel, fields }) => {
  const handleSearch = async data => {
    const { search_by, ...searchParams } = data;

    await setSearchParams(searchParams);
    setComponent(1);
  };

  const searchByField = FieldRecord({
    display_name: "search_by",
    name: "search_by",
    type: SELECT_FIELD,
    option_strings_text: [
      { id: "registry_no", display_text: "Reg" },
      { id: "name", display_text: "Name" }
    ]
  });

  const formFields = [
    FormSectionRecord({
      unique_id: "registry-search",
      fields: [searchByField, ...fields.valueSeq()].map(field => {
        if (["name", "registry_no"].includes(field.name)) {
          return field.merge({
            watchedInputs: "search_by",
            showIf: searchBy => {
              if (field.name === "name") {
                return searchBy === field.name;
              }

              if (field.name === "registry_no") {
                return searchBy === field.name;
              }

              return false;
            }
          });
        }

        return field;
      })
    })
  ];

  return (
    <>
      <div>
        <ActionButton type={ACTION_BUTTON_TYPES.default} text="Back to Case" rest={{ onClick: handleCancel }} />
        <ActionButton type={ACTION_BUTTON_TYPES.default} text="Search" rest={{ form: FORM_ID, type: "submit" }} />
      </div>
      <Form formID={FORM_ID} formSections={formFields} onSubmit={handleSearch} />
    </>
  );
};

const ResultDetails = ({ id }) => {
  return <div>Details</div>;
};

const Results = ({ setComponent, fields, searchParams, recordType }) => {
  const [details, setDetails] = useState(false);

  const isLoading = useMemoizedSelector(state => getLoading(state));
  const results = useMemoizedSelector(state => getRegistrySearchResults(state));
  const metadata = useMemoizedSelector(state => getMetadata(state));

  const handleTableChange = () => {
    return fetchFarmerSearchResults(searchParams);
  };

  const handleRowClick = record => {
    console.log(record);
  };

  const tableOptions = {
    columns: fields.map(field => ({
      name: field.name,
      label: field.name
    })),
    title: "",
    defaultFilters: metadata,
    onTableChange: handleTableChange,
    recordType: "registrySearch",
    bypassInitialFetch: true,
    onRowClick: handleRowClick,
    options: { selectableRows: "none" }
  };

  const handleBack = () => {
    setComponent(0);
  };

  if (details) {
    return <ResultDetails />;
  }

  return (
    <>
      <ActionButton type={ACTION_BUTTON_TYPES.default} text="Back to Search" rest={{ onClick: handleBack }} />
      <div>Results</div>
      <LoadingIndicator hasData={results.size > 0} loading={isLoading} type="registry">
        <IndexTable {...tableOptions} />
      </LoadingIndicator>
    </>
  );
};

const Component = ({ values, mode, record, primeroModule, recordType }) => {
  const i18n = useI18n();
  const { isRTL } = useThemeHelper();

  const [component, setComponent] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({});

  const fields = useMemoizedSelector(state =>
    getFieldByName(state, ["location_current", "name", "registry_no"], primeroModule, CASE)
  );

  const handleCancel = () => {
    setDrawerOpen(false);
  };

  const handleAddNew = () => {
    setDrawerOpen(true);
  };

  const handleOpenMatch = async () => {
    await setComponent(2);
    setDrawerOpen(true);
  };

  const handleSetSearchParams = useCallback(
    params => {
      setSearchParams(params);
    },
    [searchParams]
  );

  const handleSetComponent = useCallback(
    index => {
      setComponent(index);
    },
    [component]
  );

  useEffect(() => {
    if (!drawerOpen) {
      setComponent(0);
    }
  }, [drawerOpen]);

  const title = "Search for Farmer";

  const fieldValue = values[LINK_FIELD];

  const RenderComponents = {
    0: SearchForm,
    1: Results,
    2: ResultDetails
  }[component];

  return (
    <>
      <div className={css.subformFieldArrayContainer}>
        <div>
          <h3 className={css.subformTitle}>Farmer Details</h3>
        </div>
        <div>
          <ActionButton
            type={ACTION_BUTTON_TYPES.default}
            text="Add New"
            disabled={!!fieldValue}
            rest={{ onClick: handleAddNew }}
          />
        </div>
      </div>

      {fieldValue && (
        <List dense classes={{ root: css.list }} disablePadding>
          <ListItem component="a" onClick={handleOpenMatch} classes={{ root: css.listItem }}>
            <ListItemText>{fieldValue}</ListItemText>
            <ListItemSecondaryAction>
              <ActionButton
                icon={isRTL ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                type={ACTION_BUTTON_TYPES.icon}
                rest={{
                  className: css.subformShow,
                  onClick: handleOpenMatch
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      )}

      <SubformDrawer open={drawerOpen} cancelHandler={handleCancel} title={title}>
        <RenderComponents
          setSearchParams={handleSetSearchParams}
          setComponent={handleSetComponent}
          handleCancel={handleCancel}
          fields={fields}
          searchParams={searchParams}
          recordType={recordType}
        />
      </SubformDrawer>
    </>
  );
};

Component.displayName = "CaseRegistry";

export default Component;
