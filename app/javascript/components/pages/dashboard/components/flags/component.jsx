import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { push } from "connected-react-router";

import { getDashboardFlags } from "../../selectors";
import { useI18n } from "../../../../i18n";
import Permission from "../../../../application/permission";
import { RESOURCES, ACTIONS } from "../../../../../libs/permissions";
import { OptionsBox, FlagBox } from "../../../../dashboard";
import ActionButton from "../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../action-button/constants";
import { RECORD_PATH } from "../../../../../config";
import { useMemoizedSelector } from "../../../../../libs";

import styles from "./styles.css";
import { NAME } from "./constants";

const useStyles = makeStyles(styles);

const Component = ({ loadingIndicator }) => {
  const i18n = useI18n();

  const flags = useMemoizedSelector(state => getDashboardFlags(state));

  const css = useStyles();
  const dispatch = useDispatch();
  const handleSeeAll = () => dispatch(push(`${RECORD_PATH.cases}?flagged[0]=true`));

  const renderSeeAll = flags.size > 0 && (
    <div className={css.seeAll}>
      <ActionButton
        text={`${i18n.t("dashboard.link_see_all")} (${flags.size})`}
        type={ACTION_BUTTON_TYPES.default}
        isTransparent
        rest={{
          className: css.seeAllColor,
          onClick: handleSeeAll
        }}
      />
    </div>
  );

  return (
    <Permission resources={RESOURCES.cases} actions={[ACTIONS.READ, ACTIONS.MANAGE]}>
      <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_FLAGS}>
        <OptionsBox title={i18n.t("dashboard.flagged_cases")} hasData={Boolean(flags.size)} {...loadingIndicator}>
          <FlagBox flags={flags} />
          {renderSeeAll}
        </OptionsBox>
      </Permission>
    </Permission>
  );
};

Component.displayName = NAME;

Component.propTypes = {
  loadingIndicator: PropTypes.object
};

export default Component;
