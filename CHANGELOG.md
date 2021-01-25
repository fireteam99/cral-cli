# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2021-01-24

### Added

-   Display command now shows config errors
-   New fix command to edit any config errors
-   Register command forces you to fix config errors first
-   Exposed core util functions through an API
-   Added prettier, eslint, and lint-staged
-   Refactored project structure
-   Fixed jest network issue
-   Renamed a few util functions
-   This changelog

### Fix

-   Support for Rutgers' new CAS login page

### Changed

-   Removed node-persist in favor of a plain JSON config file

### Security

-   Updated some npm package vulnerabilities

## [1.0.0] - 2019-09-03

### Added

-   Command to configure settings
-   Command to view settings
-   Command to register for a single class using an index
-   Ability to verify an index before registering
-   Notifications when a registration fails or succeeds
-   Basic tests for util functions

[1.0.0]: https://github.com/fireteam99/cral-cli/releases/tag/v1.0
