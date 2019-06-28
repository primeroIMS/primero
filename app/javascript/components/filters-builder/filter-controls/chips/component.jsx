import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as Selectors from "./selectors";

const Chips = ({ props, chips, setChips }) => {
  const css = makeStyles(styles)();
  const { id, options } = props;
  const { values } = options;

  return (
    <div className={css.root}>
      {values.map(data => {
        const chipVariant = data.filled ? "default" : "outlined";
        const className = css[[data.css_color, chipVariant].join("-")];
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
  props: PropTypes.object,
  chips: PropTypes.object,
  setChips: PropTypes.func,
  options: PropTypes.object,
  id: PropTypes.string
};

const mapStateToProps = (state, obj) => ({
  chips: Selectors.getChips(state, obj.props)
});

const mapDispatchToProps = {
  setChips: actions.setChip
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chips);
