import PropTypes from "prop-types";
import { Button, Link } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import styles from "./styles.css";

const useStyles = makeStyles(styles);

const DialogTrigger = ({ commonInputProps, metaInputProps }) => {
  const css = useStyles();
  const { label } = commonInputProps;
  const { onClick } = metaInputProps;

  return (
    <Button component={Link} color="primary" className={css.dialogTrigger} onClick={onClick}>
      {label}
    </Button>
  );
};

DialogTrigger.displayName = "DialogTrigger";

DialogTrigger.propTypes = {
  commonInputProps: PropTypes.shape({
    label: PropTypes.string.isRequired
  }),
  metaInputProps: PropTypes.object
};

export default DialogTrigger;
