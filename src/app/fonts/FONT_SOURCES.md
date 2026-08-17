# Self-hosted font sources

The site self-hosts the same Google Fonts families and subsets that were
previously downloaded at build time. This keeps production builds deterministic
and prevents visitor browsers from contacting Google Fonts.

- Inter, Latin variable subset: https://fonts.google.com/specimen/Inter
- Cormorant Garamond, Latin normal and italic variable subsets:
  https://fonts.google.com/specimen/Cormorant+Garamond
- Noto Sans Arabic, Arabic variable subset:
  https://fonts.google.com/noto/specimen/Noto+Sans+Arabic

All three families are distributed under the SIL Open Font License 1.1. Their
upstream family and license metadata is maintained in the Google Fonts
repository: https://github.com/google/fonts
