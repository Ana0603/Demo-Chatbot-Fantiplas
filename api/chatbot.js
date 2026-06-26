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

export async function handleResponse(from, msg) {
  let userState = userStates.get(from);

  if (!userState) {
    userState = {
      step: 0,
      datosFormulario: getInitialData()
    };
  }

  let { step, datosFormulario } = userState;
  console.log("USER STATE:", userState);
  let respuestaBot = null;

  switch (step) {
    case 0:
      step = 65;
      respuestaBot = bot(
        "Hola, soy FantiBot, el asistente de Fantiplas.\n\nLe presento nuestras líneas de negocio, por favor seleccione la que más se ajusta a su necesidad.",
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

    case 65:
      if (msg === "1" || msg === "Envases industriales") {
        datosFormulario.lineaNegocio = "Envases industriales";
        step = 100;
        respuestaBot = bot(
          "¿Cuál es el volumen de unidades que requiere?",
          [ "5. Más de 1.000", "6. Menos de 1.000"],
          step,
          datosFormulario
        );
      } else if (msg === "2" || msg === "Productos de Merchandising | Promocional") {
        datosFormulario.lineaNegocio = "Productos de Merchandising | Promocional";
        step = 101;
        respuestaBot = bot(
          "¿Cuál es el volumen de unidades que requiere?",
          ["5. Más de 1.000", "6. Menos de 1.000"],
          step,
          datosFormulario
        );
      } else if (msg === "3" || msg === "Retail, supermercados y misceláneas") {
        datosFormulario.lineaNegocio = "Retail, supermercados y misceláneas";
        step = 102;
        respuestaBot = bot(
          "¿Cuál es el volumen de unidades que requiere?",
          ["5. Más de 1.000", "6. Menos de 1.000"],
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
            "1. Envases industriales",
            "2. Productos de Merchandising | Promocional",
            "3. Retail, supermercados y misceláneas",
            "4. Otra solicitud"
          ],
          step,
          datosFormulario
        );
      }
      break;

    case 100:
      if (
        msg !== "Más de 1.000" &&
        msg !== "Menos de 1.000" &&
        msg !== "5" &&
        msg !== "6"
      ) {
        respuestaBot = bot(
          "Por favor seleccione una opción",
          ["5. Más de 1.000", "6. Menos de 1.000"],
          step,
          datosFormulario
        );
      } else {
        datosFormulario.cantidad = (msg === "5") ? "Más de 1.000" : (msg === "6" ? "Menos de 1.000" : msg);
        step = 1;
        respuestaBot = bot(
          "En nuestra línea de envases trabajamos con las siguientes categorías:",
          ["7. Alimentos", "8. Cosméticos", "9. Farmacéuticos", "10. Hogar - Aseo"],
          step,
          datosFormulario
        );
      }
      break;

      case 101:
      if (
        msg !== "Más de 1.000" &&
        msg !== "Menos de 1.000" &&
        msg !== "5" &&
        msg !== "6"
      ) {
        respuestaBot = bot(
          "Por favor seleccione una opción",
          ["5. Más de 1.000", "6. Menos de 1.000"],
          step,
          datosFormulario
        );
      } else {
        datosFormulario.cantidad =
          msg === "5"
            ? "Más de 1.000"
            : msg === "6"
            ? "Menos de 1.000"
            : msg;
    
        step = 200;
    
        respuestaBot = bot(
          "¿Qué tipo de producto quiere personalizar?",
          [
            "7. Escolar",
            "8. Mascotas",
            "9. Para mujeres",
            "10. Hogar - Aseo",
            "11. Juguetes"
          ],
          step,
          datosFormulario
        );
      }
      break;

      case 102:
      if (
        msg !== "Más de 1.000" &&
        msg !== "Menos de 1.000" &&
        msg !== "5" &&
        msg !== "6"
      ) {
        respuestaBot = bot(
          "Por favor seleccione una opción",
          ["5. Más de 1.000", "6. Menos de 1.000"],
          step,
          datosFormulario
        );
      } else {
        datosFormulario.cantidad =
          msg === "5"
            ? "Más de 1.000"
            : msg === "6"
            ? "Menos de 1.000"
            : msg;
    
        step = 300;
    
        respuestaBot = bot(
          "¿Qué tipo de producto quiere comercializar?",
          [
            "7. Escolar",
            "8. Mascotas",
            "9. Para mujeres",
            "10. Hogar - Aseo",
            "11. Juguetes"
          ],
          step,
          datosFormulario
        );
      }
      break;

      case 200:

      if (msg === "7" || msg === "Escolar") {
    
        datosFormulario.categoriaP = "Escolar";
    
        step = 3;
    
        respuestaBot = bot(
          "Tenemos la capacidad para fabricar reglas, estuches, loncheras y más.\n\n¿Qué producto quiere personalizar?",
          [],
          step,
          datosFormulario
        );
    
      } else if (msg === "8" || msg === "Mascotas") {
    
        datosFormulario.categoriaP = "Mascotas";
    
        step = 3;
    
        respuestaBot = bot(
          "Podemos personalizar botellas y platos para mascotas.\n\n¿Qué producto quiere personalizar?",
          [],
          step,
          datosFormulario
        );
    
      } else if (msg === "9" || msg === "Para mujeres") {
    
        datosFormulario.categoriaP = "Para mujeres";
    
        step = 3;
    
        respuestaBot = bot(
          "Personalizamos diademas, peinillas y pulseras.\n\n¿Qué producto quiere personalizar?",
          [],
          step,
          datosFormulario
        );
    
      } else if (msg === "10" || msg === "Hogar - Aseo") {
    
        datosFormulario.categoriaP = "Hogar - Aseo";
    
        step = 3;
    
        respuestaBot = bot(
          "Personalizamos botellas, copas, vasos, platos y anchetas.\n\n¿Qué producto quiere personalizar?",
          [],
          step,
          datosFormulario
        );
    
      } else if (msg === "11" || msg === "Juguetes") {
    
        datosFormulario.categoriaP = "Juguetes";
    
        step = 3;
    
        respuestaBot = bot(
          "¿Qué juguete quiere personalizar?",
          [],
          step,
          datosFormulario
        );
    
      } else {
    
        respuestaBot = bot(
          "Por favor seleccione una categoría válida.",
          [
            "7. Escolar",
            "8. Mascotas",
            "9. Para mujeres",
            "10. Hogar - Aseo",
            "11. Juguetes"
          ],
          step,
          datosFormulario
        );
    
      }
    
      break;

      case 300:

      if (msg === "7" || msg === "Escolar") {
    
        datosFormulario.categoriaR = "Escolar";
    
        step = 3;
    
        respuestaBot = bot(
          "Somos fabricantes de reglas, estuches, loncheras y más.\n\n¿Qué producto quiere comercializar?",
          [],
          step,
          datosFormulario
        );
    
      } else if (msg === "8" || msg === "Mascotas") {
    
        datosFormulario.categoriaR = "Mascotas";
    
        step = 3;
    
        respuestaBot = bot(
          "Somos fabricantes de botellas y platos para mascotas.\n\n¿Qué producto quiere comercializar?",
          [],
          step,
          datosFormulario
        );
    
      } else if (msg === "9" || msg === "Para mujeres") {
    
        datosFormulario.categoriaR = "Para mujeres";
    
        step = 3;
    
        respuestaBot = bot(
          "Fabricamos diademas, peinillas y pulseras.\n\n¿Qué producto quiere comercializar?",
          [],
          step,
          datosFormulario
        );
    
      } else if (msg === "10" || msg === "Hogar - Aseo") {
    
        datosFormulario.categoriaR = "Hogar - Aseo";
    
        step = 3;
    
        respuestaBot = bot(
          "Somos fabricantes de botellas, copas, vasos, platos y anchetas.\n\n¿Qué producto quiere comercializar?",
          [],
          step,
          datosFormulario
        );
    
      } else if (msg === "11" || msg === "Juguetes") {
    
        datosFormulario.categoriaR = "Juguetes";
    
        step = 3;
    
        respuestaBot = bot(
          "¿Qué juguete quiere comercializar?",
          [],
          step,
          datosFormulario
        );
    
      } else {
    
        respuestaBot = bot(
          "Por favor seleccione una categoría válida.",
          [
            "7. Escolar",
            "8. Mascotas",
            "9. Para mujeres",
            "10. Hogar - Aseo",
            "11. Juguetes"
          ],
          step,
          datosFormulario
        );
    
      }
    
      break;

       case 1:
    
    if (msg === "7" || msg === "Alimentos") {
    
        datosFormulario.producto = "Alimentos";
    
    } else if (msg === "8" || msg === "Cosméticos") {
    
        datosFormulario.producto = "Cosméticos";
    
    } else if (msg === "9" || msg === "Farmacéuticos" || msg === "Farmaceúticos") {
    
        datosFormulario.producto = "Farmacéuticos";
    
    } else if (msg === "10" || msg === "Hogar - Aseo") {
    
        datosFormulario.producto = "Hogar - Aseo";
    
    } else {
    
        respuestaBot = bot(
            "Por favor seleccione una categoría válida.",
            [
                "7. Alimentos",
                "8. Cosméticos",
                "9. Farmacéuticos",
                "10. Hogar - Aseo"
            ],
            step,
            datosFormulario
        );
    
        break;
    }
    
    step = 2;
    
    respuestaBot = bot(
        "¿Qué producto vas a envasar?",
        [],
        step,
        datosFormulario
    );
    
    break;

    case 2:
       datosFormulario.producto = msg;

    step = 3;

    respuestaBot = bot(
        "¿Cuál es el contenido del envase?",
        [
            "11. 50 ml",
            "12. 100 ml",
            "13. 250 ml - 500 ml",
            "14. 1 litro",
            "15. Otro"
        ],
        step,
        datosFormulario
      );
      break;

      case 3:
        if (msg === "11") {
          datosFormulario.contenido = "50 ml";
      } else if (msg === "12") {
          datosFormulario.contenido = "100 ml";
      } else if (msg === "13") {
          datosFormulario.contenido = "250 ml - 500 ml";
      } else if (msg === "14") {
          datosFormulario.contenido = "1 litro";
      } else if (msg === "15") {
          datosFormulario.contenido = "Otro";
      } else {
          datosFormulario.contenido = msg;
      }
  
      step = 4;
  
      respuestaBot = bot(
          "Perfecto, a continuación le solicitamos su información.\n\n¿Cuál es su nombre?",
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
          "1. Envases industriales",
          "2. Productos de Merchandising | Promocional",
          "3. Retail, supermercados y misceláneas",
          "4. Otra solicitud"
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
