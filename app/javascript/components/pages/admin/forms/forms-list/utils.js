export const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  background: isDragging ? "lightgreen" : "transparent",
  ...draggableStyle
});

export const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "transparent"
});
