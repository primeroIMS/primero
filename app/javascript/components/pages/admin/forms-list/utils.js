import { fromJS } from "immutable";

import { getOrderDirection, affectedOrderRange } from "../form-builder/utils";

import { DRAGGING_IDLE_COLOR, DRAGGING_COLOR } from "./constants";

export const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  background: isDragging ? DRAGGING_COLOR : DRAGGING_IDLE_COLOR,
  ...draggableStyle
});

export const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? DRAGGING_COLOR : DRAGGING_IDLE_COLOR
});

export const buildOrderUpdater = (
  currentOrder,
  newOrder,
  orderField = "order_form_group"
) => {
  if (getOrderDirection(currentOrder, newOrder) > 0) {
    return formSection =>
      formSection.set(orderField, formSection.get(orderField) - 10);
  }

  return formSection =>
    formSection.set(orderField, formSection.get(orderField) + 10);
};

export const reorderElems = ({ fieldsMeta, orderMeta, elemId, elems }) => {
  const { idField, keyField, orderField } = fieldsMeta;
  const { step, target } = orderMeta;
  const currentOrder = elems
    .find(elem => elem.get(idField) === elemId)
    .get(orderField);

  const affectedRange = affectedOrderRange(currentOrder, target, step);

  const orderUpdater = buildOrderUpdater(currentOrder, target, orderField);

  return elems
    .map(elem => {
      const key = elem.get(keyField);

      if (elem.get(idField) === elemId) {
        return { [key]: elem.set(orderField, target) };
      }

      if (affectedRange.includes(elem.get(orderField))) {
        return { [key]: orderUpdater(elem) };
      }

      return { [key]: elem };
    })
    .reduce((acc, current) => acc.merge(fromJS(current)), fromJS({}));
};
