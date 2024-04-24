import { Grid } from "@material-ui/core";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import CheckIcon from "@material-ui/icons/Check";
import { fromJS } from "immutable";
import PropTypes from "prop-types";

import ActionButton, { ACTION_BUTTON_TYPES } from "../../../action-button";
import IndexTable from "../../../index-table";
import { useI18n } from "../../../i18n";
import css from "../styles.css";
import { VALUE_PLACEHOLDER } from "../constants";
import PhotoArray from "../../../record-form/form/field-types/attachments/photo-array";
import useOptions from "../../../form/use-options";
import { LOOKUPS } from "../../../../config";
import { getOptionText } from "../../../record-form/form/subforms/subform-traces/components/field-row/utils";

function Component({ showTable = false, caseInfo, handleBack, handleOk, handleRowClick, recordTypeValue }) {
  const i18n = useI18n();
  const genderLookups = useOptions({ source: LOOKUPS.gender_unknown });

  const tableOptions = {
    columns: [
      {
        name: "case.id",
        options: {
          display: false
        }
      },
      {
        name: "id",
        options: {
          display: false
        }
      },
      {
        label: i18n.t("potential_match.name"),
        name: "name"
      },
      {
        label: i18n.t("potential_match.case_id"),
        name: "case_id_display",
        options: {
          customBodyRender: (value, tableMeta) => {
            const { rowData } = tableMeta;

            return (
              <ActionButton
                id="case.case_id_display-button"
                text={value}
                type={ACTION_BUTTON_TYPES.default}
                variant="text"
                color="primary"
                noTranslate
                onClick={() => handleRowClick(rowData[1], rowData[3])}
              />
            );
          }
        }
      },
      {
        label: i18n.t("potential_match.child_age"),
        name: "age"
      },
      {
        label: i18n.t("potential_match.child_gender"),
        name: "sex"
      }
    ],
    defaultFilters: fromJS({}),
    recordType: recordTypeValue,
    targetRecordType: recordTypeValue,
    bypassInitialFetch: true,

    options: {
      selectableRows: "none",
      onCellClick: false,
      elevation: 0,
      pagination: true
    }
  };

  if (showTable) {
    return <IndexTable {...tableOptions} />;
  }

  if (!showTable && !caseInfo.isEmpty()) {
    return (
      <>
        <div className={css.toolbar}>
          <ActionButton
            id="back-button"
            icon={<ArrowBackIosIcon />}
            text="buttons.back"
            type={ACTION_BUTTON_TYPES.default}
            rest={{
              onClick: handleBack
            }}
          />
          <ActionButton
            icon={<CheckIcon />}
            text="buttons.link"
            type={ACTION_BUTTON_TYPES.default}
            rest={{
              onClick: handleOk
            }}
          />
        </div>
        <Grid container spacing={3}>
          <Grid container item>
            <Grid item xs={12}>
              <h3 className={css.caseID}>
                {i18n.t("case.label")}{" "}
                <span className={css.recordId}>{caseInfo.get("case_id_display", VALUE_PLACEHOLDER)}</span>
              </h3>
            </Grid>
          </Grid>
          <Grid container item className={css.fieldRow}>
            <Grid item xs={2}>
              <span className={css.fieldTitle}>{i18n.t("cases.name")}</span>
            </Grid>
            <Grid item xs={4}>
              {caseInfo.get("name", VALUE_PLACEHOLDER)}
            </Grid>
          </Grid>
          <Grid container item className={css.fieldRow}>
            <Grid item xs={2}>
              <span className={css.fieldTitle}>{i18n.t("cases.age")}</span>
            </Grid>
            <Grid item xs={4}>
              {caseInfo.get("age", VALUE_PLACEHOLDER)}
            </Grid>
          </Grid>
          <Grid container item className={css.fieldRow}>
            <Grid item xs={2}>
              <span className={css.fieldTitle}>{i18n.t("cases.sex")}</span>
            </Grid>
            <Grid item xs={4}>
              {getOptionText({ options: genderLookups, value: caseInfo.get("sex", VALUE_PLACEHOLDER) })}
            </Grid>
          </Grid>
          <Grid container item className={css.fieldRow} spacing={4}>
            <Grid item xs={6}>
              <div className={css.fieldTitle}>{i18n.t("tracing_request.case_photos")}</div>
              {caseInfo.get("photos", VALUE_PLACEHOLDER).isEmpty() ? (
                <span className={css.nothingFound}>--</span>
              ) : (
                <PhotoArray isGallery images={caseInfo.get("photos", VALUE_PLACEHOLDER)} />
              )}
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }

  return null;
}

Component.displayName = "Content";

Component.propTypes = {
  caseInfo: PropTypes.object,
  handleBack: PropTypes.func,
  handleOk: PropTypes.func,
  handleRowClick: PropTypes.func,
  recordTypeValue: PropTypes.string,
  showTable: PropTypes.bool
};

export default Component;
