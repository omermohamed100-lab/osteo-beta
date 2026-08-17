# EGSOM design system

This document records the public website conventions that should be preserved when the interface is extended. It complements `PRODUCT.md`; product intent belongs there, while reusable visual and interaction decisions belong here.

## Design direction

The site is calm, clinical, protective, and authoritative. It should feel medically credible without feeling cold, and premium without ornamental excess. Preserve the established Egyptian Society identity rather than importing a generic hospital, SaaS, or editorial template.

The core visual reference is a professional medical society: deep institutional navy, warm bone paper, restrained gold rules, human care imagery, precise spacing, and quiet surfaces. Use asymmetry and generous space to create hierarchy, not decorative card grids.

## Typography

- Inter is the Latin interface and body family.
- Cormorant Garamond is the established Latin display family for high-level headings only.
- Noto Sans Arabic is the Arabic interface, body, and heading family. Do not apply Latin display italics, tracking, or uppercase treatment to Arabic.
- Body text should generally remain at least `1rem` on form controls and use relaxed line height for long copy.
- Use balanced heading wraps and natural paragraph wraps. Do not force editorial line breaks into translated content.

Local font files live in `src/app/fonts`; do not replace them with runtime third-party font requests.

## Color and surfaces

Canonical tokens are defined in `src/app/globals.css`:

- `brand-950` through `brand-50`: institutional navy scale.
- `bone` and `paper`: warm page and surface neutrals.
- `mist`: cool supporting surface.
- `gold`, `gold-light`, `gold-deep`, and `gold-soft`: restrained accents and focus indicators.
- `ink` and `ink-muted`: readable body copy.

`surface-panel` is a quiet containing panel. `surface-card` may react visually on hover, but it must not scale on press unless the entire card is a real link or button. Maintain WCAG AA contrast for text; footer body copy uses the lighter navy tints at high opacity against `brand-950`.

## Layout and responsive behavior

- Public content containers use the existing centered container widths and responsive horizontal padding.
- Design for 320px first, then verify 390px, tablet, desktop, and wide desktop.
- Avoid fixed content widths that can overflow translated Arabic copy. Use `min-width: 0`, wrapping, and fluid grids.
- `overflow-x: clip` is a final safety net, not permission to leave overflowing components unfixed.
- Minimum interactive height is 44px (`min-h-11`); primary mobile actions may use 48px (`min-h-12`).
- Preserve logical properties such as `start`, `end`, `ms`, `me`, `ps`, and `pe` so layouts mirror naturally in RTL.

## Components and states

- `PageHeader` provides the shared bilingual public-page introduction.
- `LocalizedText`, `LocalizedLink`, `LocalizedDate`, and `LanguageProvider` own language-aware rendering and navigation.
- `PublicDataUnavailable` is the shared database-outage state. It must remain distinct from genuine empty states and announce itself with a polite live status.
- Loading states use `role="status"`, concise localized text, and decorative spinners hidden from assistive technology.
- Empty states describe a genuine absence of records and must never be used as an outage fallback.
- Error states explain the next safe action without exposing internal transport, database, or authentication details.
- Gallery categories are labelled sections; gallery items are figures with captions when copy exists.

## Forms

- Keep visible labels; placeholders do not replace labels.
- Use `aria-invalid` and `aria-describedby` for field errors.
- On failed submission, announce a localized error summary and move focus to the first invalid field.
- On network or server failure, show a localized `role="alert"` message.
- A successful contact response confirms database receipt only, not email delivery.
- Do not log names, addresses, emails, free-form messages, secrets, provider responses, or complete exceptions.

## Navigation and focus

- Keep the skip link as the first focusable page control and retain the focusable `#main-content` target.
- All interactive controls require visible `:focus-visible` treatment.
- The mobile navigation is a modal interaction: trap focus, close on Escape, restore focus to the trigger, and lock body scrolling while open.
- Icon-only controls need localized accessible names. Decorative SVGs use `aria-hidden="true"`.

## Motion

Motion exists for feedback, orientation, continuity, or a rare deliberate entrance. It is not decoration applied to every card.

Tokens in `src/app/globals.css`:

- `--motion-fast: 120ms` for small hover or press feedback.
- `--motion-standard: 180ms` for routine state changes.
- `--motion-deliberate: 240ms` for drawers and larger spatial transitions.
- `--ease-out-quart` for direct responsive movement.
- `--ease-out-expo` for short entrances that settle decisively.

Routine UI motion stays below 300ms and uses transform or opacity. Button/link press feedback stays subtle, normally `scale(0.97–0.985)`. Hover movement is allowed only behind `(hover: hover) and (pointer: fine)`. Directory cards enter once after initial data load and do not replay when filters change.

Reduced motion keeps state legible: remove large movement and decorative entrances, retain short opacity/color changes, and slow the loading spinner rather than hiding all evidence of progress.

## Content and trust

- Every public claim must have owner-approved evidence.
- Never imply a practitioner credential is verified unless the verification fields are complete and current.
- Public statistics require an English label, Arabic label, source, and verification date.
- English and Arabic copy must communicate the same meaning; Arabic is not a shortened fallback.

## Definition of done for interface changes

1. Run `npm run check` and `npm run build`.
2. Run `npm run audit:prod` when network access is available.
3. Verify English and Arabic/RTL at 320px, 390px, tablet, desktop, and wide desktop.
4. Complete a keyboard pass: skip link, navigation, forms, dialogs, Escape behavior, focus return, and focus visibility.
5. Verify loading, empty, unavailable, error, and success states affected by the change.
6. Verify normal and reduced-motion behavior.
7. Confirm no secrets, personal data, or visitor message content were added to logs or client responses.
