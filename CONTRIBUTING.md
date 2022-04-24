# Contributing

## Source files
  - [`isaac-chrome/assets/popup.js`](isaac-chrome/assets/popup.js) controls the popup, fetches data based on user interaction and sends it to the ISAAC page
  - [`isaac-chrome/assets/content.js`](isaac-chrome/assets/content.js) handles the incoming data and fills in the form

## Scripts

  - [`scripts/generate-icons.sh`](scripts/generate-icons.sh) updates [`isaac-chrome/assets/img/`](isaac-chrome/assets/img/) based on [`assets/icon.svg`](assets/icon.svg)
  - [`scripts/version.js`](scripts/version.js): see below

## Release process

```sh
./scripts/version.js $NEWVERSION # ($NEWVERSION without the "v" prefix)
git add CITATION.cff LICENSE isaac-chrome/manifest.json
git commit -m "Release v$NEWVERSION"
git tag "v$NEWVERSION"
git push origin --tags
# Make release from tag in GitHub (manually)
zip -r isaac-chrome-extension-$NEWVERSION.zip isaac-chrome
# Upload to Chrome webstore (manually)
```
