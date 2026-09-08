# H-W-P

**Flows Different Over Here.**

H-W-P is now structured as one product:

- `/` — public H-W-P front door
- `/login.html` — member access / join gate
- `/inside.html` — the logged-in member home; the former tube concept becomes **Inside**
- `/privacy.html` and `/terms.html` — H-W-P legal surfaces

## Product direction

The customer-facing word **Tube** is retired. Video discovery is the default home experience after login and is branded simply as **Inside**. The current repository is static HTML/CSS, so the included session gate is a UI/prototype shell and must be replaced with production authentication (for example Supabase Auth) before it is treated as secure access control.
