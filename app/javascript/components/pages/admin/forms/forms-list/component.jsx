/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */
import React, { useEffect } from "react";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { useI18n } from "../../../../i18n";

import { fetchForms } from "./action-creators";
import { getFormSections } from "./selectors";

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  background: isDragging ? "lightgreen" : "grey",
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey"
});

const DraggableFormSection = ({ name, id, index, children }) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
        >
          <ExpansionPanel>
            <ExpansionPanelSummary>{name}</ExpansionPanelSummary>
            <ExpansionPanelDetails>{children}</ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      )}
    </Draggable>
  );
};

const Component = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const formSectionsByGroup = useSelector(state => getFormSections(state));

  useEffect(() => {
    dispatch(fetchForms());
  }, []);

  const handleDragEnd = result => {
    if (!result.destination) return;

    // handleRecorder, send payload to api
  };

  const renderFormSections = () =>
    formSectionsByGroup.map((group, index) => {
      const { name, form_group_id: formGroupID } = group.first() || {};

      return (
        <DraggableFormSection
          name={i18n.getI18nStringFromObject(name)}
          index={index}
          key={formGroupID}
          id={formGroupID}
        >
          {group.map(formSections => {
            return <div>i18n.getI18nStringFromObject(formSections.name)</div>
          })}
          </DraggableFormSection>
      );
    });

  // snapshot.isDraggingOver container styles
  // snapshot.isDragging form item
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable dropableId>
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
  );
};

Component.displayName = "FormList";

export default Component;
