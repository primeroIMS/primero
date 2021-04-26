import { format, parseISO } from "date-fns";
import { Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

import { useI18n } from "../../../../i18n";
import styles from "../../../../code-of-conduct/styles.css";
import { useMemoizedSelector } from "../../../../../libs";
import { getCodeOfConductAccepteOn } from "../../../../user";
import { getCodesOfConduct } from "../../../../application/selectors";
import { CODE_OF_CONDUCT_DATE_FORMAT } from "../../../../../config/constants";
import parentStyles from "../../styles.css";

import { NAME } from "./constants";

const useStyles = makeStyles(styles);
const useParentStyles = makeStyles(parentStyles);

const Component = () => {
  const css = useStyles();
  const parentCss = useParentStyles();
  const i18n = useI18n();

  const codeOfConductAccepteOn = useMemoizedSelector(state => getCodeOfConductAccepteOn(state));
  const applicationCodeOfConduct = useMemoizedSelector(state => getCodesOfConduct(state));

  const formattedCreatedOnDate =
    applicationCodeOfConduct.size > 0
      ? format(parseISO(applicationCodeOfConduct.get("created_on")), CODE_OF_CONDUCT_DATE_FORMAT)
      : "";

  const formattedAcceptedOnDate =
    codeOfConductAccepteOn !== null ? format(parseISO(codeOfConductAccepteOn), CODE_OF_CONDUCT_DATE_FORMAT) : "";

  return (
    <div className={parentCss.codeOfConductContainer}>
      <h2>{applicationCodeOfConduct.get("title")}</h2>
      <h3>{`${i18n.t("updated")} ${formattedCreatedOnDate}`}</h3>
      <h3>{`${i18n.t("accepted")} ${formattedAcceptedOnDate}`}</h3>
      <Typography className={css.text}>{applicationCodeOfConduct?.get("content")}</Typography>
    </div>
  );
};

Component.displayName = NAME;

export default Component;
