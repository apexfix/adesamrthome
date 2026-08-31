# ADE Smart Home Conversion Tracking

The website sends privacy-safe funnel events through the configured Google tag and, where configured, the Meta Pixel. Events must not include names, phone numbers, email addresses, photo contents, street addresses or free-text messages.

## Funnel Events

| Event | Meaning | Useful parameters |
| --- | --- | --- |
| `page_view` | A client-side route was viewed after the initial page load | `page_path`, `page_title` |
| `quote_click` | A visitor opened the quote page from an internal CTA | `page_path`, `service`, `product` |
| `sms_click` | A visitor selected an SMS contact link | `page_path`, `link_text` |
| `email_click` | A visitor selected an email contact link | `page_path`, `link_text` |
| `phone_click` | A visitor selected a phone link | `page_path`, `link_text` |
| `product_click` | A visitor opened a product detail page | `page_path`, `product_path` |
| `form_start` | A visitor first interacted with the website enquiry form | `service`, `product` |
| `form_service_selected` | A visitor selected supply and install, installation only or not sure | `service` |
| `form_photo_added` | One or more door photos were prepared for submission | photo counts only |
| `form_photo_error` | Photo preparation or the maximum-photo rule blocked an upload | `reason`, photo count |
| `form_submit_attempt` | The browser attempted to send a valid enquiry | `service`, `product`, `photo_count` |
| `form_submit_error` | The enquiry API did not accept or send the enquiry | `service`, `photo_count` |
| `form_submit_success` | The enquiry API accepted the enquiry | `service`, `product`, `photo_count` |
| `generate_lead` | The visitor reached the thank-you page after a successful enquiry | `service`, `product`, `photo_count` |

`generate_lead` is the primary lead conversion. `form_submit_success` is a diagnostic event and must not be imported as a second conversion.

## Environment Variables

- `NEXT_PUBLIC_GOOGLE_ADS_ID`: loads the Google Ads tag.
- `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL`: sends the confirmed lead to its Google Ads conversion action.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: enables GA4 reporting for the funnel events.
- `NEXT_PUBLIC_META_PIXEL_ID`: enables Meta PageView and Lead events.

The public website currently determines which integrations are active at build time. Adding or changing an ID requires a production deployment and a live event test.

## Lead Attribution In Enquiry Emails

The enquiry form preserves the first acquisition details for the current browser session and sends them only with the business enquiry email. This is separate from the anonymous analytics events above.

Captured fields:

- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` and `utm_term`
- Google Ads click identifiers: `gclid`, `wbraid` and `gbraid`
- Meta click identifier: `fbclid`
- the first landing page and a URL-safe referrer without page content

When a Google click identifier is present without UTMs, the email labels the source as `google` and medium as `cpc`. When `fbclid` is present without UTMs, the email labels the source as `facebook` and medium as `paid_social`. No name, phone number, email address, message or photo is sent to Google or Meta through this attribution record.

## Weekly Funnel

Use one weekly date range and report:

1. `quote_click`
2. `form_start`
3. `form_photo_added`
4. `generate_lead`
5. Qualified enquiries, quotes, bookings, won jobs and revenue from the CRM

Calculate each website step as a percentage of the previous step. Diagnose the first large drop before changing ad spend.
