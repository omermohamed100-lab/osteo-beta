# Public data resilience

## Behavior contract

Public database reads return both data and an availability signal. Visitor pages must evaluate that signal before evaluating whether the returned collection or settings object is empty.

- A successful query with no records shows the established genuine empty or not-configured state.
- A failed query shows the localized gold temporary-unavailable notice and a retry action.
- A successful query with records preserves the existing content presentation.
- Admin and mutation APIs continue to report failures rather than silently substituting public fallback data.

## Covered surfaces

- Courses and training
- Activities and events
- Initiatives Gallery
- Practitioner directory
- Footer contact settings

The practitioner API may return its approved static fallback list during a database outage, but it marks the response with `X-EGSOM-Data-Status: unavailable`. The directory displays the unavailable notice instead of presenting fallback data as a confirmed live result.

## Shared presentation

`PublicDataUnavailable` owns the English/Arabic retry action, status semantics, gold panel treatment, and compact dark-footer treatment. It preserves the existing page hierarchy and does not introduce a new visual system.

## Verification and rollback

The regression suite checks success, genuine empty data, query failure, branch ordering, footer behavior, directory headers, localization, and retry semantics. Local outage checks cover every listed surface. Genuine empty states remain covered by deterministic tests because the local database is unavailable.

This package has no migration, dependency, environment-variable, routing, or provider change. Rollback consists of restoring the individual page branches and removing the shared notice only after confirming the older code does not collapse outages into empty states.
