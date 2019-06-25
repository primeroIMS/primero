import React from "react";
import PropTypes from "prop-types";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./styles.css";

// TODO: State should be handled like expande panels
const Chips = ({ props }) => {
  const css = makeStyles(styles)();
  const { values } = props;

  // const [chipData, setChipData] = React.useState([]);

  const handleClick = chip => () => {
    console.log(chip);
    // setChipData(chips => chips.filter(chip => chip.key !== chipToDelete.key));
  };

  return (
    <div className={css.root}>
      {values.map(data => {
        const chipVariant = data.filled ? "default" : "outlined";
        const className = css[[data.css_color, chipVariant].join("-")];
        return (
          // TODO: Reuse DashboardChip Component
          <Chip
            key={data.id}
            size="small"
            label={data.display_name}
            variant={chipVariant}
            onClick={handleClick(data)}
            className={[css.chip, className].join(" ")}
          />
        );
      })}
    </div>
  );
};

Chips.propTypes = {
  props: PropTypes.object,
  values: PropTypes.array
};

export default Chips;
