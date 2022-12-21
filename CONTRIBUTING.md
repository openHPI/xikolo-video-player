# How to Contribute

Thank you for your interest in contributing!

## I want to report a problem or ask a question

Before submitting a new GitHub issue, please make sure to check the [existing GitHub issues](https://github.com/openHPI/xikolo-video-player/issues).
If this doesn't help, please [submit an issue](https://github.com/openHPI/xikolo-video-player/issues/new) on GitHub and provide detailed information.

## I want to contribute

The repository is currently updated and maintained internally at HPI.
We currently do not have a procedure for the realization of external contributions.

## Programming Guidelines

The video player is build with Stencil.
A good way to start is to read the official [introduction to Stencil](https://stenciljs.com/docs/introduction).
After this, you should be able to dive into the codebase easier.

### Pull request

Please make pull requests to the `development` branch.

Add a title and a description.
In the description, illustrate first what your code will change.
Please add a section on decisions and choices you made next.
This is very useful for reviewers to quickly get an overview and understand what the PR is about.

### Code Style

We follow the [proposed guideline by Stencil](https://stenciljs.com/docs/style-guide#code-organization).

The repo has a pre-push git hook with eslint so that new linter offenses do not end up in the code base.
