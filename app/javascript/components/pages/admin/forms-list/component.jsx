import { useEffect, useState } from "react";
import { batch, useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { useLocation } from "react-router-dom";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { makeStyles } from "@material-ui/core";
import { Add as AddIcon, List as ListIcon, SwapVert } from "@material-ui/icons";

import LoadingIndicator from "../../../loading-indicator";
import { useI18n } from "../../../i18n";
import { useApp } from "../../../application";
import { PageHeading, PageContent } from "../../../page";
import { MODULES, RECORD_TYPES } from "../../../../config/constants";
import { usePermissions } from "../../../user";
import { CREATE_RECORDS, RESOURCES, MANAGE } from "../../../../libs/permissions";
import { FormAction, OPTION_TYPES } from "../../../form";
import { useMemoizedSelector } from "../../../../libs";
import { useDialog } from "../../../action-dialog";
import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import Permission from "../../../application/permission";
import useOptions from "../../../form/use-options";

import FormExporter from "./components/form-exporter";
import { FORM_EXPORTER_DIALOG } from "./components/form-exporter/constants";
import NAMESPACE from "./namespace";
import { FormGroup, FormSection, FormFilters, ReorderActions } from "./components";
import {
  clearFormsReorder,
  enableReorder,
  fetchForms,
  reorderFormGroups,
  reorderFormSections,
  reorderedForms,
  saveFormsReorder
} from "./action-creators";
import { getFormSectionsByFormGroup, getIsLoading, getReorderEnabled } from "./selectors";
import { getFormGroups, getListStyle } from "./utils";
import { NAME, FORM_GROUP_PREFIX, ORDER_TYPE } from "./constants";
import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Component = () => {
  const i18n = useI18n();
  const { limitedProductionSite } = useApp();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const css = useStyles();
  const defaultFilterValues = {
    recordType: RECORD_TYPES.cases,
    primeroModule: MODULES.CP
  };
  const [filterValues, setFilterValues] = useState(defaultFilterValues);

  const isLoading = useMemoizedSelector(state => getIsLoading(state));
  const isReorderEnabled = useMemoizedSelector(state => getReorderEnabled(state));
  const formSectionsByGroup = useMemoizedSelector(state => getFormSectionsByFormGroup(state, filterValues));
  const allFormGroupsLookups = useOptions({ source: OPTION_TYPES.FORM_GROUP_LOOKUP });

  const { modules } = useApp();

  const handleSetFilterValue = (name, value) => {
    setFilterValues({ ...filterValues, ...{ [name]: value } });
  };

  const { primeroModule, recordType } = filterValues;
  const currentFormGroupsLookups = getFormGroups(allFormGroupsLookups, primeroModule, recordType, i18n);

  const handleClearValue = () => {
    setFilterValues(defaultFilterValues);
  };

  const { setDialog, pending, dialogOpen, setDialogPending, dialogClose } = useDialog(FORM_EXPORTER_DIALOG);

  const canAddForms = usePermissions(RESOURCES.metadata, CREATE_RECORDS);

  useEffect(() => {
    if (modules.size > 0) {
      handleSetFilterValue("primeroModule", modules.first().unique_id);
    }
  }, [modules]);

  useEffect(() => {
    batch(() => {
      dispatch(clearFormsReorder());
      dispatch(fetchForms());
    });

    return () => dispatch(clearFormsReorder());
  }, []);

  const handleDragEnd = result => {
    if (result.destination && result.destination.droppableId === result.source.droppableId) {
      const order = result.destination.index * 10;

      if (result.type === ORDER_TYPE.formSection) {
        dispatch(reorderFormSections(result.draggableId, order, filterValues));
      }

      if (result.type === ORDER_TYPE.formGroup) {
        dispatch(reorderFormGroups(result.draggableId.replace(`${FORM_GROUP_PREFIX}-`, ""), order, filterValues));
      }
    }
  };

  const renderFormSections = () =>
    allFormGroupsLookups &&
    allFormGroupsLookups?.length > 0 &&
    formSectionsByGroup.map((group, index) => {
      const formGroupID = group.first().get("form_group_id");

      const formGroupName = currentFormGroupsLookups[formGroupID];

      return (
        <FormGroup
          name={formGroupName}
          index={index}
          key={formGroupID}
          id={formGroupID}
          isDragDisabled={!isReorderEnabled}
        >
          <FormSection group={group} collection={formGroupID} isDragDisabled={!isReorderEnabled} />
        </FormGroup>
      );
    });

  const handleExport = dialog => setDialog({ dialog, open: true });

  const handleNew = () => {
    dispatch(push(`${pathname}/new`));
  };

  const newFormBtn = canAddForms ? (
    <FormAction
      actionHandler={handleNew}
      text={i18n.t("buttons.new")}
      startIcon={<AddIcon />}
      options={{ hide: limitedProductionSite }}
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
      dispatch(saveFormsReorder(forms));
    });
  };

  const hasFormSectionsByGroup = Boolean(formSectionsByGroup?.size);
  const handleClickExport = () => handleExport(FORM_EXPORTER_DIALOG);

  return (
    <Permission resources={RESOURCES.metadata} actions={MANAGE} redirect>
      <PageHeading title={i18n.t("forms.label")}>
        <FormAction actionHandler={handleClickExport} text={i18n.t("buttons.export")} startIcon={<SwapVert />} />
        {newFormBtn}
      </PageHeading>
      <PageContent>
        <FormExporter
          i18n={i18n}
          open={dialogOpen}
          pending={pending}
          close={dialogClose}
          filters={filterValues}
          setPending={setDialogPending}
        />
        <div className={css.indexContainer}>
          <div className={css.forms}>
            <LoadingIndicator hasData={hasFormSectionsByGroup} loading={isLoading} type={NAMESPACE}>
              <ActionButton
                icon={<ListIcon />}
                text={i18n.t("buttons.reorder")}
                type={ACTION_BUTTON_TYPES.default}
                className={css.reorderButton}
                isTransparent
                rest={{
                  onClick: onClickReorder,
                  hide: limitedProductionSite
                }}
              />
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
          <ReorderActions open={isReorderEnabled} handleCancel={closeReoderActions} handleSuccess={saveReorder} />
        </div>
      </PageContent>
    </Permission>
  );
};

Component.displayName = NAME;

export default Component;
