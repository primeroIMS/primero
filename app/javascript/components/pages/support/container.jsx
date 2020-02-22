import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Card, CardContent } from "@material-ui/core";
import makeStyles from "@material-ui/styles/makeStyles";

import { useI18n } from "../../i18n";
import { PageContainer } from "../../page";

import styles from "./styles.css";
import { selectSupportData } from "./selectors";

const DisplayData = ({ title, value }) => {
  const css = makeStyles(styles)();

  return (
    <p key={title}>
      <span className={css.Title}> {title}: </span>
      {value}
    </p>
  );
};

DisplayData.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

const Support = ({ supportData }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  return (
    <PageContainer>
      <h1 className={css.PageTitle}>{i18n.t("contact.info_label")}</h1>
      <Card className={css.Card}>
        <CardContent>
          {supportData.toSeq().size > 0 &&
            supportData._keys.map(x => {
              return (
                <DisplayData
                  {...{
                    title: i18n.t(`contact.field.${x}`),
                    value: supportData[x]
                  }}
                />
              );
            })}
        </CardContent>
      </Card>
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
