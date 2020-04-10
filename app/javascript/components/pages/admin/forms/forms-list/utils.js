import { DRAGGING_IDLE_COLOR, DRAGGING_COLOR } from "./constants";

export const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  background: isDragging ? DRAGGING_COLOR : DRAGGING_IDLE_COLOR,
  ...draggableStyle
});

export const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? DRAGGING_COLOR : DRAGGING_IDLE_COLOR
});
