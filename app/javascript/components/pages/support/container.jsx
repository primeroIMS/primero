import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useI18n } from "components/i18n";
import { Card, CardContent } from "@material-ui/core";
import makeStyles from "@material-ui/styles/makeStyles";
import { PageContainer } from "components/page-container";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as selectors from "./selectors";

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

const Support = ({ supportData, fetchSupportData }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  useEffect(() => {
    fetchSupportData();
  }, [fetchSupportData]);

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

Support.propTypes = {
  supportData: PropTypes.object,
  fetchSupportData: PropTypes.func
};

const mapStateToProps = state => {
  return {
    supportData: selectors.selectSupportData(state)
  };
};

const mapDispatchToProps = {
  fetchSupportData: actions.fetchData
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Support);
