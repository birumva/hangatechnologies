# Hanga Technologies Ltd — company website

Static website for Hanga Technologies Ltd (Kigali, Rwanda). Plain HTML, CSS, and JavaScript; no build step or dependencies.

## Structure

```
index.html                          Home
services.html                       Services (anchors: #ai-automation, #agentic-workflows, #websites,
                                    #web-applications, #systems-integration, #discovery, #support)
ai-solutions.html                   AI Solutions
website-development.html            Website Development
portfolio.html                      Selected work / case studies (illustrative)
industries.html                     Industries
approach.html                       Approach / delivery methodology
about.html                          About
contact.html                        Contact (form + details + FAQ)
privacy-policy.html                 Legal
terms-of-use.html
cookie-notice.html
legal-notice.html
data-protection-responsible-ai.html
accessibility-statement.html
assets/css/styles.css               Design tokens, layout, components (light + dark themes)
assets/js/theme-init.js             Applies saved/system theme before first paint
assets/js/main.js                   Theme toggle, mobile nav, scroll reveal, contact form, side-nav highlight
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
- **Case studies** in `portfolio.html` are illustrative and are labelled as such. Replace with real engagements as references become available.
- **Legal pages** are starter drafts and should be reviewed by a qualified legal adviser in Rwanda before publication.

## Fonts

Geist and Geist Mono are loaded from Google Fonts. To avoid the third-party request, self-host the font files and update the `@font-face`/`<link>` references, then amend the third-party section of `cookie-notice.html`.
