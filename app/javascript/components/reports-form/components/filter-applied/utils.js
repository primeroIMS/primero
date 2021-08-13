/* eslint-disable camelcase, import/prefer-default-export */

import { CONSTRAINTS, DATE_CONSTRAINTS, NOT_NULL } from "../../constants";
import { DATE_FIELD } from "../../../form";

export const getConstraintLabel = (data, field, i18n) => {
  const { constraint, value } = data;

  if (
    (typeof constraint === "boolean" && constraint) ||
    (Array.isArray(value) && value.includes(NOT_NULL)) ||
    constraint === NOT_NULL
  ) {
    return i18n.t(CONSTRAINTS.not_null);
  }

  if (field?.type === DATE_FIELD && ["<", ">"].includes(constraint)) {
    return i18n.t(DATE_CONSTRAINTS[constraint]);
  }

  return Array.isArray(value) ? "" : i18n.t(CONSTRAINTS[constraint]);
};
