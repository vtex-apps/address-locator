# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Fixed
- Remove `inheritComponent` from blocks.

## [1.1.0] - 2019-01-18
### Changed
- Update React builder to 3.x.
- Bump vtex.styleguide to 9.x.

## [1.0.2] - 2019-01-10
### Fixed
- Add `Container` to adjust padding of address content.
- Remove unnecessary interfaces and blocks.

## [1.0.1] - 2019-01-10
### Changed
- Add support to store and messages builders.

## [0.6.4] - 2019-01-08
### Fixed
- Correct geocoordinates array and remove postal code from obligatory fields to submit

## [0.6.3] - 2019-01-08
### Fixed
- Get city name from "locality" field to fix search for MX

## [0.6.2] - 2018-11-30
### Changed
- Make page contents visible while loading

## [0.6.1] - 2018-11-29
### Updated
- Add dependencies required to build properly

## [0.6.0] - 2018-11-28

### Added
- Add more input for when user tries to use current position
- Always ask for number of address
- Replace SearchBox component with Autocomplete, to limit search for address only and within country

## [0.5.3] - 2018-11-07

### Fixed

- Increased the z-index of the Alert so it can appear on top of elements that were covering it previously

## [0.5.2] - 2018-11-07

## [0.5.1] - 2018-11-07
### Added
- Added logo to address modal
- Added classes to address modal components to allow CSS customization

## [0.5.0] - 2018-11-07

### Added

- Clicks outside of the modal now shake the modal in order to call for the user attention

## [0.4.0] - 2018-11-06

## [0.3.4] - 2018-11-01
### Fixed
- Fixed address search input bug, where one character was being input at time

## [0.3.3] - 2018-11-01

### Added
- Error handling for geolocation

### Changed
- Set timeout and high accuracy for geolocation

### Fixed
- Removed flicker when changing tabs to "First Order"
- Fix input prefix and suffix breaking with error messages

### Fixed

## [0.3.2] - 2018-11-01
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
