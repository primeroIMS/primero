// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import PropTypes from "prop-types";
import { fromJS } from "immutable";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { cx } from "@emotion/css";

import { useApp } from "../../application";
import { useI18n } from "../../i18n";
import { ROUTES } from "../../../config";
import LoadingIndicator from "../../loading-indicator";
import NAMESPACE from "../../pages/dashboard/namespace";
import { buildFilter, buildLabelItem } from "../utils";
import ActionButton from "../../action-button";

import css from "./styles.css";

function TotalBox({ data, title, loading, errors }) {
  const i18n = useI18n();
  const { approvalsLabels } = useApp();
  const dispatch = useDispatch();
  const loadingIndicatorProps = {
    overlay: true,
    hasData: data.size > 1,
    type: NAMESPACE,
    loading,
    errors
  };

  const [key, indicatorData] = data.get("indicators").entrySeq().first();
  const defaultLabel = i18n.t(`dashboard.${key}`);
  const label = buildLabelItem(key, approvalsLabels, defaultLabel);

  const count = indicatorData.get("count", 0);
  const query = indicatorData.get("query", fromJS([]));

  const totalClasses = cx({ [css.zero]: !count, [css.total]: true });
  const footerClasses = cx({ [css.zero]: !count, [css.footer]: true });

  const handleClick = () => {
    dispatch(
      push({
        pathname: ROUTES.cases,
        search: buildFilter(query)
      })
    );
  };

  return (
    <LoadingIndicator {...loadingIndicatorProps}>
      <div className={css.totalBox} data-testid="total-box">
        <div className={css.sectionTitle}>{title}</div>
        <ActionButton
          id={`total-${key}-number`}
          className={totalClasses}
          type="link"
          text={count}
          onClick={handleClick}
          noTranslate
        />
        <ActionButton
          id={`overview-${key}-text`}
          className={footerClasses}
          type="link"
          text={label}
          onClick={handleClick}
          noTranslate
        />
      </div>
    </LoadingIndicator>
  );
}

TotalBox.displayName = "TotalBox";

TotalBox.propTypes = {
  data: PropTypes.object.isRequired,
  errors: PropTypes.bool,
  loading: PropTypes.bool,
  title: PropTypes.string
};

export default TotalBox;
