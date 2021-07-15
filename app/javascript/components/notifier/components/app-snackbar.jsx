import { useState, useCallback, forwardRef } from "react";
import { useSnackbar, SnackbarContent } from "notistack";
import Collapse from "@material-ui/core/Collapse";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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

AppSnackbar.displayName = "AppSnackbar";

export default AppSnackbar;
