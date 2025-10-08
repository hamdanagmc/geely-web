

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Zapier body:", body);
    if (body.honeypot) {
      return new Response(JSON.stringify({ success: false, message: 'Spam detected' }), { status: 400 });
    }

    const zapierWebhookUrl = process.env.ZAPIER_WEBHOOK_URL;
    console.log("Zapier Webhook URL:", zapierWebhookUrl);
    if (!zapierWebhookUrl) {
      throw new Error('Zapier Webhook URL is missing in env');
    }
    const newBody = {
      ...body,
      created_at: new Date().toISOString(),
    };

    const zapRes = await fetch(zapierWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBody),
    });

    if (!zapRes.ok) {
      console.error(await zapRes.text());
      return new Response(JSON.stringify({ success: false }), { status: 500 });
    }
    console.log("Zapier response:", await zapRes.text());
    return new Response(JSON.stringify({ success: true }));
  } catch (err) {
    console.error('Zapier error:', err);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
