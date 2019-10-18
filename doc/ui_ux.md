|#|UI/UX

v2 ui can be found in the `app/javascript` directory.

## Libs/Tech
- [Npm](https://www.npmjs.com/) - js/css package management
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
- [React Conditional Rendering](https://www.robinwieruch.de/conditional-rendering-react/) React rendering patterns

### Notes
- Use functional components for all components. Use the effect hook if lifecycle methods are needed. Don't use the state hook. Redux should manage state. [Using the Effect Hook](https://reactjs.org/docs/hooks-effect.html)
- Use async/await for working with promises
- Take a look at `components/pages/case-list` for an example of how to structure/name components. Notice how we have:
  ```
  |=> layouts
  |   |- AppLayout.jsx
  |   |- AppLayout.unit.test.js
  |   |- AuthLayout.jsx
  |   |- AuthLayout.unit.test.js
  |   |- styles.css
  |=> case-list
  |   |- action-creators.js
  |   |- actions.js
  |   |- index.js
  |   |- component.jsx
  |   |- container.jsx
  |   |- namespace.js
  |   |- reducer.js
  |   |- services.js
  |   |- selectors.js
  |   |- styles.css
  ```
  - Directories that contains a single component/container use the filename of `component.jsx` or `container.jsx`
  - Directories should be `kabab-case`
  - jsx filenames should be `PascalCase`, and js files should be `kabab-case`
  - Use `.jsx` for react files and `.js` for js files.
  - Use an `index.js` to export multiple files in a directory

- Material UI: now supports code splitting so either way of importing is fine.

  ```js
  import Button from "@material-ui/core/Button";
  import Container from "@material-ui/core/Container";
  ```

  **or**

  ```js
  import { Button, Container } from "@material-ui/core";
  ```

### Examples

#### CSS

```js
// styles.css

.welcome {
  color: $(theme.primero.colors.blue);

  span {
    color: $(theme.palette.primary.light);
  }
}
```

```js
// component.js

import React from "react";
import styles from "./styles.css";
import { makeStyles } from "@material-ui/styles";

const TODO = () => {
  const css = makeStyles(styles)();

  return (
    <div className={css.welcome}>Hello <span>Josh</span></div>
  )
}
...
```

#### Functional Component
```js
import React, { useEffect } from "react";
import PropTypes from "prop_types";
import { connect } from "react-redux";

// Using es6 parameter destructuring to get properties from props
const SayHello = ({ name }) => {
  // Equivalent to componentDidMount in class components
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

```js
const testFunc = async options => {
  const response = fetch('/', options);

  const json = await response.json();

  // Do something with json....
  return json;
}
```

### Testing
#### Running test
| Command | Desc |
| ------------------ | ----------- |
| `npm run test:all` | Runs all test |
| `npm run test $FILE` | Run single test file |
| `npm run test:inspect $FILE` | Runs test in debug mode. You should be able to add `debugger;` on a line as a breakpoint and open Chrome Dev Tools to debug. This will also stop execution immediatly, so you will have to continue to get to your breakpoint. |

#### Libs
- [chai](https://www.chaijs.com/)
- [chai-immutable](https://github.com/astorije/chai-immutable)
- [enzyme](https://github.com/airbnb/enzyme)
- [mocha](https://mochajs.org/)
- [sinon](https://sinonjs.org/)
- [require-hacker](https://github.com/catamphetamine/require-hacker)
- [jsdom](https://github.com/jsdom/jsdom)
- [react-test-renderer](https://reactjs.org/docs/test-renderer.html)
- [material-ui/testing](https://material-ui.com/guides/testing/#testing) : Material iu has testing helpers simular to enzyme's methods.

There are also some helpers and setup in the `javascript/test` dir. The helpers in `javascript/test/unit-test-helpers.js` wrap components in the needed providers to mount components. Take a look at files with the name of *.unit.test.js for examples. Test should reside aside their component.

### Tools
- Redux-devtools are enabled in development. Install the [chrome extention](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) for use
- Most modern ides have extentions for prettier/eslint. It might be a good idea to install and use.

### Contributing
- Passing test are required
- Code base should pass eslint/prettier. Errors are displayed in console/ide
