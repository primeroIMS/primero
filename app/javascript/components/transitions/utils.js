/* eslint-disable import/prefer-default-export */
import { RECORD_PATH } from "../../config";

export const redirectCheckAccessDenied = recordType => ({
  action: `${recordType}/REDIRECT`,
  redirectWithIdFromResponse: true,
  redirectProperty: "record_id",
  redirectWhenAccessDenied: true,
  redirect: `/${RECORD_PATH[recordType]}`
});
