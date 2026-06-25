const userStates = new Map();

function getInitialData() {
  return {
    lineaNegocio: "",
    cantidad: "",
    producto: "",
    contenido: "",
    categoria: "",
    modelo: "",
    categoriaP: "",
    productoP: "",
    categoriaR: "",
    productoR: "",
    solicitud: "",
    otraSolicitud: "",
    nombre: "",
    empresa: "",
    telefono: "",
    ciudad: "",
    email: "",
    web: ""
  };
}

function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function esTelefonoValido(numero) {
  return /^[0-9]{7,15}$/.test(numero.replace(/\s/g, ""));
}

function bot(text, options = [], step, datosFormulario) {
  return {
    text,
    options,
    step,
    datosFormulario
  };
}

async function enviarLead(datosFormulario) {
  try {
    await fetch("https://hook.us2.make.com/2ycya2rcd3bgkv0q46va1vapvmgohpc4", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        lineaNegocio: datosFormulario.lineaNegocio || "",
        cantidad: datosFormulario.cantidad || "",
        categoria: datosFormulario.categoria || "",
        producto: datosFormulario.producto || "",
        contenido: datosFormulario.contenido || "",
        categoriaP: datosFormulario.categoriaP || "",
        productoP: datosFormulario.productoP || "",
        categoriaR: datosFormulario.categoriaR || "",
        productoR: datosFormulario.productoR || "",
        otraSolicitud: datosFormulario.otraSolicitud || "",
        solicitud: datosFormulario.solicitud || "",
        nombre: datosFormulario.nombre || "",
        telefono: datosFormulario.telefono || "",
        ciudad: datosFormulario.ciudad || "",
        email: datosFormulario.email || "",
        web: datosFormulario.web || "",
        empresa: datosFormulario.empresa || ""
      })
    });
  } catch (error) {
    console.error("Error enviando lead a Make:", error);
  }
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

function formatBotMessage(text, options = []) {
  if (!options || options.length === 0) return text;
  return `${text}\n\n${options.map((opt, i) => `${i + 1}. ${opt}`).join("\n")}`;
}

