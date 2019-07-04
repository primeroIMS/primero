import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";
import { useI18n } from "components/i18n";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as Selectors from "./selectors";

const Chips = ({ recordType, props, chips, setChips }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const { id, options } = props;
  const { values } = options;
  const notTranslatedFilters = [];

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
            label={
              notTranslatedFilters.includes(id)
                ? data.display_name
                : i18n.t(`${recordType.toLowerCase()}.filter_by.${data.id}`)
            }
            variant={chipVariant}
            onClick={() =>
              setChips(
                { id, data: data.id },
                chips && chips.includes(data.id),
                recordType
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
  recordType: PropTypes.string,
  chips: PropTypes.object,
  props: PropTypes.object,
  setChips: PropTypes.func,
  options: PropTypes.object,
  id: PropTypes.string
};

const mapStateToProps = (state, obj) => ({
  chips: Selectors.getChips(state, obj.props, obj.recordType)
});

const mapDispatchToProps = {
  setChips: actions.setChip
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chips);
