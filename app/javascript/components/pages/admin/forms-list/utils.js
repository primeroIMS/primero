import { fromJS } from "immutable";

import { getOrderDirection, affectedOrderRange } from "../form-builder/utils";

import { DRAGGING_IDLE_COLOR, DRAGGING_COLOR, ORDER_STEP } from "./constants";

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
      formSection.set(orderField, formSection.get(orderField) - ORDER_STEP);
  }

  return formSection =>
    formSection.set(orderField, formSection.get(orderField) + ORDER_STEP);
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

export const formSectionFilter = (formSection, filter) => {
  const { primeroModule, recordType, formGroupId } = filter;

  return (
    !formSection.is_nested &&
    formSection.module_ids.includes(primeroModule) &&
    formSection.parent_form === recordType &&
    (formGroupId ? formSection.form_group_id === formGroupId : true)
  );
};

export const getFormGroupId = (formSections, formUniqueId) =>
  formSections.find(form => form.get("unique_id") === formUniqueId)
    .form_group_id;

export const filterFormSections = (formSections, filter) =>
  formSections.filter(formSection => formSectionFilter(formSection, filter));

export const groupByFormGroup = formSections =>
  formSections
    .sortBy(fs => fs.order)
    .groupBy(fs => fs.form_group_id)
    .sortBy(group => group.first().order_form_group);

export const setInitialFormOrder = (formSections, filter) =>
  filterFormSections(formSections, filter)
    .sortBy(formSection => formSection.order)
    .valueSeq()
    .map((formSection, index) => formSection.set("order", index * ORDER_STEP));

export const setInitialGroupOrder = (formSections, filter) =>
  groupByFormGroup(filterFormSections(formSections, filter))
    .entrySeq()
    .map((entry, index) =>
      entry[1].map(formSection =>
        formSection.set("order_form_group", index * ORDER_STEP)
      )
    )
    .flatten();
