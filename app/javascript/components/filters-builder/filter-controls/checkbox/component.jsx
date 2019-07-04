import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { FormGroup, FormControlLabel, Checkbox } from "@material-ui/core";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import { useI18n } from "components/i18n";
import styles from "./styles.css";
import * as actions from "./action-creators";
import * as Selectors from "./selectors";

const CheckBox = ({ recordType, props, checkBoxes, setCheckBox }) => {
  const css = makeStyles(styles)();
  const i18n = useI18n();
  const { id, options } = props;
  const { values } = options;
  const notTranslatedFilters = ["social_worker"];

  return (
    <div>
      <FormGroup className={css.formGroup}>
        {values.map(v => (
          <FormControlLabel
            key={v.id}
            control={
              <Checkbox
                key={v.id}
                icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                checkedIcon={<CheckBoxIcon fontSize="small" />}
                checked={checkBoxes && checkBoxes.includes(v.id)}
                onChange={event => {
                  setCheckBox(
                    {
                      id,
                      included: checkBoxes.includes(event.target.value),
                      data: event.target.value
                    },
                    recordType
                  );
                }}
                value={v.id}
                name={v.id}
                className={css.checkbox}
              />
            }
            label={
              notTranslatedFilters.includes(id)
                ? v.id
                : i18n.t(`${recordType.toLowerCase()}.filter_by.${v.id}`)
            }
          />
        ))}
      </FormGroup>
    </div>
  );
};

CheckBox.propTypes = {
  recordType: PropTypes.string.isRequired,
  props: PropTypes.object.isRequired,
  options: PropTypes.object,
  id: PropTypes.string,
  checkBoxes: PropTypes.object,
  setCheckBox: PropTypes.func
};

const mapStateToProps = (state, obj) => ({
  checkBoxes: Selectors.getCheckBoxes(state, obj.props, obj.recordType)
});

const mapDispatchToProps = {
  setCheckBox: actions.setCheckBox
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckBox);
