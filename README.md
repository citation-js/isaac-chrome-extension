# isaac-chrome-extension

Chrome Web Extension for support of the [NWO ISAAC platform](https://www.nwo.nl/aanvraagsysteem-isaac).

## Usage

> # ⚠️ Alpha version. Only tested for scientific articles.

  1. Click "Projects", select your project and go to the "Product" tab. There, click "Add".
  2. Select the type of product. The extension can do this automatically, but this process is fallible.
  3. Click the icon of the extension in the top right.
  4. Fill in your DOI, PubMed identifer, or ISBN and click "Search". This takes you to the information of the first author.
  5. Review the author information, optionally add additional info such as the gender and DAI, and click "Next". Repeat until all authors are added.
  6. Review the product information, optionally add additional info such as Open Access status.
  7. Submit.

See also the ISAAC manual ([Dutch](https://www.isaac.nwo.nl/documents/1009078/1009634/ISAAC_Handleiding_NL.pdf/1f6da38b-7268-4fc4-8a0b-5097476a15d5), [English](https://www.nwo.nl/sites/nwo/files/media-files/ISAAC_User_manual_EN.pdf)).

## Dependencies

This code uses [Citation.js](https://citation.js.org), license MIT.
