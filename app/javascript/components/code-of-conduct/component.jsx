import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { format, parseISO } from "date-fns";

import { ROUTES } from "../../config";
import TranslationsToggle from "../translations-toggle";
import ModuleLogo from "../module-logo";
import { useI18n } from "../i18n";
import { useMemoizedSelector } from "../../libs";
import { getCodeOfConductId, getUser } from "../user";
import LoadingIndicator from "../loading-indicator";
import { getCodesOfConduct } from "../application/selectors";

import { NAME, ID, CODE_OF_CONDUCT_DATE_FORMAT } from "./constants";
import styles from "./styles.css";
import { acceptCodeOfConduct } from "./action-creators";
import { selectUpdatingCodeOfConduct } from "./selectors";
import { Actions, CancelDialog } from "./components";

const useStyles = makeStyles(styles);

const Component = () => {
  const css = useStyles();
  const i18n = useI18n();
  const primeroModule = "cp";
  const dispatch = useDispatch();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const codeOfConductAccepted = useMemoizedSelector(state => getCodeOfConductId(state));
  const applicationCodeOfConduct = useMemoizedSelector(state => getCodesOfConduct(state));
  const currentUser = useMemoizedSelector(state => getUser(state));
  const updatingCodeOfConduct = useMemoizedSelector(state => selectUpdatingCodeOfConduct(state));

  if (!applicationCodeOfConduct && applicationCodeOfConduct.size < 0) {
    return null;
  }

  const formattedDate =
    applicationCodeOfConduct.size > 0
      ? format(parseISO(applicationCodeOfConduct.get("created_on")), CODE_OF_CONDUCT_DATE_FORMAT)
      : "";

  const handleAcceptCodeOfConduct = () => {
    dispatch(
      acceptCodeOfConduct({
        userId: currentUser.get(ID),
        codeOfConductId: applicationCodeOfConduct.get(ID),
        path: location?.state?.referrer || ROUTES.dashboard
      })
    );
  };

  const handleCancel = () => setOpen(true);

  return (
    <LoadingIndicator
      loading={applicationCodeOfConduct.size < 0}
      hasData={applicationCodeOfConduct.size > 0}
      type={NAME}
    >
      <div className={css.container}>
        <ModuleLogo moduleLogo={primeroModule} white />
        <div className={css.content}>
          <div id="printPdf" className={css.details}>
            <h2>{applicationCodeOfConduct.get("title")}</h2>
            <h3>{`${i18n.t("updated")} ${formattedDate}`}</h3>
            <p>{applicationCodeOfConduct.get("content")}</p>
          </div>
          <Actions css={css} i18n={i18n} handleAccept={handleAcceptCodeOfConduct} handleCancel={handleCancel} />
        </div>
        <div className={css.translationToogle}>
          <TranslationsToggle />
        </div>
        <CancelDialog
          open={open}
          setOpen={setOpen}
          i18n={i18n}
          dispatch={dispatch}
          codeOfConductAccepted={codeOfConductAccepted}
          updatingCodeOfConduct={updatingCodeOfConduct}
        />
      </div>
    </LoadingIndicator>
  );
};

Component.displayName = NAME;

export default Component;
