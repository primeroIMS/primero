|#|UI/UX

v2 ui can be found in the `app/javascripts` directory.

## Libs/Tech
- [Yarn](https://yarnpkg.com/en/) - js/css package management
- [Babel](https://babeljs.io/) - JS es6 compiler
- [Webpack](https://webpack.js.org/)/[Webpacker](https://github.com/rails/webpacker) - Module Bundler
- [React](https://reactjs.org/) - JS UI library
- [Redux](https://redux.js.org/) - State management
- [Immutablejs](https://github.com/immutable-js/immutable-js) - Immutable persistent data collections for js
- [React Router](https://github.com/ReactTraining/react-router) - React router
- [Material UI](https://next.material-ui.com/) -  React material design components **Currently using beta version **

## Development
- [github/airbnb/javascript](https://github.com/airbnb/javascript) - JS style guide eslint uses
- [github/airbnb/javascript/react](https://github.com/airbnb/javascript/tree/master/react) - React style guide eslint uses
- [Prettier](https://prettier.io/) - JS code formatter
- [ReactPatterns](https://reactpatterns.com/) - React pattern guides

### Notes
- Use functional components for all components. Use the effect hook if lifecycle methods are needed. Don't use the state hook. Redux should manage state. [Using the Effect Hook](https://reactjs.org/docs/hooks-effect.html)
- Use async/await for working with promises
- Take a look at `components/pages/cases` for an example of how to structure/name components. Notice how we have:
  ```
  |=> layouts
  |   |- AppLayout.jsx
  |   |- AuthLayout.jsx
  |=> cases
  |   |- action-creators.js
  |   |- actions.js
  |   |- index.js
  |   |- component.jsx
  |   |- container.jsx
  |   |- namespace.js
  |   |- reducer.js
  |   |- services.js
  |   |- styles.module.scss
  ```
  - Directories that contains a single component/container use the filename of `component.jsx` or `container.jsx`
  - Directories should be `kabab-case`
  - jsx filenames should be `PascalCase`, and js files should be `kabab-case`
  - Use `.jsx` for react files and `.js` for js files.
  - Css modules should use the following naming format `[NAME].module.(scss|css)` example: `styles.module.scss`
  - Use an `index.js` to export multiple files in a directory

- Material UI: import components separately. This helps us keep the bundle size down.

  ```
  import Button from "@material-ui/core/Button";
  import Container from "@material-ui/core/Container";
  ```

  **not**

  ```
  import {Button, Container} from "@material-ui/core";
  ```

### Examples

#### Functional Component
```
import React, { useEffect } from "react";
import PropTypes from "prop_types";
import { connect } from "react-redux";

// Using es6 parameter destructuring to get properties from props
const SayHello = ({ name }) => {
  // Equivalent to didComponentMount in class components
  useEffect(() => {
    fetchName();
  }, []);

  return <div>Hello {name}</div>
}

SayHello.PropTypes =  {
  name: PropTypes.string.isRequired
};

const mapStateToProps = state => {
  return {
    name: state.get("name")
  };
};

const mapDispatchToProps = {
  fetchCases: actions.fetchName
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SayHello);
```

#### Async/Await - [documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

```
const testFunc = async options => {
  const response = fetch('/', options);

  const json = await response.json();

  // Do something with json....
  return json;
}
```

### Tools
- Redux-devtools are enabled in development. Install the [chrome extention](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) for use
- Most modern ides have extentions for prettier/eslint. It might be a good idea to install and use.

### Contributing
- Passing test are required
- Code base should pass eslint/prettier. Errors are displayed in console/ide
