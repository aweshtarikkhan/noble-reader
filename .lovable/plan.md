

## Automatic Donation Tracking with Payment Gateway

Since the current setup uses raw UPI links (which don't provide callbacks), we need to integrate a proper payment gateway to automatically track donations. **Razorpay** is the best fit here — it supports UPI, cards, and provides webhooks to record every successful payment.

### Architecture

```text
User clicks "Pay" → Razorpay Checkout opens → User pays via UPI/Card
                                                      ↓
Razorpay webhook → Edge Function → Saves to "donations" table
                                                      ↓
Donate page loads → Fetches donation stats → Shows total raised + count
```

### Steps

1. **Create a `donations` table** in the database with columns: `id`, `amount`, `currency`, `razorpay_payment_id`, `status`, `donor_name` (optional), `created_at`. Public read access (RLS) so the stats can be displayed without auth.

2. **Set up Razorpay integration**:
   - You'll need a Razorpay account (free to create at razorpay.com)
   - Store `RAZORPAY_KEY_ID` (publishable, used in frontend) and `RAZORPAY_KEY_SECRET` as secrets
   - Create an edge function `create-razorpay-order` to generate orders server-side
   - Create an edge function `razorpay-webhook` to receive payment confirmations and insert into the `donations` table

3. **Update the Donate page**:
   - Replace raw UPI link with Razorpay Checkout (loads their JS SDK)
   - Add a "Community Support" stats section at the top showing:
     - Total donations received (count)
     - Total amount raised (sum)
     - Optional: recent donor names (if provided)
   - Keep the QR code as a fallback for manual UPI (those won't be tracked)

4. **Display donation stats on the Donate page** by querying the `donations` table for aggregated count and sum.

### Important Notes

- You will need to create a free Razorpay account and provide two keys (one public, one secret)
- Razorpay test mode can be used first to verify everything works before going live
- Manual UPI payments (via QR) won't be automatically tracked — only payments through the Razorpay checkout will be recorded

Would you like to proceed with this approach? I'll need you to set up a Razorpay account first so we can store the API keys.

