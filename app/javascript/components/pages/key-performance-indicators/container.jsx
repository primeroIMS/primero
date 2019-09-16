import React from "react";
import { PageContainer } from "components/page-container";
import { Grid, Box } from "@material-ui/core";
import { useI18n } from "components/i18n";
import makeStyles from "@material-ui/styles/makeStyles";
import styles from "./styles.css";

export default function Reports() {
  const i18n = useI18n();
  const css = makeStyles(styles)();

  return (
    <div>
      <PageContainer>
        <Grid item xs={12}>
          <Box alignItems="center" display="flex">
            <Box flexgrow={1}>
              <h1 className={css.title}>
                {i18n.t("key_performance_indicators.label")}
              </h1>
            </Box>
          </Box>
        </Grid>
      </PageContainer>
    </div>
  );
}
