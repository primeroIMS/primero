import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useI18n } from "components/i18n";
import { Card, CardContent, Grid } from "@material-ui/core";
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as selectors from "./selectors";

const Support = ({ supportData, fetchSupportData }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();

  useEffect(() => {
    fetchSupportData();
  }, []);

  const DisplayData = (title, value) => {
    return (
      <p key={title}>
        <span className={css.Title}> {title}: </span>
        {value}
      </p>
    );
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <h1 className={css.PageTitle}>{i18n.t("contact.info_label")}</h1>
      </Grid>
      <Grid container direction="row" justify="center" alignItems="center">
        <Card className={css.CardShadow}>
          <CardContent>
            {supportData
              .keySeq()
              .toArray()
              .map(data =>
                DisplayData(
                  i18n.t(`contact.field.${data}`),
                  supportData.get(data)
                )
              )}
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
