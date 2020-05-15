import React, { useEffect, useState } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { useLocation } from "react-router-dom";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { makeStyles, Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ListIcon from "@material-ui/icons/List";

import LoadingIndicator from "../../../loading-indicator";
import { useI18n } from "../../../i18n";
import { useApp } from "../../../application";
import { PageHeading, PageContent } from "../../../page";
import { MODULES, RECORD_TYPES } from "../../../../config/constants";
import { usePermissions } from "../../../user";
import { CREATE_RECORDS, RESOURCES } from "../../../../libs/permissions";
import { FormAction } from "../../../form";

import NAMESPACE from "./namespace";
import {
  FormGroup,
  FormSection,
  FormFilters,
  ReorderActions
} from "./components";
import {
  clearFormsReorder,
  enableReorder,
  fetchForms,
  reorderFormGroups,
  reorderFormSections,
  reorderedForms,
  saveFormsReorder
} from "./action-creators";
import {
  getFormSectionsByFormGroup,
  getIsLoading,
  getReorderEnabled
} from "./selectors";
import { getListStyle } from "./utils";
import { NAME, FORM_GROUP_PREFIX, ORDER_TYPE } from "./constants";
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
  const isReorderEnabled = useSelector(state => getReorderEnabled(state));
  const formSectionsByGroup = useSelector(state =>
    getFormSectionsByFormGroup(state, filterValues)
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
    batch(() => {
      dispatch(clearFormsReorder());
      dispatch(fetchForms());
    });
  }, []);

  const handleDragEnd = result => {
    if (result.destination) {
      const order = result.destination.index * 10;

      if (result.type === ORDER_TYPE.formSection) {
        dispatch(reorderFormSections(result.draggableId, order, filterValues));
      }

      if (result.type === ORDER_TYPE.formGroup) {
        dispatch(
          reorderFormGroups(
            result.draggableId.replace(FORM_GROUP_PREFIX, ""),
            order,
            filterValues
          )
        );
      }
    }
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
          isDragDisabled={!isReorderEnabled}
        >
          <FormSection
            group={group}
            collection={formGroupID}
            isDragDisabled={!isReorderEnabled}
          />
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

  const onClickReorder = () => {
    dispatch(enableReorder(true));
  };

  const closeReoderActions = () => {
    dispatch(enableReorder(false));
    dispatch(fetchForms());
  };

  const saveReorder = () => {
    const forms = formSectionsByGroup.valueSeq().flatten();
    const formsIdsToReorder = forms.map(form => form.get("id"));

    batch(() => {
      dispatch(reorderedForms(formsIdsToReorder.toJS()));
      dispatch(saveFormsReorder(forms.toJS()));
    });
  };

  return (
    <>
      <PageHeading title={i18n.t("forms.label")}>{newFormBtn}</PageHeading>
      <PageContent>
        <div className={css.indexContainer}>
          <div className={css.forms}>
            <LoadingIndicator
              hasData={Boolean(formSectionsByGroup?.size)}
              loading={isLoading}
              type={NAMESPACE}
            >
              <Button
                className={css.reorderButton}
                startIcon={<ListIcon />}
                size="small"
                onClick={onClickReorder}
              >
                {i18n.t("buttons.reorder")}
              </Button>
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
            </LoadingIndicator>
          </div>
          <div className={css.filters}>
            <FormFilters
              filterValues={filterValues}
              modules={modules}
              handleSetFilterValue={handleSetFilterValue}
              handleClearValue={handleClearValue}
              disabled={isReorderEnabled}
            />
          </div>
          <ReorderActions
            open={isReorderEnabled}
            handleCancel={closeReoderActions}
            handleSuccess={saveReorder}
          />
        </div>
      </PageContent>
    </>
  );
};

Component.displayName = NAME;

export default Component;
