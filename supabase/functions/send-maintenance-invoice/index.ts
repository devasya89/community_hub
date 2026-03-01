import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvoicePayload {
  recipientEmail: string;
  recipientName: string;
  societyName: string;
  unitNumber: string;
  month: string;
  amount: number;
  penalty: number;
  categories: { name: string; amount: number }[];
  paymentMethod: string;
  paymentDate: string;
  receiptNumber: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const payload: InvoicePayload = await req.json();
    const {
      recipientEmail,
      recipientName,
      societyName,
      unitNumber,
      month,
      amount,
      penalty,
      categories,
      paymentMethod,
      paymentDate,
      receiptNumber,
    } = payload;

    const total = amount + penalty;

    const categoryRows = categories
      .map(
        (cat) =>
          `<tr>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#374151;font-size:14px">${cat.name}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#374151;font-size:14px;text-align:right">₹${cat.amount.toLocaleString('en-IN')}</td>
          </tr>`
      )
      .join('');

    const penaltyRow =
      penalty > 0
        ? `<tr>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#dc2626;font-size:14px">Late Penalty</td>
            <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#dc2626;font-size:14px;text-align:right">₹${penalty.toLocaleString('en-IN')}</td>
          </tr>`
        : '';

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif">
  <div style="max-width:600px;margin:24px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07)">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1e293b 0%,#334155 100%);padding:32px 24px;text-align:center">
      <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700">Maintenance Invoice</h1>
      <p style="color:#94a3b8;margin:8px 0 0;font-size:14px">${societyName}</p>
    </div>

    <!-- Status Banner -->
    <div style="background:#ecfdf5;padding:16px 24px;border-bottom:1px solid #d1fae5;text-align:center">
      <span style="color:#059669;font-weight:600;font-size:16px">✅ Payment Successful</span>
    </div>

    <!-- Details -->
    <div style="padding:24px">
      <table style="width:100%;margin-bottom:20px">
        <tr>
          <td style="padding:4px 0;color:#6b7280;font-size:13px">Receipt No.</td>
          <td style="padding:4px 0;color:#111827;font-size:13px;text-align:right;font-weight:600">${receiptNumber}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#6b7280;font-size:13px">Resident</td>
          <td style="padding:4px 0;color:#111827;font-size:13px;text-align:right">${recipientName}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#6b7280;font-size:13px">Unit Number</td>
          <td style="padding:4px 0;color:#111827;font-size:13px;text-align:right">${unitNumber}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#6b7280;font-size:13px">Month</td>
          <td style="padding:4px 0;color:#111827;font-size:13px;text-align:right">${month}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#6b7280;font-size:13px">Payment Date</td>
          <td style="padding:4px 0;color:#111827;font-size:13px;text-align:right">${paymentDate}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#6b7280;font-size:13px">Payment Method</td>
          <td style="padding:4px 0;color:#111827;font-size:13px;text-align:right">${paymentMethod}</td>
        </tr>
      </table>

      <!-- Breakdown -->
      <h3 style="color:#111827;font-size:15px;margin:20px 0 12px;font-weight:600">Breakdown</h3>
      <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:8px;overflow:hidden">
        <thead>
          <tr style="background:#e5e7eb">
            <th style="padding:10px 12px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase;font-weight:600">Category</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;color:#6b7280;text-transform:uppercase;font-weight:600">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${categoryRows}
          ${penaltyRow}
        </tbody>
        <tfoot>
          <tr style="background:#e5e7eb">
            <td style="padding:12px;font-weight:700;color:#111827;font-size:15px">Total Paid</td>
            <td style="padding:12px;font-weight:700;color:#111827;font-size:15px;text-align:right">₹${total.toLocaleString('en-IN')}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;padding:20px 24px;text-align:center;border-top:1px solid #e5e7eb">
      <p style="color:#9ca3af;font-size:12px;margin:0">This is an auto-generated invoice. Please keep it for your records.</p>
      <p style="color:#9ca3af;font-size:12px;margin:4px 0 0">${societyName} • Society Management</p>
    </div>
  </div>
</body>
</html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Society Management <onboarding@resend.dev>',
        to: [recipientEmail],
        subject: `Maintenance Invoice - ${month} | ${societyName}`,
        html,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(`Resend API error [${res.status}]: ${JSON.stringify(result)}`);
    }

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error sending invoice:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
