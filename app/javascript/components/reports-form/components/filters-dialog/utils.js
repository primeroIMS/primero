import { RADIO_FIELD, SELECT_FIELD, TICK_FIELD } from "../../../form";
import { NOT_NULL } from "../../constants";

export const getFilterValue = filter => {
  if (Array.isArray(filter?.value) && filter?.value.includes(NOT_NULL)) {
    return [];
  }

  return filter?.value;
};

export const isNotNullConstraintOrTrue = constraint => constraint === NOT_NULL || constraint === true;

export const getFilterConstraint = (filter, fieldType) => {
  if (
    [SELECT_FIELD, TICK_FIELD, RADIO_FIELD].includes(fieldType) &&
    Array.isArray(filter?.constraint) &&
    filter?.constraint?.includes(NOT_NULL)
  ) {
    return true;
  }

  return filter?.constraint;
};
