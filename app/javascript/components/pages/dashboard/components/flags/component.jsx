// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useDispatch } from "react-redux";
import { push } from "connected-react-router";

import { getDashboardFlags, getDashboardFlagsTotal } from "../../selectors";
import { useI18n } from "../../../../i18n";
import Permission, { RESOURCES, ACTIONS } from "../../../../permissions";
import { OptionsBox, FlagBox } from "../../../../dashboard";
import ActionButton from "../../../../action-button";
import { ACTION_BUTTON_TYPES } from "../../../../action-button/constants";
import { RECORD_PATH } from "../../../../../config";
import { useMemoizedSelector } from "../../../../../libs";
import { getLoading } from "../../../../index-table";
import { getErrors } from "../../../../record-form";
import NAMESPACE from "../../namespace";

import css from "./styles.css";
import { NAME } from "./constants";

function Component() {
  const i18n = useI18n();

  const loading = useMemoizedSelector(state => getLoading(state, [NAMESPACE, "flags"]));
  const errors = useMemoizedSelector(state => getErrors(state, [NAMESPACE, "flags"]));
  const flags = useMemoizedSelector(state => getDashboardFlags(state));
  const total = useMemoizedSelector(state => getDashboardFlagsTotal(state));

  const dispatch = useDispatch();
  const handleSeeAll = () => dispatch(push(`${RECORD_PATH.cases}?flagged[0]=true`));

  const renderSeeAll = flags.size > 0 && (
    <div className={css.seeAll}>
      <ActionButton
        id="dashboard.link_see_all"
        text={`${i18n.t("dashboard.link_see_all")} (${total})`}
        type={ACTION_BUTTON_TYPES.default}
        isTransparent
        noTranslate
        rest={{ onClick: handleSeeAll }}
        className={css.seeAllLink}
      />
    </div>
  );

  return (
    <Permission resources={RESOURCES.cases} actions={[ACTIONS.READ, ACTIONS.MANAGE]}>
      <Permission resources={RESOURCES.dashboards} actions={ACTIONS.DASH_FLAGS}>
        <OptionsBox
          title={i18n.t("dashboard.flagged_cases")}
          hasData={Boolean(flags.size) && !loading}
          footer={renderSeeAll}
          loading={loading}
          errors={errors}
        >
          <FlagBox flags={flags} />
        </OptionsBox>
      </Permission>
    </Permission>
  );
}

Component.displayName = NAME;

export default Component;
