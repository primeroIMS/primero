import SingleAggregateMetric from './container';
import { setupMountedComponent } from "../../../test";

describe('<SingleAggregateMetric />', () => {
  it('Should display the given label', () => {
    let { component } = setupMountedComponent(SingleAggregateMetric, {
      label: 'Test'
    });

    expect(component.render().text()).to.equal('Test');
  });

  it('should display the given value', () => {
    let { component } = setupMountedComponent(SingleAggregateMetric, {
      label: 'Test',
      value: 50
    });

    expect(component.render().text()).to.contain('50');
  })
});
