# Public site source

Source for the public marketing site (`live-production/index.html` + `live-production/assets/index-*.js/css`). Reconstructed 2026-08-30 from the deployed bundle, since no source had been committed before.

To make changes and deploy them:

```
cd site-src
npm install
npm run build
```

Then copy the two new hashed files from `site-src/dist/assets/` into `../assets/`, delete the old-hash `index-*.js`/`index-*.css` pair from `../assets/`, and update the two `<script src>`/`<link href>` references in `../index.html` to the new filenames.

Booking-related backend logic lives in `../functions/api/bookings/` and `../functions/_shared/`.
