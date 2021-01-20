/* eslint-disable react/display-name, react/no-multi-comp, import/prefer-default-export */
import React from "react";
import clsx from "clsx";

import ActionButton from "../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../action-button/constants";
import { getShortIdFromUniqueId } from "../../../records";

import { SCORE_TYPES } from "./constants";

export const columns = (i18n, css, dispatch, onTracingRequestClick) => [
  {
    label: i18n.t("potential_match.tracing_request_id"),
    name: "trace.tracing_request_id",
    options: {
      customBodyRender: value => (
        <ActionButton
          text={getShortIdFromUniqueId(value)}
          type={ACTION_BUTTON_TYPES.default}
          isTransparent
          rest={{
            onClick: () => onTracingRequestClick(value),
            className: css.caseLink
          }}
        />
      )
    }
  },
  {
    label: i18n.t("tracing_requests.name_of_inquirer"),
    name: "case.name"
  },
  {
    label: i18n.t("potential_match.inquiry_date"),
    name: "trace.inquiry_date"
  },
  {
    label: i18n.t("potential_match.trace"),
    name: "trace.name"
  },
  {
    label: i18n.t("potential_match.score"),
    name: "likelihood",
    options: {
      customBodyRender: value => <span className={clsx({ [css.likelyScore]: value })}>{SCORE_TYPES[value]}</span>
    }
  }
];
