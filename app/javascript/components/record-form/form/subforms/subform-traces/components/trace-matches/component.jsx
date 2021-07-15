/* eslint-disable react/display-name, react/no-multi-comp */
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import clsx from "clsx";
import { fromJS } from "immutable";
import { List, ListItemText } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

import ActionButton from "../../../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../../../action-button/constants";
import IndexTable from "../../../../../../index-table";
import { useI18n } from "../../../../../../i18n";
import { LOOKUPS, POTENTIAL_MATCH_LIKELIHOOD } from "../../../../../../../config";
import { setSelectedPotentialMatch, fetchTracePotentialMatches } from "../../../../../../records";
import { getOptionText } from "../field-row/utils";
import useOptions from "../../../../../../form/use-options";

import { NAME } from "./constants";
import styles from "./styles.css";

const useStyles = makeStyles(styles);

const Component = ({ tracingRequestValues, traceValues, recordType }) => {
  const i18n = useI18n();
  const css = useStyles();
  const dispatch = useDispatch();

  const genderOptions = useOptions({ source: LOOKUPS.gender });

  const tableOptions = {
    columns: [
      {
        name: "case.id",
        options: {
          display: false
        }
      },
      {
        label: i18n.t("potential_match.case_id"),
        name: "case.case_id_display",
        options: {
          customBodyRender: (value, tableMeta) => {
            const { rowData } = tableMeta;

            return (
              <ActionButton
                text={value}
                type={ACTION_BUTTON_TYPES.default}
                isTransparent
                className={css.caseLink}
                rest={{
                  onClick: () => dispatch(setSelectedPotentialMatch(rowData[0], recordType)),
                  className: css.caseLink
                }}
              />
            );
          }
        }
      },
      {
        label: i18n.t("potential_match.child_age"),
        name: "case.age"
      },
      {
        label: i18n.t("potential_match.child_gender"),
        name: "case.sex",
        options: {
          customBodyRender: value => getOptionText({ options: genderOptions, value })
        }
      },
      {
        label: i18n.t("potential_match.social_worker"),
        name: "case.owned_by"
      },
      {
        label: i18n.t("potential_match.social_worker_agency"),
        name: "case.owned_by_agency_id"
      },
      {
        label: i18n.t("potential_match.score"),
        name: "likelihood",
        options: {
          customBodyRender: value => {
            const classes = clsx({ [css.likely]: value === POTENTIAL_MATCH_LIKELIHOOD.likely });

            return <span className={classes}>{i18n.t(`potential_match.likelihood_${value}`)}</span>;
          }
        }
      }
    ],
    defaultFilters: fromJS({}),
    onTableChange: () => fetchTracePotentialMatches(traceValues.unique_id, recordType),
    recordType: [recordType, "potentialMatches"],
    targetRecordType: recordType,
    bypassInitialFetch: true,
    options: {
      selectableRows: "none",
      onCellClick: false,
      elevation: 0,
      pagination: false
    }
  };

  useEffect(() => {
    if (traceValues.unique_id && recordType) {
      dispatch(fetchTracePotentialMatches(traceValues.unique_id, recordType));
    }
  }, [traceValues.unique_id, recordType]);

  return (
    <>
      <List>
        <ListItemText primary={i18n.t("tracing_requests.inquirer")} className={css.listTitle} />
        <ListItemText primary={`${i18n.t("tracing_requests.id")}: #${tracingRequestValues.short_id}`} />
        <ListItemText primary={`${i18n.t("tracing_requests.name")}: ${tracingRequestValues.relation_name}`} />
        <ListItemText primary={`${i18n.t("tracing_requests.date_of_inquiry")}: ${tracingRequestValues.inquiry_date}`} />
      </List>
      <IndexTable {...tableOptions} />
    </>
  );
};

Component.propTypes = {
  recordType: PropTypes.string.isRequired,
  traceValues: PropTypes.object.isRequired,
  tracingRequestValues: PropTypes.object.isRequired
};

Component.displayName = NAME;

export default Component;
