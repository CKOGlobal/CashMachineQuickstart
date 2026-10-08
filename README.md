# Cash Machine QuickStart

React + Vite front end with Vercel serverless functions in `/api`. AI by Anthropic, email by Resend, CRM in GoHighLevel (GHL).

## How access works

The free part (intake → business ideas) is open to everyone. Everything after the paywall needs a **personal access link**:

```
https://cashmachine.proactively-lazy.com/access?t=<signed token>
```

1. Buyer pays on the FastPay link.
2. GHL workflow (payment received) calls `POST /api/cmqs-grant-access`.
3. That endpoint signs the buyer's link, **emails it** via Resend, and **posts it back to GHL** (`GHL_ACCESS_WEBHOOK_URL`) so the workflow can save it on the contact and text it.
4. Opening the link saves it in that browser and opens `/cmqs-opt-in`. The link works on any device for 12 months.

Free/beta codes are checked on the server (`CMQS_FREE_CODES`) and issue a link instantly — no payment, no email loop.

The server re-checks the link on every paid call: AI coach/plan (`/api/chat`), enrollment, plan email, and "I'm stuck" escalation. The plan email only ever goes to the email on the link.

## Vercel environment variables

| Name | Required | What it is |
|---|---|---|
| `ANTHROPIC_API_KEY` | yes | Anthropic key |
| `RESEND_API_KEY` | yes | Resend key (`CASH_MACHINE_RESEND` also accepted) |
| `CMQS_ACCESS_SECRET` | yes | 32+ random characters. Signs access links. **Changing it kills every existing link.** |
| `CMQS_WEBHOOK_SECRET` | yes | Random string GHL sends to prove it's GHL |
| `GHL_CMQS_WEBHOOK_URL` | yes | GHL inbound webhook for enrollments (unchanged) |
| `GHL_STUCK_WEBHOOK_URL` | yes | GHL inbound webhook for "I'm stuck" (unchanged) |
| `GHL_ACCESS_WEBHOOK_URL` | recommended | GHL inbound webhook that receives `email, contact_id, cmqs_access_link, cmqs_access_token` |
| `CMQS_BLOCKED_EMAILS` | optional | Comma-separated buyer emails to cut off (refunds, chargebacks). Their link and any shared copy stop working after redeploy. |
| `CMQS_FREE_CODES` | optional | Comma-separated free codes, e.g. `BETA2026,VIPFRIENDS`. Unset = no free codes. |
| `CMQS_SITE_URL` | yes | `https://cashmachine.proactively-lazy.com` — the address used in access links |

Generate secrets with any password generator (40+ characters, letters and numbers).

Preview deployments sit behind Vercel's login, so GHL can't reach them. Test the full purchase flow on the custom domain after merge, with GHL Workflow A left in Draft until then.

## GHL setup

**Workflow: "CMQS – Payment received → access link"**
- Trigger: the FastPay / order-submitted / payment-received trigger for this product.
- Action **Webhook**: `POST https://cashmachine.proactively-lazy.com/api/cmqs-grant-access`
  - Custom data: `secret` = the `CMQS_WEBHOOK_SECRET` value. GHL sends the contact's email, first name and contact id automatically.

**Workflow: "CMQS – Store access link"** (trigger: Inbound Webhook = `GHL_ACCESS_WEBHOOK_URL`)
- Find/update contact by `email`. Save `cmqs_access_link` and `cmqs_access_token` to contact custom fields.
- Send SMS: "You're in! Your Cash Machine QuickStart link: {{contact.cmqs_access_link}}"

**Weekly check-in SMS "stuck" link** — append the token so it opens on any phone:
```
https://cashmachine.proactively-lazy.com/stuck-chat?week=3&contact={{contact.id}}&t={{contact.cmqs_access_token}}
```

**Existing `payment-webhook` call** (if a workflow uses it): add custom data `secret` = `CMQS_WEBHOOK_SECRET`. Its `plan_url` is now the student's access link.

**FastPay success redirect**: point it to `https://cashmachine.proactively-lazy.com/cmqs-opt-in`. Buyers see "your access link is on its way" until they open the link.

## Hard spend cap

Set a monthly spend limit in the Anthropic console. The per-visitor limits in this app run in memory and reset when Vercel recycles a function, so the console cap is the real backstop.
