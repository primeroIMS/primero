/* eslint-disable camelcase */
import React from "react";
import PropTypes from "prop-types";
import { connect, useSelector } from "react-redux";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/styles";
import { useI18n } from "components/i18n";
import { getOption } from "components/record-form/selectors";
import { isEmpty } from "lodash";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as Selectors from "./selectors";

const Chips = ({ recordType, props, chips, setChips }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const { field_name, options, option_strings_source } = props;
  let values = [];

  if (!isEmpty(option_strings_source)) {
    values = useSelector(state =>
      getOption(state, option_strings_source, i18n)
    );
  } else if (Array.isArray(options)) {
    values = options;
  } else {
    values = options[i18n.locale];
  }

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
            label={data.display_name || data.display_text}
            variant={chipVariant}
            onClick={() =>
              setChips(
                { field_name, data: data.id },
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
  chips: PropTypes.array,
  props: PropTypes.object,
  setChips: PropTypes.func,
  options: PropTypes.object,
  field_name: PropTypes.string,
  option_strings_source: PropTypes.string
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
