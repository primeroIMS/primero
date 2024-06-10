// Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

import { useState, useCallback, forwardRef } from "react";
import { useSnackbar, SnackbarContent } from "notistack";
import PropTypes from "prop-types";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const AppSnackbar = forwardRef(({ message, id }, ref) => {
  const { closeSnackbar } = useSnackbar();

  const [expanded, setExpanded] = useState(false);
  const handleDismiss = useCallback(() => {
    closeSnackbar(id);
  }, [id, closeSnackbar]);

  const handleExpandClick = useCallback(() => {
    setExpanded(oldExpanded => !oldExpanded);
  }, []);

  return (
    <SnackbarContent ref={ref}>
      <Card>
        <CardActions>
          <Typography variant="subtitle2">{message}</Typography>
          <div>
            <IconButton aria-label="Show more" onClick={handleExpandClick}>
              <ExpandMoreIcon />
            </IconButton>
            <IconButton onClick={handleDismiss}>
              <CloseIcon />
            </IconButton>
          </div>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Paper>
            <Typography gutterBottom>PDF ready</Typography>
          </Paper>
        </Collapse>
      </Card>
    </SnackbarContent>
  );
});

AppSnackbar.propTypes = {
  id: PropTypes.string,
  message: PropTypes.string
};

AppSnackbar.displayName = "AppSnackbar";

export default AppSnackbar;
