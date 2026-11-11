# Hanga Technologies Ltd — company website

Static website for Hanga Technologies Ltd (Kigali, Rwanda). Plain HTML, CSS, and JavaScript; no build step or dependencies.

## Structure

```
index.html                          Home
services.html                       Services (anchors: #ai-native-software-delivery, #platform-modernisation,
                                    #ai-data-engineering, #product-design, #cloud-migration,
                                    #digital-transformation)
our-work.html                       Our Work: list of case studies (samples)
case-*.html                         Single case study pages (samples)
about.html                          About Hanga Technologies
contact.html                        Contact (form + details + offices + FAQ)
privacy-policy.html                 Privacy Policy, including the cookies section (#cookies)
ai-solutions.html                   Supporting page, linked from Services
website-development.html            Supporting page, linked from Services
approach.html                       Supporting page, linked from Services
assets/css/styles.css               Design tokens, layout, components (light + dark themes)
assets/js/theme-init.js             Applies saved/system theme before first paint
assets/js/main.js                   Theme toggle, menu, case carousel, cookie consent, scroll reveal, contact form
assets/img/logo-mark.svg            Logo mark (also inlined in the header/footer of every page)
assets/img/favicon.svg
```

## Running locally

Open `index.html` directly, or serve the folder:

```
python3 -m http.server 8000
```

## Editing

- **Header and footer** are repeated verbatim in every page. When changing them, apply the same edit to all `*.html` files (search for `<header class="site-header">` and `<footer class="site-footer">`).
- **Active nav item** is marked with `aria-current="page"` on the matching link in both the desktop and mobile nav.
- **Colours, type, spacing** are CSS custom properties at the top of `assets/css/styles.css`. The accent is the logo blue (`#2667FF`); dark mode uses a lighter variant for contrast.
- **Contact form:** set `CONTACT_FORM_ENDPOINT` in `assets/js/main.js` to an endpoint that accepts a JSON POST. Until it is set, the form shows the direct email address instead of pretending to send.
- **Placeholders:** anything wrapped in `<span class="placeholder">[...]</span>` must be completed before publishing. This covers registration numbers, addresses, phone numbers, email addresses, dates, and names. Search the project for `class="placeholder"`.
- **Case studies** (`our-work.html`, `case-*.html`, and the homepage carousel) are samples and are labelled as such. Replace with real engagements as references become available.
- **Cookie consent:** the banner stores the visitor's choice in local storage under `hanga-consent`. No analytics tool is installed. Before adding one, load it only when `window.hangaConsent.hasConsent("analytics")` is true, listen for the `hanga:consent` event, and complete the analytics placeholder in `privacy-policy.html#cookies`.
- **The Privacy Policy** is a starter draft and should be reviewed by a qualified legal adviser in Rwanda before publication.

## Fonts

Geist and Geist Mono are loaded from Google Fonts. To avoid the third-party request, self-host the font files and update the `@font-face`/`<link>` references, then amend the third-party paragraph in `privacy-policy.html#cookies`.
