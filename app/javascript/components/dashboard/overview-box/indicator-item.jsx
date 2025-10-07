import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { cx } from "@emotion/css";

import ActionButton from "../../action-button";
import { useApp } from "../../application";
import { useI18n } from "../../i18n";
import { buildFilter, buildItemLabel } from "../utils";
import { ROUTES } from "../../../config";
import dashboardsCss from "../styles.css";

import css from "./styles.css";

function IndicatorItem({ titleHasModule, item, query, count, countClasses, labelClasses, highlight = false }) {
  const i18n = useI18n();
  const { approvalsLabels } = useApp();
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(push({ pathname: ROUTES.cases, search: buildFilter(query) }));
  };

  const defaultLabel = i18n.t(["dashboard", titleHasModule ? item.split(".")?.[0] : item].join("."));

  const itemLabel = buildItemLabel(item, approvalsLabels, defaultLabel, titleHasModule);

  const numberClasses =
    countClasses || cx({ [dashboardsCss.zero]: !count, [css.itemButtonNumber]: true, [css.highlight]: highlight });
  const textClasses =
    labelClasses || cx({ [dashboardsCss.zero]: !count, [css.itemButton]: true, [css.highlight]: highlight });

  return (
    <>
      <ActionButton
        id={`overview-${item}-number`}
        className={numberClasses}
        type="link"
        text={count}
        onClick={handleClick}
        noTranslate
      />
      <ActionButton
        id={`overview-${item}-text`}
        className={textClasses}
        type="link"
        text={itemLabel}
        onClick={handleClick}
        noTranslate
      />
    </>
  );
}

IndicatorItem.displayName = "IndicatorItem";

IndicatorItem.propTypes = {
  count: PropTypes.number,
  countClasses: PropTypes.object,
  highlight: PropTypes.bool,
  item: PropTypes.object,
  labelClasses: PropTypes.object,
  query: PropTypes.object,
  titleHasModule: PropTypes.bool
};

export default IndicatorItem;
