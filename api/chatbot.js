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

  console.log("Usuario:", from);
console.log("Estado antes:", userStates.get(from));
  
  let userState = userStates.get(from);

  if (!userState) {
    userState = { step: 0, datosFormulario: getInitialData() };
  }

  let { step, datosFormulario } = userState;
  let respuestaBot = null;

  switch (step) {

    // ===================== INICIO =====================

    case 0: {
      step = 50;
      respuestaBot = bot(
        `Gracias por contactarnos, soy FantiBot.  
        
        ¿En qué puedo ayudarle hoy?`,
        [
        "1. Consultar catálogos",
        "2. Asignar un asesor"
        ],
        step,
        datosFormulario
      );
      break;
    }
    
    
    case 50: {
       if (msg === "1" || msg === "Consultar catálogos") {
    
        step = 51;
    
        respuestaBot = bot(
        `En Fantiplas contamos con tres lineas de negocios. Por favor, seleccione la línea de productos que desea consultar:`,
        [
        "1. Envases industriales",
        "2. Merchandising | Promocional",
        "3. Retail, supermercados y misceláneas",
        ],
        step,
        datosFormulario
        );
          break;
    
      }
    
      if (msg === "2" || msg === "Asignar un asesor") {
    
          step = 65;
    
          respuestaBot = bot(
          `Perfecto, Voy a asignarle un asesor especializado. Seleccione la categoría que mejor se ajusta al producto que busca:`,
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
    
      respuestaBot = bot(
      "Seleccione una opción válida.",
      [
      "1. Consultar catálogos",
      "2. Asignar un asesor"
      ],
      step,
      datosFormulario
      );
      
      break;
      
      }

    // ===================== CATALOGOS =====================

      case 51: {
        
      let enlaceCatalogo = "";

      if(msg=="1"){
      
      enlaceCatalogo = "https://drive.google.com/file/d/12D_XJXK7d06juB8sZB4c6SRw2aRDp3_U/view?usp=sharing";
      
      }
      
      else if(msg=="2"){
      
      enlaceCatalogo = "https://drive.google.com/file/d/1Jp4j2J8OSO8IBEuOTkSqHKHsEvCOb5T8/view?usp=drive_link";
      
      }
      
      else if(msg=="3"){
      
      enlaceCatalogo = "https://drive.google.com/file/d/113PpdO_cisYxGQ2CE58Z_JHevfxgmFBM/view?usp=sharing";
      
      }
      
      else{
      
          respuestaBot = bot(
      "Seleccione una opción válida.",
      [
      "1. Envases industriales",
      "2. Merchandising",
      "3. Retail"
      ],
      step,
      datosFormulario
      );
      
      break;
      
      }
      
      step = 52;
      
      respuestaBot = bot(
      
      `📚 Aquí tiene el catálogo solicitado.

      ${enlaceCatalogo}

      Revíselo con tranquilidad. Si encuentra el producto que necesita, con gusto prepararemos una cotización personalizada.
      
      ¿Desea realizar una cotización?`,
      
      [
      "1. Sí",
      "2. Ver otro catálogo",
      "3. Finalizar conversación"
      ],
      
      step,
      
      datosFormulario
      
      );
      
      break;
      
      }

      case 52: {

  if (msg == "1") {

    step = 65;

    respuestaBot = bot(
      "Perfecto. Seleccione la categoría:",
      [
        "1. Envases industriales",
        "2. Productos de Merchandising | Promocional",
        "3. Retail, supermercados y misceláneas"
      ],
      step,
      datosFormulario
    );

    break;
  }

  if (msg == "2") {

    step = 51;

    respuestaBot = bot(
      "Seleccione otro catálogo:",
      [
        "1. Envases industriales",
        "2. Merchandising",
        "3. Retail"
      ],
      step,
      datosFormulario
    );

    break;
  }

  userStates.set(from, {
    step: 0,
    datosFormulario: getInitialData()
  });

  return bot(
    "Gracias por comunicarse con FANTIPLAS. ¡Que tenga un excelente día!",
    [],
    0,
    getInitialData()
  );
}

    // ===================== LINEA NEGOCIO =====================
    case 65: {
      if (msg === "1" || msg === "Envases industriales") {
        datosFormulario.lineaNegocio = "Envases industriales";
        step = 100;
      } else if (msg === "2" || msg === "Productos de Merchandising | Promocional") {
        datosFormulario.lineaNegocio = "Productos de Merchandising | Promocional";
        step = 101;
      } else if (msg === "3" || msg === "Retail, supermercados y misceláneas") {
        datosFormulario.lineaNegocio = "Retail, supermercados y misceláneas";
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
        "¿Cuál es el volumen de unidades que necesita?",
        ["5. Más de 1.000", "6. Menos de 1.000"],
        step,
        datosFormulario
      );
      break;
    }

      case 1: {
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
      "Seleccione una categoría válida",
      ["7. Alimentos", "8. Cosméticos", "9. Farmacéuticos", "10. Hogar - Aseo"],
      step,
      datosFormulario
    );
    break;
  }

  step = 2;

  respuestaBot = bot(
    "¿Cual es el contenido que va a envasar?",
    [],
    step,
    datosFormulario
  );

  break;
}

      case 2: {
  datosFormulario.producto = msg;

  step = 3;

  respuestaBot = bot(
    "¿Cuál es la cantidad que requiere para el envase?",
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
}

      case 3: {
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
    "Perfecto, a continuación le solicitamos su información para que el asesor se comunique con usted.\n\n¿Cuál es su nombre y apellido?",
    [],
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
        "En nuestra línea de envases trabajamos con las siguientes categorías. Seleccione la que se ajusta a su necesidad:",
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

      case 200: {

  if (msg === "7" || msg === "Escolar") {
    datosFormulario.categoriaP = "Escolar";
  } else if (msg === "8" || msg === "Mascotas") {
    datosFormulario.categoriaP = "Mascotas";
  } else if (msg === "9" || msg === "Para mujeres") {
    datosFormulario.categoriaP = "Para mujeres";
  } else if (msg === "10" || msg === "Hogar - Aseo") {
    datosFormulario.categoriaP = "Hogar - Aseo";
  } else if (msg === "11" || msg === "Juguetes") {
    datosFormulario.categoriaP = "Juguetes";
  } else {
    respuestaBot = bot(
      "Seleccione una categoría válida",
      ["7. Escolar", "8. Mascotas", "9. Para mujeres", "10. Hogar - Aseo", "11. Juguetes"],
      step,
      datosFormulario
    );
    break;
  }

  step = 3;

  respuestaBot = bot(
    "Por favor escriba los productos especificos de esa categoría que quiere personalizar",
    [],
    step,
    datosFormulario
  );

  break;
}

      case 300: {

  if (msg === "7" || msg === "Escolar") {
    datosFormulario.categoriaR = "Escolar";
  } else if (msg === "8" || msg === "Mascotas") {
    datosFormulario.categoriaR = "Mascotas";
  } else if (msg === "9" || msg === "Para mujeres") {
    datosFormulario.categoriaR = "Para mujeres";
  } else if (msg === "10" || msg === "Hogar - Aseo") {
    datosFormulario.categoriaR = "Hogar - Aseo";
  } else if (msg === "11" || msg === "Juguetes") {
    datosFormulario.categoriaR = "Juguetes";
  } else {
    respuestaBot = bot(
      "Seleccione una categoría válida",
      ["7. Escolar", "8. Mascotas", "9. Para mujeres", "10. Hogar - Aseo", "11. Juguetes"],
      step,
      datosFormulario
    );
    break;
  }

  step = 3;

  respuestaBot = bot(
    "¿Qué producto desea comercializar?",
    [],
    step,
    datosFormulario
  );

  break;
}
      
    // ===================== DATOS FINALES =====================
    case 4: {
      datosFormulario.nombre = msg;
      step = 5;
      respuestaBot = bot("¿Cual es el nombre de su empresa?", [], step, datosFormulario);
      break;
    }

    case 5: {
      datosFormulario.empresa = msg;
      step = 6;
      respuestaBot = bot("Si desea que el asesor lo llame digite su número de celular, de lo contrario escriba: NO", [], step, datosFormulario);
      break;
    }

    case 6: {
      datosFormulario.telefono = msg;
      step = 7;
      respuestaBot = bot("¿En que ciudad se encuentra?:", [], step, datosFormulario);
      break;
    }

    case 7: {
      datosFormulario.ciudad = msg;
      step = 10;
      respuestaBot = bot("Por favor, digite su correo:", [], step, datosFormulario);
      break;
    }

    case 10: {
      if (!esEmailValido(msg)) {
        respuestaBot = bot("Correo inválido", [], step, datosFormulario);
        break;
      }

      datosFormulario.email = msg;
      step = 8;

      respuestaBot = bot("Queremos conocerlo mejor, nos ayuda compartiendo su Web o redes sociales:", [], step, datosFormulario);
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
        `Perfecto ${datosFormulario.nombre}, un asesor se contactará contigo en un plazo máximo de 3 horas.`,
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

  console.log("Estado guardado:", userStates.get(from));
  
  return respuestaBot;
}
