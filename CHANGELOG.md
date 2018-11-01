# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Fixed
- Bug on Redeem Address when the page was not redirected

## [0.3.1] - 2018-10-25

## [0.3.0] - 2018-10-24

## [0.2.0] - 2018-10-24
### Added
- MVP of `Address Locator` app.
- Added component to locate address and insert data into orderform
- Redeem addresses by phone number

### Changed
- Exports all feature components to be imported on other apps

### Removed
- `hideTitle` and `hideTabs` prop from the main view, now it's possible to import only `vtex.address-locator/Search`