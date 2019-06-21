import React from "react";
import FormatListBulleted from "@material-ui/icons/FormatListBulleted";
import { makeStyles, Box } from "@material-ui/core";
import styles from "./styles.css";

const NoData = () => {
  const css = makeStyles(styles)();

  return (
    <Box
      width="auto"
      justifyContent="center"
      display="flex"
      className={css.noData}
    >
      <Box alignSelf="center" className={css.content}>
        <FormatListBulleted fontSize="inherit" className={css.icon} />
        <Box>No records found</Box>
      </Box>
    </Box>
  );
};

export default NoData;
