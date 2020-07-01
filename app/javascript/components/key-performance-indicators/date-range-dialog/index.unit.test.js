import DateRangeDialog from './index';
import { spy, setupMountedComponent } from "../../../test";
import {
  DialogContent,
  Button
} from "@material-ui/core";
import { KeyboardDatePicker } from '@material-ui/pickers';

describe('<DateRangeDialog />', () => {
  let currentRange = {
    from: new Date(),
    to: new Date()
  };

  it('should render dialog content when open', () => {
    let { component } = setupMountedComponent(DateRangeDialog, {
      open: true,
      currentRange,
    });

    expect(component.find(DialogContent)).to.have.length(1);
  })

  it("shouldn't render dialog content when closed", () => {
    let { component } = setupMountedComponent(DateRangeDialog, {
      open: false,
      currentRange,
    });

    expect(component.find(DialogContent)).to.have.length(0);
  })

  it('should call onClose when the dialog is closed', () => {
    let onClose = spy()
    let { component } = setupMountedComponent(DateRangeDialog, {
      open: true,
      currentRange,
      onClose: onClose
    });

    component.find('.MuiBackdrop-root').simulate('click');

    expect(onClose).to.have.property('callCount', 1);
  })

  it('should render the currentRange', () => {
    let { component } = setupMountedComponent(DateRangeDialog, {
      open: true,
      currentRange,
    });

    let datePickers = component.find(KeyboardDatePicker);
    expect(datePickers.find({ value: currentRange.from }).exists()).to.be.true;
    expect(datePickers.find({ value: currentRange.to }).exists()).to.be.true;
  })

  it('should call setRange when Button is clicked', () => {
    let setRange = spy();
    let { component } = setupMountedComponent(DateRangeDialog, {
      open: true,
      currentRange,
      onClose: () => {},
      setRange: setRange
    });
    
    component.find(Button).simulate('click');

    expect(setRange).to.have.property('callCount', 1)
  })
})
