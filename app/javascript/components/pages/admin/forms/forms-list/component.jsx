import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { makeStyles } from "@material-ui/core";

import { useI18n } from "../../../../i18n";
import { useApp } from "../../../../application";
import { PageHeading, PageContent } from "../../../../page";
import { MODULES, RECORD_TYPES } from "../../../../../config/constants";

import { FormGroup, FormSection, FormFilters } from "./components";
import { fetchForms } from "./action-creators";
import { getFormSections } from "./selectors";
import { getListStyle } from "./utils";
import styles from "./styles.css";

const Component = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const css = makeStyles(styles)();
  const defaultFilterValues = {
    recordType: RECORD_TYPES.cases,
    primeroModule: MODULES.CP
  };
  const [filterValues, setFilterValues] = useState(defaultFilterValues);
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
      const { name, form_group_id: formGroupID } = group.first() || {};

      return (
        <FormGroup
          name={i18n.getI18nStringFromObject(name)}
          index={index}
          key={formGroupID}
          id={formGroupID}
        >
          <FormSection group={group} collection={formGroupID} />
        </FormGroup>
      );
    });

  return (
    <>
      <PageHeading title={i18n.t("forms.label")} />
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
    </>
  );
};

Component.displayName = "FormList";

export default Component;
