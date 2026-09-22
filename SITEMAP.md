# Majestic Tourism — Complete Sitemap

**Domain:** Domestic tourism / tour packages for Northern Pakistan (Hunza, Skardu, Naran-Kaghan, Swat, Fairy Meadows, Chitral, Murree/Galiyat, Neelum Valley, etc.)
**Stack:** React 18 + Vite (frontend) · NestJS + TypeScript (backend) · PostgreSQL + Prisma (DB)

---

## 1. Public / Storefront (Marketing + Booking)

| # | Page | Route | Notes |
|---|------|-------|-------|
| 1 | Home | `/` | Hero, featured tours, top destinations, testimonials, blog teaser | ✅
| 2 | About Us | `/about` | Company story, team, why-choose-us, licenses/certifications | ✅
| 3 | Tour Packages (Listing) | `/tours` | Filter by destination, duration, price range, category (family/couple/group/adventure), sort | ✅
| 4 | Tour Package Details | `/tours/:slug` | Itinerary day-by-day, inclusions/exclusions, gallery, pricing table, availability calendar, reviews, "Book Now" |✅
| 5 | Destinations (Listing) | `/destinations` | Grid of regions (Hunza, Skardu, Swat, etc.) | ✅
| 6 | Destination Detail | `/destinations/:slug` | Region overview, best time to visit, related tours, map | ✅
| 7 | Custom Tour Request | `/custom-tour` | Form for tailor-made / private group itineraries |
| 8 | Gallery | `/gallery` | Photo/video gallery, filterable by destination | ✅
| 9 | Blog (Listing) | `/blog` | Travel guides, tips, destination stories |
| 10 | Blog Post Detail | `/blog/:slug` | Full article, related posts, comments (optional) |
| 11 | Reviews / Testimonials | `/reviews` | Aggregated customer reviews | ✅
| 12 | FAQs | `/faqs` | Booking, payment, cancellation, travel document FAQs |
| 13 | Contact Us | `/contact` | Contact form, office location/map, WhatsApp/phone, social links | ✅
| 14 | Terms & Conditions | `/terms` | |
| 15 | Privacy Policy | `/privacy-policy` | |
| 16 | Cancellation & Refund Policy | `/cancellation-policy` | |
| 17 | 404 / Not Found | `*` | | ✅

---

## 2. Authentication

| # | Page | Route |
|---|------|-------|
| 18 | Login | `/login` | ✅
| 19 | Register | `/register` | ✅
| 20 | Forgot Password | `/forgot-password` | ✅
| 21 | Reset Password | `/reset-password/:token` | ✅
| 22 | Email Verification | `/verify-email/:token` | ✅

---

## 3. Booking Flow (Authenticated or Guest Checkout)

| # | Page | Route | Notes |
|---|------|-------|-------|
| 23 | Booking Form | `/tours/:slug/book` | Select date, travelers count, room type, add-ons | ✅
| 24 | Booking Summary / Review | `/booking/summary` | Price breakdown, terms acceptance | ✅
| 25 | Payment | `/booking/payment` | JazzCash / EasyPaisa / Bank Transfer / Card (Stripe optional) | ✅
| 26 | Booking Confirmation | `/booking/confirmation/:bookingId` | Confirmation + downloadable voucher (PDF) | ✅

---

## 4. User Dashboard (Customer)

| # | Page | Route |
|---|------|-------|
| 27 | Dashboard Home | `/account` | ✅
| 28 | My Bookings | `/account/bookings` | ✅
| 29 | Booking Details | `/account/bookings/:id` | ✅
| 30 | Profile Settings | `/account/profile` | ✅
| 31 | Wishlist / Saved Tours | `/account/wishlist` | ✅
| 32 | Payment History | `/account/payments` | ✅
| 33 | My Reviews | `/account/reviews` | ✅
| 34 | Notifications | `/account/notifications` | ✅

---

## 5. Admin Panel

| # | Page | Route |
|---|------|-------|
| 35 | Admin Login | `/admin/login` | ✅
| 36 | Dashboard (KPIs) | `/admin` | ✅
| 37 | Tour List | `/admin/tours` | ✅
| 38 | Add/Edit Tour | `/admin/tours/new`, `/admin/tours/:id/edit` | ✅
| 39 | Itinerary Builder | `/admin/tours/:id/itinerary` | ✅
| 40 | Pricing & Availability Calendar | `/admin/tours/:id/availability` | ✅
| 41 | Destination/Category Management | `/admin/destinations` | ✅
| 42 | Booking List | `/admin/bookings` | ✅
| 43 | Booking Detail / Status Update | `/admin/bookings/:id` | ✅
| 44 | User Management | `/admin/users` | ✅
| 45 | Payments & Transactions | `/admin/payments` | ✅
| 46 | Reviews Moderation | `/admin/reviews` | ✅
| 47 | Blog Management (List) | `/admin/blog` | ✅
| 48 | Add/Edit Blog Post | `/admin/blog/new`, `/admin/blog/:id/edit` | ✅
| 49 | Gallery/Media Manager | `/admin/media` | ✅
| 50 | Coupons & Discounts | `/admin/coupons` | ✅
| 51 | Reports & Analytics | `/admin/reports` | ✅
| 52 | Site Settings (contact, social, SEO, homepage content) | `/admin/settings` | ✅
| 53 | Admin Roles/Staff Management | `/admin/staff` | ✅

---

## Route Count Summary

- Public/Storefront: 17
- Auth: 5
- Booking Flow: 4
- User Dashboard: 8
- Admin Panel: 19
- **Total: ~53 routes**

## Notes
- Guest checkout should be supported for booking (with account creation offered post-booking) — many travel customers in Pakistan won't want to register upfront.
- Tour Details page is the highest-conversion page; itinerary + gallery + pricing table + reviews should all live there rather than being split into separate pages.
- WhatsApp click-to-chat button should be persistent across storefront pages (very common expectation for travel businesses in Pakistan).
