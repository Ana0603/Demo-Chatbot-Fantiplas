// api/chatbot.js

const userStates = new Map();

function getInitialData() {
  return {
    lineaNegocio: "",
    cantidad: "",
    OtraSolicitud: "",

    /* ENVASES */
    producto: "",
    contenido: "",
    categoria: "",
    modelo: "",

    /* MERCHANDISING */
    categoriaP: "",
    productoP: "",

    /* RETAIL */
    categoriaR: "",
    productoR: "",

    /* OTRA SOLICITUD */
    solicitud: "",
    otraSolicitud: "",

    /* GENERALES */
    nombre: "",
    empresa: "",
    telefono: "",
    ciudad: "",
    email: "",
    comercial: "",
    web: ""
  };
}

function bot(text, options = [], step, datosFormulario) {
  return { text, options, step, datosFormulario };
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

        /* ENVASES */
        categoria: datosFormulario.categoria || "",
        producto: datosFormulario.producto || "",
        contenido: datosFormulario.contenido || "",

        /* MERCHANDISING */
        categoriaP: datosFormulario.categoriaP || "",
        productoP: datosFormulario.productoP || "",

        /* RETAIL */
        categoriaR: datosFormulario.categoriaR || "",
        productoR: datosFormulario.productoR || "",

        /* OTRA SOLICITUD */
        otraSolicitud: datosFormulario.otraSolicitud || "",
        solicitud: datosFormulario.solicitud || "",

        /* GENERALES */
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

export async function handleResponse(from, msg) {
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

    /* ========================= */
    /* ELECCIÓN CANTIDAD */
    /* ========================= */

    case 100:
      datosFormulario.cantidad = msg;
      step = 1;
      respuestaBot = bot(
        "En nuestra línea de envases trabajamos con las siguientes categorías:",
        ["Alimentos", "Cosméticos", "Farmaceúticos", "Hogar - Aseo"],
        step,
        datosFormulario
      );
      break;

    case 101:
      datosFormulario.cantidad = msg;
      step = 200;
      respuestaBot = bot(
        "¿Qué tipo de producto quiere personalizar?",
        ["Escolar", "Mascotas", "Para mujeres", "Hogar - Aseo", "Juguetes"],
        step,
        datosFormulario
      );
      break;

    case 102:
      datosFormulario.cantidad = msg;
      step = 300;
      respuestaBot = bot(
        "¿Qué tipo de producto quiere comercializar?",
        ["Escolar", "Mascotas", "Para mujeres", "Hogar - Aseo", "Juguetes"],
        step,
        datosFormulario
      );
      break;

    /* ========================= */
    /* CATEGORÍAS ENVASES */
    /* ========================= */

    case 1:
      if (["Alimentos", "Cosméticos", "Farmaceúticos", "Hogar - Aseo"].includes(msg)) {
        datosFormulario.producto = msg;
        step = 2;
        respuestaBot = bot("¿Qué producto vas a envasar?", [], step, datosFormulario);
      } else {
        respuestaBot = bot(
          "Por favor seleccione una categoría válida.",
          ["Alimentos", "Cosméticos", "Farmaceúticos", "Hogar - Aseo"],
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
      // Este paso lo usas para envases, merchandising y retail como "detalle del producto"
      if (datosFormulario.lineaNegocio === "Envases industriales") {
        datosFormulario.modelo = msg;
      } else if (datosFormulario.lineaNegocio === "Productos de Merchandising | Promocional") {
        datosFormulario.productoP = msg;
      } else if (datosFormulario.lineaNegocio === "Retail, supermercados y misceláneas") {
        datosFormulario.productoR = msg;
      }

      step = 4;
      respuestaBot = bot(
        "Perfecto, a continuación le solicitamos su información para que sea contactado por un representante comercial.\n\n¿Cuál es su nombre?",
        [],
        step,
        datosFormulario
      );
      break;

    /* ========================= */
    /* FORMULARIO GENERAL */
    /* ========================= */

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
      datosFormulario.telefono = msg;
      step = 7;
      respuestaBot = bot("¿Cuál es la ciudad donde se realizará el despacho?", [], step, datosFormulario);
      break;

    case 7:
      datosFormulario.ciudad = msg;
      step = 10;
      respuestaBot = bot("¿Cuál es su correo electrónico?", [], step, datosFormulario);
      break;

    case 10:
      datosFormulario.email = msg;
      step = 8;
      respuestaBot = bot("Queremos conocerlo mejor. Compártanos su página web o redes sociales comerciales.", [], step, datosFormulario);
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

    /* ========================= */
    /* CATEGORÍAS MERCHANDISING */
    /* ========================= */

    case 200:
      datosFormulario.categoriaP = msg;

      if (msg === "Escolar") {
        step = 3;
        respuestaBot = bot("Tenemos la capacidad para fabricar reglas, estuches, loncheras y más. ¿Qué producto quiere personalizar?", [], step, datosFormulario);
      } else if (msg === "Mascotas") {
        step = 3;
        respuestaBot = bot("Podemos personalizar botellas y platos. ¿Qué producto quiere personalizar?", [], step, datosFormulario);
      } else if (msg === "Para mujeres") {
        step = 3;
        respuestaBot = bot("Personalizamos diademas, peinillas y pulseras. ¿Qué producto quiere personalizar?", [], step, datosFormulario);
      } else if (msg === "Hogar - Aseo") {
        step = 3;
        respuestaBot = bot("Personalizamos botellas, copas, vasos, platos y anchetas. ¿Qué producto quiere personalizar?", [], step, datosFormulario);
      } else if (msg === "Juguetes") {
        step = 3;
        respuestaBot = bot("Por favor escriba el juguete que quiere personalizar.", [], step, datosFormulario);
      } else {
        respuestaBot = bot(
          "Por favor seleccione una categoría válida.",
          ["Escolar", "Mascotas", "Para mujeres", "Hogar - Aseo", "Juguetes"],
          step,
          datosFormulario
        );
      }
      break;

    /* ========================= */
    /* CATEGORÍAS RETAIL */
    /* ========================= */

    case 300:
      datosFormulario.categoriaR = msg;

      if (msg === "Escolar") {
        step = 3;
        respuestaBot = bot("Fabricamos reglas, estuches, loncheras y más. ¿Qué producto quiere comercializar?", [], step, datosFormulario);
      } else if (msg === "Mascotas") {
        step = 3;
        respuestaBot = bot("Somos fabricantes de botellas y platos para mascotas. ¿Qué producto quiere comercializar?", [], step, datosFormulario);
      } else if (msg === "Para mujeres") {
        step = 3;
        respuestaBot = bot("Fabricamos diademas, peinillas y pulseras. ¿Qué producto quiere comercializar?", [], step, datosFormulario);
      } else if (msg === "Hogar - Aseo") {
        step = 3;
        respuestaBot = bot("Fabricamos botellas, copas, vasos, platos y anchetas. ¿Qué producto quiere comercializar?", [], step, datosFormulario);
      } else if (msg === "Juguetes") {
        step = 3;
        respuestaBot = bot("Por favor escriba el juguete que quiere comercializar.", [], step, datosFormulario);
      } else {
        respuestaBot = bot(
          "Por favor seleccione una categoría válida.",
          ["Escolar", "Mascotas", "Para mujeres", "Hogar - Aseo", "Juguetes"],
          step,
          datosFormulario
        );
      }
      break;

    /* ========================= */
    /* OTRA SOLICITUD */
    /* ========================= */

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
