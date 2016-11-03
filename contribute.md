---
layout: docs
title: Contribute
permalink: /contribute/
---

# Contributing to Primero

Primero is an ICT4D project which strives to adhere to the <a href="http://www.digitalprinciples.org">Principles for Digital Development</a>. As an open source project, Primero can only get better with contributions from the community. If you are interested in making Primero better, here are some guidelines on how to contribute code.

## Open a new Issue

If you have a new feature or enhancement in mind, please review the <a href="https://github.com/primeroIMS/primero/issues">Primero GitHub issues</a> list first before opening a new issue. The project has a concrete development roadmap and others may already be working on it or the feature has been deliberately excluded or postponed. 

It is much less likely that your contribution will be rejected if you first check with us on the changes you are making and your approach in implementing them.

## Follow Conventions

Once you have gotten the go-ahead on your changes, get to coding! Just make sure to follow our coding conventions. If you are introducing some new technology or approach not already present in Primero it is doubly important for you to discuss those changes ahead of time with us or your patch may not be approved.

## Write Tests

All new functionality needs to come with associated Rspec tests that fully cover the new code paths you introduce. This is the only way Primero can continue to evolve quickly over time. Contributions which do not come with associated unit tests will not be approved.

## Open a Pull Request

Once you are ready, open a Pull Request against the development branch on the <a href="https://github.com/primeroIMS/primero">Primero repository</a>, referencing the original issue you submitted. We will review your changes and if everything looks good, roll your changes into the codebase. Thanks!

## Document your feature

If your feature changes or adds to Primero’s current behavior, please make sure to document it! In addition to the code pull request, please submit a pull request to the appropriate <a href="https://github.com/primeroIMS">Primero guide in the repository</a>. Take snapshots! Again, please make sure to reference the issue in the pull request.

## Contributing Translations

There is ongoing work to translate Primero’s interface into English, French, Spanish, Arabic and Portuguese, but we’d love to support more. If you’d like to provide translations in a new language or provide fixes, then head over to <a href="https://www.transifex.com">Transifex</a> to supply them.

## Coding Conventions

Overall we take a pragmatic approach to <a href="{{site.baseurl}}/docs/contributing/">coding conventions</a>, trying to adhere to the practices set forth by the Rails, Ruby, Java and Android communities.

## DRY - (Do not Repeat Yourself)

Code blocks should exist once and only once in the system, repetition should be avoided at all costs

## KISS - (Keep It Simple Stupid)

Overall the goal of code should be to communicate its intent first and foremost, optimizations for speed and or brevity should only be taken when absolutely necessary. In a system as complex as Primero it is critically important to only add complexity when absolutely necessary

## Git Diff Politeness

Please do not use tab characters, end-of-line whitespacing, or allow your IDE to auto-format pre-existing code. Code changes become very hard to trace with spurious diffs

## Separation of Concerns 

Business logic should live in the models. The controllers should be responsible for orchestrating interactions with the models. Reusable and shared logic should live in concerns.

## Naming Conventions

In general we attempt to keep the names of models and objects in the code the same as what is represented to the users, even if that requires significant refactors and renames as time goes on. This greatly reduces the cognitive load when trying to understand portions of the codebase. Names should err on the side of clarity over brevity.

## Code Reviews & Pull Requests

All committed code must be code reviewed via a formal pull request. Whether it is new feature work or bug fixes, all code should be written on a branch apart from development, master, or any of the maintenance branches. A pull request should be opened to review those changes before committing. Depending on the development roadmap, a Primero technical lead may direct you to base your code on a branch different from development. Any code on the master branch is considered ready for live deployment

## Test Coverage

Primero is built as a hosted platform that continues to evolve on a daily basis. This is only possible due to having a very high coverage rate for our unit tests. All new functionality should have associated unit tests with full coverage and all bug fixes need to have an associated unit test demonstration the failure. Though this can feel like a tiring policy, it has allowed us to continue to evolve the platform and perform the necessary large refactors with confidence that the system remain stable.

