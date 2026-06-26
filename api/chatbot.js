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
  return { text, options, step, datosFormulario };
}

export async function handleResponse(from, msg) {

  let userState = userStates.get(from);

  if (!userState) {
    userState = { step: 0, datosFormulario: getInitialData() };
  }

  let { step, datosFormulario } = userState;
  let respuestaBot = null;

  switch (step) {

    // ===================== INICIO =====================
    case 0: {
      step = 65;
      respuestaBot = bot(
        "Hola, soy FantiBot.\nSeleccione una línea de negocio:",
        [
          "1. Envases industriales",
          "2. Productos de Merchandising | Promocional",
          "3. Retail, supermercados y misceláneas",
          "4. Otra solicitud"
        ],
        step,
        datosFormulario
      );
      break;
    }

    // ===================== LINEA NEGOCIO =====================
    case 65: {
      if (msg === "1" || msg === "Envases industriales") {
        datosFormulario.lineaNegocio = "Envases industriales";
        step = 100;
      } else if (msg === "2" || msg === "Productos de Merchandising | Promocional") {
        datosFormulario.lineaNegocio = "Merchandising";
        step = 101;
      } else if (msg === "3" || msg === "Retail, supermercados y misceláneas") {
        datosFormulario.lineaNegocio = "Retail";
        step = 102;
      } else if (msg === "4" || msg === "Otra solicitud") {
        datosFormulario.lineaNegocio = "Otra solicitud";
        step = 500;

        respuestaBot = bot(
          "Cuéntenos su solicitud:",
          [],
          step,
          datosFormulario
        );
        break;
      } else {
        respuestaBot = bot("Seleccione una opción válida", [
          "1. Envases industriales",
          "2. Merchandising",
          "3. Retail",
          "4. Otra solicitud"
        ], step, datosFormulario);
        break;
      }

      respuestaBot = bot(
        "¿Cuál es el volumen de unidades?",
        ["5. Más de 1.000", "6. Menos de 1.000"],
        step,
        datosFormulario
      );
      break;
    }

    // ===================== ENVASES =====================
    case 100: {
      const ok = ["5", "6", "Más de 1.000", "Menos de 1.000"].includes(msg);

      if (!ok) {
        respuestaBot = bot("Seleccione una opción válida", ["5. Más de 1.000", "6. Menos de 1.000"], step, datosFormulario);
        break;
      }

      datosFormulario.cantidad = msg === "5" ? "Más de 1.000" : "Menos de 1.000";
      step = 1;

      respuestaBot = bot(
        "Seleccione categoría:",
        ["7. Alimentos", "8. Cosméticos", "9. Farmacéuticos", "10. Hogar - Aseo"],
        step,
        datosFormulario
      );
      break;
    }

    // ===================== MERCH =====================
    case 101: {
      const ok = ["5", "6", "Más de 1.000", "Menos de 1.000"].includes(msg);

      if (!ok) {
        respuestaBot = bot("Seleccione una opción válida", ["5. Más de 1.000", "6. Menos de 1.000"], step, datosFormulario);
        break;
      }

      datosFormulario.cantidad = msg === "5" ? "Más de 1.000" : "Menos de 1.000";
      step = 200;

      respuestaBot = bot(
        "¿Qué tipo de producto quiere personalizar?",
        ["7. Escolar", "8. Mascotas", "9. Para mujeres", "10. Hogar - Aseo", "11. Juguetes"],
        step,
        datosFormulario
      );
      break;
    }

    // ===================== RETAIL =====================
    case 102: {
      const ok = ["5", "6", "Más de 1.000", "Menos de 1.000"].includes(msg);

      if (!ok) {
        respuestaBot = bot("Seleccione una opción válida", ["5. Más de 1.000", "6. Menos de 1.000"], step, datosFormulario);
        break;
      }

      datosFormulario.cantidad = msg === "5" ? "Más de 1.000" : "Menos de 1.000";
      step = 300;

      respuestaBot = bot(
        "¿Qué tipo de producto quiere comercializar?",
        ["7. Escolar", "8. Mascotas", "9. Para mujeres", "10. Hogar - Aseo", "11. Juguetes"],
        step,
        datosFormulario
      );
      break;
    }

    // ===================== DATOS FINALES =====================
    case 4: {
      datosFormulario.nombre = msg;
      step = 5;
      respuestaBot = bot("¿Empresa?", [], step, datosFormulario);
      break;
    }

    case 5: {
      datosFormulario.empresa = msg;
      step = 6;
      respuestaBot = bot("Teléfono:", [], step, datosFormulario);
      break;
    }

    case 6: {
      if (!esTelefonoValido(msg)) {
        respuestaBot = bot("Teléfono inválido", [], step, datosFormulario);
        break;
      }

      datosFormulario.telefono = msg;
      step = 7;
      respuestaBot = bot("Ciudad:", [], step, datosFormulario);
      break;
    }

    case 7: {
      datosFormulario.ciudad = msg;
      step = 10;
      respuestaBot = bot("Correo:", [], step, datosFormulario);
      break;
    }

    case 10: {
      if (!esEmailValido(msg)) {
        respuestaBot = bot("Correo inválido", [], step, datosFormulario);
        break;
      }

      datosFormulario.email = msg;
      step = 8;

      respuestaBot = bot("Web o redes:", [], step, datosFormulario);
      break;
    }

    // ===================== FINAL =====================
    case 8: {
      await fetch("https://hook.us2.make.com/8p85rcjm949d0xp0d0buu25jeyabihoj", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosFormulario)
      });

      userStates.set(from, {
        step: 0,
        datosFormulario: getInitialData()
      });

      return bot(
        `Perfecto ${datosFormulario.nombre}, un asesor se contactará contigo.`,
        [],
        0,
        getInitialData()
      );
    }

    // ===================== FALLBACK =====================
    default: {
      step = 0;
      respuestaBot = bot("Reiniciando conversación...", [], step, datosFormulario);
      break;
    }
  }

  userStates.set(from, { step, datosFormulario });
  return respuestaBot;
}
