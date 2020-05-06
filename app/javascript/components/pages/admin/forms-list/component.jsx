import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { useLocation } from "react-router-dom";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import LoadingIndicator from "../../../loading-indicator";
import { useI18n } from "../../../i18n";
import { useApp } from "../../../application";
import { PageHeading, PageContent } from "../../../page";
import { MODULES, RECORD_TYPES } from "../../../../config/constants";
import { usePermissions } from "../../../user";
import { CREATE_RECORDS, RESOURCES } from "../../../../libs/permissions";
import { FormAction } from "../../../form";

import NAMESPACE from "./namespace";
import { FormGroup, FormSection, FormFilters } from "./components";
import { fetchForms } from "./action-creators";
import { getFormSections, getIsLoading } from "./selectors";
import { getListStyle } from "./utils";
import styles from "./styles.css";

const Component = () => {
  const i18n = useI18n();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const css = makeStyles(styles)();
  const defaultFilterValues = {
    recordType: RECORD_TYPES.cases,
    primeroModule: MODULES.CP
  };
  const [filterValues, setFilterValues] = useState(defaultFilterValues);
  const isLoading = useSelector(state => getIsLoading(state));
  const formSectionsByGroup = useSelector(state =>
    getFormSections(state, filterValues)
  );
  const { modules } = useApp();

  const handleSetFilterValue = (name, value) => {
    setFilterValues({ ...filterValues, ...{ [name]: value } });
  };

  const handleClearValue = () => {
    setFilterValues(defaultFilterValues);
  };

  const canAddForms = usePermissions(RESOURCES.metadata, CREATE_RECORDS);

  useEffect(() => {
    dispatch(fetchForms());
  }, []);

  // TODO: Handle sorting logic once endpoint available.
  const handleDragEnd = result => {
    // eslint-disable-next-line no-console
    console.error(result);
  };

  const renderFormSections = () =>
    formSectionsByGroup.map((group, index) => {
      const { form_group_name: formGroupName, form_group_id: formGroupID } =
        group.first() || {};

      return (
        <FormGroup
          name={i18n.getI18nStringFromObject(formGroupName)}
          index={index}
          key={formGroupID}
          id={formGroupID}
        >
          <FormSection group={group} collection={formGroupID} />
        </FormGroup>
      );
    });

  const handleNew = () => {
    dispatch(push(`${pathname}/new`));
  };

  const newFormBtn = canAddForms ? (
    <FormAction
      actionHandler={handleNew}
      text={i18n.t("buttons.add")}
      startIcon={<AddIcon />}
    />
  ) : null;

  return (
    <LoadingIndicator
      hasData={formSectionsByGroup?.size}
      loading={isLoading}
      type={NAMESPACE}
    >
      <PageHeading title={i18n.t("forms.label")}>{newFormBtn}</PageHeading>
      <PageContent>
        <div className={css.indexContainer}>
          <div className={css.forms}>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="droppable" type="formGroup">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {renderFormSections()}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <div className={css.filters}>
            <FormFilters
              filterValues={filterValues}
              modules={modules}
              handleSetFilterValue={handleSetFilterValue}
              handleClearValue={handleClearValue}
            />
          </div>
        </div>
      </PageContent>
    </LoadingIndicator>
  );
};

Component.displayName = "FormList";

export default Component;