async function handleResponse(from, msg) {
  let userState = userStates.get(from);

  if (!userState) {
    userState = {
      step: 0,
      datosFormulario: getInitialData()
    };
  }

  let { step, datosFormulario } = userState;
  let respuestaBot = null;

  switch (step) {
    case 0:
      step = 65;
      respuestaBot = bot(
        "Hola, soy FantiBot, el asistente de Fantiplas.\n\nLe presento nuestras líneas de negocio, por favor seleccione la que más se ajusta a su necesidad.",
        [
          "Envases industriales",
          "Productos de Merchandising | Promocional",
          "Retail, supermercados y misceláneas",
          "Otra solicitud"
        ],
        step,
        datosFormulario
      );
      break;

    case 65:
      if (msg === "1" || msg === "Envases industriales") {
        datosFormulario.lineaNegocio = "Envases industriales";
        step = 100;
        respuestaBot = bot(
          "¿Cuál es el volumen de unidades que requiere?",
          ["Más de 1.000", "Menos de 1.000"],
          step,
          datosFormulario
        );
      } else if (msg === "2" || msg === "Productos de Merchandising | Promocional") {
        datosFormulario.lineaNegocio = "Productos de Merchandising | Promocional";
        step = 101;
        respuestaBot = bot(
          "¿Cuál es el volumen de unidades que requiere?",
          ["Más de 1.000", "Menos de 1.000"],
          step,
          datosFormulario
        );
      } else if (msg === "3" || msg === "Retail, supermercados y misceláneas") {
        datosFormulario.lineaNegocio = "Retail, supermercados y misceláneas";
        step = 102;
        respuestaBot = bot(
          "¿Cuál es el volumen de unidades que requiere?",
          ["Más de 1.000", "Menos de 1.000"],
          step,
          datosFormulario
        );
      } else if (msg === "4" || msg === "Otra solicitud") {
        datosFormulario.lineaNegocio = "Otra solicitud";
        step = 500;
        respuestaBot = bot(
          "Cuéntenos brevemente cuál es su solicitud.",
          [],
          step,
          datosFormulario
        );
      } else {
        respuestaBot = bot(
          "Por favor seleccione una opción escribiendo el número o el nombre de la opción.",
          [
            "Envases industriales",
            "Productos de Merchandising | Promocional",
            "Retail, supermercados y misceláneas",
            "Otra solicitud"
          ],
          step,
          datosFormulario
        );
      }
      break;

    case 100:
      if (msg !== "Más de 1.000" && msg !== "Menos de 1.000" && msg !== "1" && msg !== "2") {
        respuestaBot = bot(
          "Por favor seleccione una opción",
          ["Más de 1.000", "Menos de 1.000"],
          step,
          datosFormulario
        );
      } else {
        datosFormulario.cantidad = (msg === "1") ? "Más de 1.000" : (msg === "2" ? "Menos de 1.000" : msg);
        step = 1;
        respuestaBot = bot(
          "En nuestra línea de envases trabajamos con las siguientes categorías:",
          ["Alimentos", "Cosméticos", "Farmacéuticos", "Hogar - Aseo"],
          step,
          datosFormulario
        );
      }
      break;

    case 1:
      if (["Alimentos", "Cosméticos", "Farmacéuticos", "Farmaceúticos", "Hogar - Aseo"].includes(msg)) {
        datosFormulario.producto = msg;
        step = 2;
        respuestaBot = bot("¿Qué producto vas a envasar?", [], step, datosFormulario);
      } else {
        respuestaBot = bot(
          "Por favor seleccione una categoría válida.",
          ["Alimentos", "Cosméticos", "Farmacéuticos", "Hogar - Aseo"],
          step,
          datosFormulario
        );
      }
      break;

    case 2:
      datosFormulario.contenido = msg;
      step = 3;
      respuestaBot = bot(
        "¿Cuál es el contenido del envase?",
        ["50 ml", "100 ml", "250 ml, 500 ml", "1 litro", "Otro"],
        step,
        datosFormulario
      );
      break;

    case 3:
      datosFormulario.modelo = msg;
      step = 4;
      respuestaBot = bot(
        "Perfecto, a continuación le solicitamos su información para que sea contactado por un representante comercial.\n\n¿Cuál es su nombre?",
        [],
        step,
        datosFormulario
      );
      break;

    case 4:
      datosFormulario.nombre = msg;
      step = 5;
      respuestaBot = bot("¿En qué empresa trabaja?", [], step, datosFormulario);
      break;

    case 5:
      datosFormulario.empresa = msg;
      step = 6;
      respuestaBot = bot("Si quiere que lo llamemos o contactemos por WhatsApp, escriba su número.", [], step, datosFormulario);
      break;

    case 6:
      if (!esTelefonoValido(msg)) {
        respuestaBot = bot("Por favor ingrese un número de teléfono válido.", [], step, datosFormulario);
      } else {
        datosFormulario.telefono = msg;
        step = 7;
        respuestaBot = bot("¿Cuál es la ciudad donde se realizará el despacho?", [], step, datosFormulario);
      }
      break;

    case 7:
      datosFormulario.ciudad = msg;
      step = 10;
      respuestaBot = bot("¿Cuál es su correo electrónico?", [], step, datosFormulario);
      break;

    case 10:
      if (!esEmailValido(msg)) {
        respuestaBot = bot("Por favor ingrese un correo electrónico válido.", [], step, datosFormulario);
      } else {
        datosFormulario.email = msg;
        step = 8;
        respuestaBot = bot("Queremos conocerlo mejor. Compártanos su página web o redes sociales.", [], step, datosFormulario);
      }
      break;

    case 8:
      datosFormulario.web = msg;
      await enviarLead(datosFormulario);
      respuestaBot = bot(
        `Perfecto ${datosFormulario.nombre}, acabamos de asignarle un asesor comercial enfocado en su necesidad. Se pondrá en contacto con usted en un plazo máximo de 3 horas.`,
        [],
        0,
        getInitialData()
      );
      userStates.delete(from);
      return respuestaBot;

    case 500:
      datosFormulario.solicitud = msg;
      step = 4;
      respuestaBot = bot(
        "Perfecto, hemos registrado su solicitud. Ahora necesitamos algunos datos para que un asesor pueda contactarlo.\n\n¿Cuál es su nombre?",
        [],
        step,
        datosFormulario
      );
      break;

    default:
      step = 0;
      respuestaBot = bot(
        "Hola, soy FantiBot, el asistente de Fantiplas.\n\nLe presento nuestras líneas de negocio, por favor seleccione la que más se ajusta a su necesidad.",
        [
          "Envases industriales",
          "Productos de Merchandising | Promocional",
          "Retail, supermercados y misceláneas",
          "Otra solicitud"
        ],
        65,
        datosFormulario
      );
      break;
  }

  userStates.set(from, {
    step: respuestaBot.step,
    datosFormulario: respuestaBot.datosFormulario
  });

  return respuestaBot;
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
