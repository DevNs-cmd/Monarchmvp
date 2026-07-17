# Monarch Mobile

Installable investor-demo client for Monarch Private Opportunities.

## Demo access

- Founder: `MONARCH-2026`
- Investor: `INVESTOR-2026`
- Monarch Core: `ADMIN-GLOBAL`

The APK is a self-contained showcase build with realistic founder, investor, deal-room, market-intelligence, governance, and revenue scenarios. The Next.js website remains the database-backed system of record.

## Verification

```bash
flutter analyze
flutter test
flutter build apk --release
```

The investor-demo APK uses local Android signing so it can be installed directly. Play Store distribution requires an owner-managed upload key and store listing.
