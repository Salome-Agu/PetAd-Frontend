# Accessibility audit

The automated audit covers the primary application routes with axe-core. It is
run against the local Vite app and fails when any route reports a violation.

## Run locally

```sh
pnpm install
pnpm dev --host 127.0.0.1 --port 4321
```

In a second terminal, run:

```sh
pnpm run a11y:audit
```

Set `A11Y_BASE_URL` when the app is running at a different address.

## Routes and baseline

The script audits the login, registration, password recovery, browsing,
notification, adoption, administration, dispute, and custody routes listed in
`scripts/a11y-audit.ts`. The baseline captured on 2026-09-30 is below; the
script prints the same route-level violation count and impact summary and exits
non-zero while these known violations remain.

| Route | Violations | Impact |
| --- | ---: | --- |
| `/login`, `/register`, `/reset`, `/forgot-password` | 2 each | moderate: 2 |
| `/home` | 1 | serious: 1 |
| `/listings` | 2 | moderate: 2 |
| `/listings/example` | 2 | critical: 1, serious: 1 |
| `/profile`, `/favourites`, `/notifications`, `/notification-preferences`, `/settings/notifications`, `/list-for-adoption`, `/my-listings/example`, `/adoption/example/settlement`, `/adoption/example/timeline`, `/admin/approvals`, `/admin/disputes`, `/shelter/approvals`, `/disputes`, `/disputes/example`, `/custody/example/timeline` | 2 each | moderate: 2 |
| `/interests` | 3 | serious: 1, moderate: 2 |

This committed baseline makes future audits comparable and prevents the known
violations from being mistaken for an untested route.

## Manual checklist

- [ ] Complete each primary flow using only Tab, Shift+Tab, Enter, and Escape.
- [ ] Confirm every control has a useful accessible name.
- [ ] Confirm focus is visible and remains inside an open modal.
- [ ] Confirm dynamic notification updates are announced without moving focus.
- [ ] Repeat the checks with a screen reader and at 200% browser zoom.
