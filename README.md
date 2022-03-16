# Virtual CT Board

## Branching Rules
* This repository works with pull requests:
  * No direct commits to the master branch
  * A branch is created for every user story in following format: `<story-number>-<story-name>`
    * `<story-name>` should be in camel case
    * e.g. for user story "VSB-20 Initial Project Structure: `vsb-20-InitialProjectStructure`
    * All development activities relating to the user story are committed to this branch
  * The branch is ready for merging if following criteria is met:
    * Build is successful for the branch
    * No failing tests
    * Tests have been created for newly written code
    * Acceptance criteria of story is satisfied
  * Branches are merged using the ["squash" merge strategy](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github#squashing-your-merge-commits)

## Structure
* `src`: Contains the source code of the project
  * `components`: All react components
  * `types`: All custom types
* `test`: Containst all tests for the project
  * Tests have to be placed in the same folder as the source files that are currently being tested
* `docs`: Everything related to documentation for example UML diagrams etc.
* `dist`: Not committed to the repository but contains the deployable compiled output

## Installation

Required software to develop project:
* [node and npm](https://nodejs.org/en/download) to install dependencies
* Editor of your choice, prefereably [Visual Studio Code](https://code.visualstudio.com)

## Build

* Clone the repository to your desired location
* Install the dependencies:
```
$ npm install
```
* Once install rollup globally:
```
$ npm install --global rollup
```
* Once install typescript globally:
```
$ npm install -g typescript
```
* Now you should be able to build the project using the rollup command:
  * The output of the build should be located in the dist/ directory
```
$ npm run build
```
* Alternatively you can also watch for changes and let rollup rebuild automatically:
```
$ npm run watch
```
* Hint: The first command will start the build in production mode and the second command runs in development mode. It is possible to override this behaviour by statically setting the `isDevelopment` and `isProduction` flags in the `rollup.config.js` file

## Tests

* Run tests with:
```
$ npm run test
```
