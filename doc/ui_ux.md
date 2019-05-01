# UI/UX

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
- Use an `index.js` to export multiple files in a directory
- Use `.jsx` for react files and `.js` for js files.
- Css modules should use the following naming format `[NAME].module.(scss|css)` example: `styles.module.scss`
- Take a look at `components/pages/cases` for an example of how to structure/name components. Notice how we have:
  * layouts
    - AppLayout.jsx
    - AuthLayout.jsx
  * cases
    - action-creators.js
    - actions.js
    - container.jsx
    - index.js
    - component.jsx
    - namespace.js
    - reducer.js
    - services.js
    - styles.module.scss

  > Directories that contains a single component/container use the filename of `component.jsx` or `container.jsx`

  > Directories should be `kabab-case`

  > jsx filenames should be `PascalCase`, and js files should be `kabab-case`

- Material UI: import components separately.
  ```
  import Button from "@material-ui/core/Button";
  import Container from "@material-ui/core/Container";
  ```

  **not**

  ```
  import {Button, Container} from "@material-ui/core";
  ```

### Tools
- Redux-devtools are enabled in development. Install the [chrome extention](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) for use
- Most modern ides have extentions for prettier/eslint. It might be a good idea to install and use.

### Contributing
- Passing test are required
- Code base should pass eslint/prettier. Errors are displayed in console/ide
