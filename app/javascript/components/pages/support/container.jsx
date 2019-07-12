import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useI18n } from "components/i18n";
import { Card, CardContent, Grid, Link } from "@material-ui/core";
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as selectors from "./selectors";

const Support = ({ supportData, fetchSupportData }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const data = supportData.toJS();

  useEffect(() => {
    fetchSupportData();
  }, []);

  return (
    <Grid container>
      <Grid item xs={12}>
        <h1 className={css.PageTitle}>{i18n.t("contact.info_label")}</h1>
      </Grid>
      <Grid container direction="row" justify="center" alignItems="center">
        <Card className={css.CardShadow}>
          <CardContent>
            <p>
              <span className={css.Title}>{i18n.t("contact.field.name")}:</span>
              {data.name}
            </p>
            <p>
              <span className={css.Title}>
                {i18n.t("contact.field.organization")}:
              </span>
              {data.organization}
            </p>
            <p>
              <span className={css.Title}>
                {i18n.t("contact.field.position")}:
              </span>
              {data.position}
            </p>
            <p>
              <span className={css.Title}>
                {i18n.t("contact.field.phone")}:
              </span>
              {data.phone}
            </p>
            <p>
              <span className={css.Title}>
                {i18n.t("contact.field.email")}:
              </span>
              {data.email}
            </p>
            <p>
              <span className={css.Title}>
                {i18n.t("contact.field.location")}:
              </span>
              {data.location}
            </p>
            <p>
              <span className={css.Title}>
                {i18n.t("contact.field.support_forum")}:
              </span>
              <Link target="_blank" href={data.support_forum}>
                {data.support_forum}
              </Link>
            </p>
            <p>
              <span className={css.Title}>
                {i18n.t("contact.field.other_information")}:
              </span>
              {data.other_information}
            </p>
            <p>
              <span className={css.Title}>
                {i18n.t("system_settings.primero_version")}:
              </span>
              {data.primero_version}
            </p>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
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
