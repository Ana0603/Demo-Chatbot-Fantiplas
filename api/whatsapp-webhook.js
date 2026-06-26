import { handleResponse } from "./chatbot.js";

function formatBotMessage(text, options = []) {
  if (!options || options.length === 0) return text;
  return `${text}\n\n${options.join("\n")}`;
}

async function sendWhatsAppMessage(to, text) {
  const url = `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.WHATSAPP_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: {
        body: text
      }
    })
  });

  const data = await response.json();
  console.log("Respuesta envío WhatsApp:", data);
  return data;
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.status(403).send("Verification failed");
    }
  }

  if (req.method === "POST") {
    try {
      const body = req.body;

      if (body.object) {
        const entry = body.entry?.[0];
        const changes = entry?.changes?.[0];
        const value = changes?.value;
        const message = value?.messages?.[0];

        if (message && message.type === "text") {
          const from = message.from;
          const text = message.text.body.trim();

          const respuesta = await handleResponse(from, text);
          const mensajeFinal = formatBotMessage(respuesta.text, respuesta.options);

          await sendWhatsAppMessage(from, mensajeFinal);
        }

        return res.status(200).send("EVENT_RECEIVED");
      }

      return res.sendStatus(404);
    } catch (error) {
      console.error("Error en webhook:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).send("Method Not Allowed");
}
