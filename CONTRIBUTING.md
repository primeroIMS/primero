##  Guide to submitting code

#  Versions

Versions are `major.minor.maintenance.dev_build` (`v1.3.0.1` for example)

The minor version usually means an ongoing development effort and there are three minor versions actively maintained:

* 1.1 -> which is under support for the current implementation in Sierra Leone and some other GBV implementations

* 1.2 -> which is the next release (scheduled for upcoming new implementations)

* 1.3 -> the development effort for matching and mobile registry (the mobile client work)


1.2 and 1.3 are in active development so the successive builds will be v1.2.0.1, v1.2.0.2, etc. 1.1 is in maintenance mode and is incremented with support versions as v1.1.15, v1.1.16, etc

Everything fixed in a lower release is merged up. So if its a core bugfix, we try to do it in the v1.1 maint version and then apply up

#  Branches

* There is a development branch -> currently this corresponds to the tip of the 1.2 development

* There is a thoughtworks_development branch for mobile related work which corresponds to v1.3 development

* There is a maint_1.1 branch which is for the v1.1 support

# New Features

To make a change, you should <u><b> make a new feature branch </b></u>from the tip of the main branch of what you want to work on (mobile, new development or bug fixes). Doing this allows raising multiple pull requests at the same time if necessary. It is also a good way to keep productivity independent from the rate at which the pull requests are looked at

<u><b> Example of creating a separate branch for your feature or user story: </b></u>

* Move to the correct branch. For example `git checkout development_thoughtworks`
* Create a new branch with an appropriate name (<b>also add a story number if there is one and a short description</b>) and switch to the branch
`git checkout -b <your_branch_name>`
1833_add_follow_up_forms could be an example of the branch name.
* Work on this branch as normal (<b>regularly pulling to keep up to date and avoid conflicts. Also run tests before and after rebase with master</b>). After committing your code, push as normal to your new branch
`git push`
* On github, navigate to your branch and raise a pull request.
* After that you can checkout to master or create a new branch for the next feature or bug
* Also take a look at the excellent OpenMRS guide to using git: https://wiki.openmrs.org/display/docs/Using+Git


<u>Note about the Release Target</u>

There is also a version file in the code itself in `config/version.rb` which is incremented that after a release.
So for example if we just released v1.2.0.5, we increment it to v1.2.0.6
