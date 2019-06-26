import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as Selectors from "./selectors";

const Chips = ({ id, props, chips, setUpChips, setChips }) => {
  const css = makeStyles(styles)();
  const { values } = props;

  // TODO: Should be set on parent component setUpFilters()
  useEffect(() => {
    setUpChips(id);
    console.log("CHIPS 1", chips);
  }, []);

  return (
    <div className={css.root}>
      {values.map(data => {
        const chipVariant = data.filled ? "default" : "outlined";
        const className = css[[data.css_color, chipVariant].join("-")];
        console.log("CHIPS 2", chips);
        const cssSelectedChip =
          chips && chips.includes(data.id) ? "chipSelected" : null;
        return (
          // TODO: Reuse DashboardChip Component
          <Chip
            key={data.id}
            size="small"
            label={data.display_name}
            variant={chipVariant}
            onClick={() =>
              setChips(
                { component_id: id, data: data.id },
                chips && chips.includes(data.id)
              )
            }
            className={[css.chip, className, css[cssSelectedChip]].join(" ")}
            classes={{ clickable: css.testclick }}
          />
        );
      })}
    </div>
  );
};

Chips.propTypes = {
  id: PropTypes.string.isRequired,
  props: PropTypes.object.isRequired,
  chips: PropTypes.array,
  setChips: PropTypes.func,
  setUpChips: PropTypes.func,
  values: PropTypes.array
};

const mapStateToProps = (state, props) => ({
  chips: Selectors.getChips(state, props)
});

const mapDispatchToProps = {
  setChips: actions.setChip,
  setUpChips: actions.setUpChips
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chips);
