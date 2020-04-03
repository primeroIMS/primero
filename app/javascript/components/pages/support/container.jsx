import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import makeStyles from "@material-ui/styles/makeStyles";

import { useI18n } from "../../i18n";
import { PageContainer, PageContent } from "../../page";
import DisplayData from "../../display-data";

import styles from "./styles.css";
import { selectSupportData } from "./selectors";

const Support = ({ supportData }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  const renderInformation =
    supportData.toSeq().size > 0 &&
    supportData._keys.map(x => {
      if (["agencies", "id"].includes(x)) {
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

Support.propTypes = {
  fetchSupportData: PropTypes.func,
  supportData: PropTypes.object
};

const mapStateToProps = state => {
  return {
    supportData: selectSupportData(state)
  };
};

export default connect(mapStateToProps)(Support);
