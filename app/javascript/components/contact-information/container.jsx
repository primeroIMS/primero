import { useSelector } from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";

import { useI18n } from "../i18n";
import PageContainer, { PageContent } from "../page";
import DisplayData from "../display-data";

import styles from "./styles.css";
import { selectSupportData } from "./selectors";
import { BLACK_LISTED_FIELDS } from "./constants";

const Support = () => {
  const css = makeStyles(styles)();
  const supportData = useSelector(state => selectSupportData(state));
  const i18n = useI18n();

  const renderInformation =
    supportData.toSeq().size > 0 &&
    supportData._keys.map(x => {
      if (BLACK_LISTED_FIELDS.includes(x)) {
        return null;
      }

      return (
        <DisplayData
          key={x}
          {...{
            label: i18n.t(`contact.field.${x}`),
            value: supportData[x]
          }}
        />
      );
    });

  return (
    <PageContainer>
      <h1 className={css.PageTitle}>{i18n.t("contact.info_label")}</h1>
      <PageContent>{renderInformation}</PageContent>
    </PageContainer>
  );
};

Support.displayName = "Support";

export default Support;
