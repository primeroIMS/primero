<!-- Copyright (c) 2014 - 2023 UNICEF. All rights reserved. -->

# Frontend Unit Testing


### Libraries

- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest](https://jestjs.io/docs/getting-started)

### Contributing
Temporarily pull request for migrated unit test should be made against
the `develop_react_upgrade` branch in Github.

#### Process for migrating a test file.

1. Rename assigned test file from `$COMPONENT_NAME.unit.test.js` to `$COMPONENT_NAME.spec.js`. We are using spec to separate running of older/migrated test.

2. Migrate test to RTL.

#### Thing to know
- Running unit test
  - `npm run test` - Runs full test suite
  - `npm run test -- $FILE_PATH` - Run individual test files. Example: `npm run test -- app/javascript/components/menu/component.spec.js`
- There are some utility functions that we use to render test components in `/app/javascript/test-utils`. `mountedComponent` will be the most used for unit test. The function takes a component to test, desired store data, and other options. It will return a rendered component to use with your assertions. For an example see: `app/javascript/components/action-button/component.spec.js`
- If there is a component without an unit test file please create one. In that file please place the following.
  ```
    describe("$COMPONENT_NAME", () => {
      it.todo("TODO: Add component unit test");
    });
  ```
  this will be a good placeholder for developer to add the necessary unit test.
- Use `describe` for groups of test and `it` for test.
- For any test you are unsure of or test that are blockers, use `it.skip` with a TODO comment with the reason for skipping. This will allow the continuance of migrating the rest of the file and not pollute the pipeline with failing test.
- Some existing test are unnecessary and cannot/should not be migrated. Example:
  ```
    it("renders component with valid props", () => {
      const { component } = setupMountedComponent(ActionButton, props, state);
      const componentsProps = { ...component.find(ActionButton).props() };

      ["icon", "cancel", "isTransparent", "pending", "text", "type", "outlined", "rest"].forEach(property => {
        expect(componentsProps).to.have.property(property);
        delete componentsProps[property];
      });
      expect(componentsProps).to.be.empty;
    });
  ```
  This test asserts if certain props are set on a component and are not recommended in RTL. This test should be removed. Dev's should write test that test the output of a component instead of logic/state. If you are unsure about a unit test please reach out to other devs.
- Unit test that render components should be the only test files converted.
- Keep pull request small. A pull request should only contain the changes to the assigned component directory.
- RTL provides a few [queries](https://testing-library.com/docs/queries/about) to find elements in the rendered component. A require some kinda of attribute set on a component. For example: `byRole` requires a `data-role` WAI-ARIA attribute set on an element. You will need to make those small changes to the component file for finding elements for test assertions. `ByTestId` is to be only used if it is impossible to use the other provided queries.

  [List of WAI-ARIA Roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles)
