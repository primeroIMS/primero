import PropTypes from "prop-types";
import ActionDialog from "../../../../action-dialog";

function Component({open=false}) {
    return <ActionDialog open={open}><p>Hello world</p></ActionDialog>
}


// TODO proptypes
Component.propTypes = {open: PropTypes.bool};
Component.displayName = "MessageDialog";

export default Component;