/* eslint-disable import/prefer-default-export */
import { CASE_WORKER, CLIENT, RECIPIENT } from "../../../record-actions/exports/constants";

export const SIGNATURE_LABELS = {
  [RECIPIENT]: ["recipient_name", "recipient_agency"],
  [CASE_WORKER]: ["caseworker_name", "caseworker_agency"],
  [CLIENT]: ["client"]
};
