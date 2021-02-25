import PropTypes from "prop-types";
import { Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import FilterInput from "../filter-input";

const Component = ({ name, handleSetFilterValue, options, id, filterValues }) => {
  return (
    <Accordion elevation={3} defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>{name}</AccordionSummary>
      <AccordionDetails>
        <FilterInput
          handleSetFilterValue={handleSetFilterValue}
          name={name}
          options={options}
          id={id}
          filterValues={filterValues}
        />
      </AccordionDetails>
    </Accordion>
  );
};

Component.displayName = "FiltersExpansionPanel";

Component.defaultProps = {
  filterValues: {},
  options: []
};

Component.propTypes = {
  filterValues: PropTypes.object,
  handleSetFilterValue: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.array
};

export default Component;
