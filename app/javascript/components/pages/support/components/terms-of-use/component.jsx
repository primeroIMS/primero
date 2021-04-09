import { Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import GetAppIcon from "@material-ui/icons/GetApp";

import parentStyles from "../../styles.css";
import { useI18n } from "../../../../i18n";
import { getAgencyTermsOfUse } from "../../../../application/selectors";
import { useMemoizedSelector, displayNameHelper } from "../../../../../libs";
import { ACTION_BUTTON_TYPES } from "../../../../action-button/constants";
import ActionButton from "../../../../action-button";

import { NAME } from "./constants";
import styles from "./styles.css";

const useStyles = makeStyles(styles);
const useParentStyles = makeStyles(parentStyles);

const Component = () => {
  const parentCss = useParentStyles();
  const css = useStyles();
  const i18n = useI18n();

  const agenciesWithTermsOfUse = useMemoizedSelector(state => getAgencyTermsOfUse(state));

  const handleClick = termsOfUse => () => window.open(termsOfUse);

  const renderAgencyWihTermsOfUse =
    agenciesWithTermsOfUse.size > 0 ? (
      agenciesWithTermsOfUse.map(agency => {
        return (
          <>
            <Typography className={css.agencyName}>{displayNameHelper(agency.get("name"), i18n.locale)}</Typography>
            <ActionButton
              icon={<GetAppIcon />}
              text={i18n.t("agency.terms_of_use_download_button")}
              type={ACTION_BUTTON_TYPES.default}
              rest={{
                onClick: handleClick(agency.get("terms_of_use"))
              }}
            />
          </>
        );
      })
    ) : (
      <p>{i18n.t("messages.not_available")}</p>
    );

  return (
    <div className={parentCss.termsOfUse}>
      <h2>{i18n.t("navigation.support_menu.terms_of_use")}</h2>
      {renderAgencyWihTermsOfUse}
    </div>
  );
};

Component.displayName = NAME;

export default Component;
