##  Guide to submitting code

#  Versions

Versions are `major.minor.maintenance.dev_build` (`v1.3.0.1` for example)

The minor version usually means an ongoing development effort and there are three minor versions actively maintained:

* 1.2 -> which is under support for some current implementations. These implementations should look to upgrade to v1.3

* 1.3 -> which is the current stable maintenance release. It is compatible with the Primero mobile app.

* 1.4 -> the development effort which includes major changes brought about by implementing internationalization. A data migration effort will be needed to move v1.2/v1.3 implementation to v1.4


1.4 is in active development so the successive builds will be v1.4.0.1, v1.4.0.2, etc. 1.3 is in maintenance mode and is incremented with support versions as v1.3.5, v1.3.6, and so on. Everything fixed in a lower release is merged up. So if its a core bugfix, we try to do it in the v1.3 maint version and then apply up

#  Branches

* There is a development branch -> currently this corresponds to the tip of the 1.4 development

* There is a maint_1.3 branch which is for the v1.3 support.

* There is a maint_1.2 branch which is for the v1.2 support

# New Features

To make a change, you should **make a new feature branch** from the tip of the main branch of what you want to work on (mobile, new development or bug fixes). Doing this allows raising multiple pull requests at the same time if necessary. It is also a good way to keep productivity independent from the rate at which the pull requests are looked at

## Example of creating a separate branch for your feature or user story:

* Move to the correct branch. For example `git checkout maint_1.3`
* Create a new branch with an appropriate name (**also add a story number if there is one and a short description**) and switch to the branch
`git checkout -b <your_branch_name>`
1833_add_follow_up_forms could be an example of the branch name.
* Work on this branch as normal (**regularly pulling/rebasing to keep up to date and avoid conflicts. Also run tests before and after rebase with master**). After committing your code, push as normal to your new branch
`git push`
* On github, navigate to your branch and raise a pull request.
* After that you can checkout to master or create a new branch for the next feature or bug
* Also take a look at the excellent [OpenMRS guide to using git](https://wiki.openmrs.org/display/docs/Using+Git)

# Tests

**Make sure all Rspec tests pass before making a pull request!!!** Currently the Cucumber feature tests are not used or maintained, but may be resurrected in the future to act as a smoke-test suite.


# Note about the Release Target

There is also a version file in the code itself in `config/version.rb` which is incremented that after a release. So for example if we just released v1.4.0.5, we increment it to v1.4.0.6
