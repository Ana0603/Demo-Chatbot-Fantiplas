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
  if (!userState?.datosFormulario) {
    userState = {
      flow: "inicio",
      step: 0,
      datosFormulario: getInitialData()
    };
  }

    if (userState.step >= 4 && userState.step <= 10) {
    return await handleDatosFinales(userState, from, msg);
  }


   const { flow } = userState;  
    let response;  
    switch (flow) {
      case "inicio":
        response = handleInicio(userState, from, msg);
        break;  
      case "catalogos":
        response = handleCatalogos(userState, from, msg);
        break;  
      case "asesor":
        response = handleAsesor(userState, from, msg);
        break;  
      case "asesor_envases":
      case "asesor_merch":
      case "asesor_retail":
      case "asesor_otra":
        response = handleFlujoAsesor(userState, from, msg);
        break; 
      default:
        response = handleInicio(userState, from, msg);
    }  
    return response;
  }


  function handleInicio(state, from, msg) {
    let { step, datosFormulario } = state;
    let respuestaBot;
    switch (step) {

    // ===================== INICIO =====================

    case 0: {
      state.step = 50;
      respuestaBot = bot(
        `Gracias por contactarnos, soy FantiBot.        
        ¿En qué puedo ayudarle hoy?`,
        [
        "1. Consultar catálogos",
        "2. Asignar un asesor"
        ],
        state.step,
        datosFormulario
      );
      break;
    }    
    
    case 50: {
       if (msg === "1" || msg === "Consultar catálogos") {        
        state.flow = "catalogos";         
        state.step = 51;    
        respuestaBot = bot(
        `En Fantiplas contamos con tres lineas de negocio. Por favor, seleccione la línea de productos que desea consultar:`,
        [
        "1. Envases industriales",
        "2. Merchandising | Promocional",
        "3. Retail, supermercados y misceláneas",
        ],
        step,
        datosFormulario
        );
        userStates.set(from, state);          
        break;    
      }
    
      if (msg === "2" || msg === "Asignar un asesor") {
        state.flow = "asesor";
        state.step = 65;
        respuestaBot = bot(
          `Perfecto, Voy a asignarle un asesor especializado. Seleccione la categoría que mejor se ajusta al producto que busca:`,
          [
          "1. Envases industriales",
          "2. Productos de Merchandising | Promocional",
          "3. Retail, supermercados y misceláneas",
          "4. Otra solicitud"
          ],
          state.step,
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
        
        default:
          respuestaBot = bot(
            "Ocurrió un error. Reiniciando conversación...",
            [],
            0,
            getInitialData()
          );
    
          state.flow = "inicio";
          state.step = 0;
      }
    
      state.datosFormulario = datosFormulario;
      userStates.set(from, state);
    
      return respuestaBot;
    }

    // ===================== CATALOGOS =====================
      
    function handleCatalogos(state, from, msg) {   
      let { step, datosFormulario } = state;
      let respuestaBot;
    
      switch (step) {    
        case 51: {    
          const links = {
            "1": "https://drive.google.com/file/d/16uc184Ey2ulJV1Y0vC_IaFopTw3TEoY0/view?usp=sharing",
            "2": "https://drive.google.com/file/d/13FqKndQvMYinBS-x17B_bUIvi_nomh69/view?usp=sharing",
            "3": "https://drive.google.com/file/d/1GMo_q0VBOnytLEfWjO4ejRLqxSX1UdJ6/view?usp=sharing"
          };
    
          const link = links[msg];   
          if (!link) {
            respuestaBot = bot(
              "Seleccione una opción válida.",
              [
                "1. Envases industriales",
                "2. Merchandising | Promocional",
                "3. Retail, supermercados y misceláneas"
              ],
              step,
              datosFormulario
            );  
            break;
          }
    
          state.step = 52;
    
          respuestaBot = bot(
          `📚 Aquí tiene el catálogo solicitado.   
          ${link}\n\n    
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
          if (msg === "1") {    
            state.flow = "asesor";
            step = 65;
            respuestaBot = bot(
              "Perfecto, Voy a asignarle un asesor especializado. Seleccione la categoría que mejor se ajusta al producto que busca:",
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
    
          if (msg === "2") {    
            step = 51;  
            respuestaBot = bot(
              "Seleccione otro catálogo:",
              [
                "1. Envases industriales",
                "2. Merchandising | Promocional",
                "3. Retail, supermercados y misceláneas"
              ],
              step,
              datosFormulario
            );    
            break;
          }
    
          state.flow = "inicio";
          step = 0;
          datosFormulario = getInitialData();
    
          respuestaBot = bot(
            "Gracias por comunicarse con FANTIPLAS. ¡Que tenga un excelente día!",
            [],
            step,
            datosFormulario
          ); 
          break;
        }
    
        default: {   
          state.flow = "inicio";
          step = 0;    
          respuestaBot = bot(
            "Reiniciando conversación...",
            [],
            step,
            datosFormulario
          );  
        }    
      }
    
      state.step = step;
      state.datosFormulario = datosFormulario;    
      userStates.set(from, state);    
      return respuestaBot;    
    }
      
    // ===================== ASESOR =====================
      
    function handleAsesor(state, from, msg) {    
      let { step, datosFormulario } = state;
      let respuestaBot;    
      switch (step) {
    
        case 65: {    
          if (msg === "1") {   
            datosFormulario.lineaNegocio = "Envases industriales";
            state.flow = "asesor_envases";
            step = 100;  
          } else if (msg === "2") {    
            datosFormulario.lineaNegocio = "Productos de Merchandising | Promocional";
            state.flow = "asesor_merch";
            step = 200;    
          } else if (msg === "3") {    
            datosFormulario.lineaNegocio = "Retail, supermercados y misceláneas";
            state.flow = "asesor_retail";
            step = 300;   
          } else if (msg === "4") {    
            datosFormulario.lineaNegocio = "Otra solicitud";
            state.flow = "asesor_otra";
            step = 500;   
            respuestaBot = bot(
              "Escriba su solicitud y se la eniare al asesor correspondiente:",
              [],
              step,
              datosFormulario
            );  
            break;    
          } else {
    
            respuestaBot = bot(
              "Seleccione una opción válida.",
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
            "¿Cuál es el volumen de unidades que necesita?",
            [
              "5. Más de 1.000",
              "6. Menos de 1.000"
            ],
            step,
            datosFormulario
          );    
          break;
        }
    
        default:
    
          respuestaBot = bot(
            "RLo sentimos no se pudo responder a tu mensaje... Vuelve a intenrarlo en dos minutos, por favor.",
            [],
            0,
            getInitialData()
          );    
          state.flow = "inicio";
          step = 0;
    
      }    
      state.step = step;
      state.datosFormulario = datosFormulario;    
      userStates.set(from, state);   
      return respuestaBot;
    }

function handleFlujoAsesor(state, from, msg) {

    let { step, datosFormulario } = state;
    let respuestaBot;

    switch(step){
        
    // ===================== ENVASES =====================
        
    case 100: {
      const ok = [
        "5",
        "6",
        "Más de 1.000",
        "Menos de 1.000"
      ].includes(msg);
    
      if (!ok) {  
        respuestaBot = bot(
          "Seleccione una opción válida.",
          [
            "5. Más de 1.000",
            "6. Menos de 1.000"
          ],
          step,
          datosFormulario
        );  
        break;
      }  
      datosFormulario.cantidad =
        msg === "5" ? "Más de 1.000" : "Menos de 1.000";
    
      step = 101;  
      respuestaBot = bot(
        "En nuestra línea de envases trabajamos con las siguientes categorías. Seleccione la que se ajusta a su necesidad:",
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
        
    // Categorías
        
     case 101: {
      if (msg === "7") {    
        datosFormulario.categoria = "Alimentos";    
      } else if (msg === "8") {    
        datosFormulario.categoria = "Cosméticos";    
      } else if (msg === "9") {    
        datosFormulario.categoria = "Farmacéuticos";    
      } else if (msg === "10") {   
        datosFormulario.categoria = "Hogar - Aseo";    
      } else {
    
        respuestaBot = bot(
          "Seleccione una categoría válida.",
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
    
      step = 102;   
      respuestaBot = bot(
        "¿Cuál es el contenido que va a envasar?",
        [],
        step,
        datosFormulario
      );   
      break;
    }
        
    // Capacidad
        
   case 102: {
    datosFormulario.producto = msg;
      step = 103;    
      respuestaBot = bot(
        "¿Cuál es la capacidad del envase que requiere?",
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
        
      case 103: {     
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
          "Perfecto. Ahora necesitamos algunos datos para que un asesor se comunique con usted.\n\n¿Cuál es su nombre y apellido?",
          [],
          step,
          datosFormulario
        );      
        break;
      }        

    // ===================== MERCH =====================

     case 200: {
        const ok = [
          "5",
          "6",
          "Más de 1.000",
          "Menos de 1.000"
        ].includes(msg);
      
        if (!ok) {    
          respuestaBot = bot(
            "Seleccione una opción válida.",
            [
              "5. Más de 1.000",
              "6. Menos de 1.000"
            ],
            step,
            datosFormulario
          );   
          break;
        }
      
        datosFormulario.cantidad =
          msg === "5" ? "Más de 1.000" : "Menos de 1.000";   
        step = 201;   
        respuestaBot = bot(
          "Tenemos la capacidad de personalizar productos de diferentes categorías. ¿Cuál es la que más se ajusta a su necesidad?",
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
        break;
      }
        
    // Categorías
      case 201: {
      if (msg === "7") {    
        datosFormulario.categoriaP = "Escolar";   
      } else if (msg === "8") {    
        datosFormulario.categoriaP = "Mascotas";    
      } else if (msg === "9") {    
        datosFormulario.categoriaP = "Para mujeres";    
      } else if (msg === "10") {    
        datosFormulario.categoriaP = "Hogar - Aseo";    
      } else if (msg === "11") {  
        datosFormulario.categoriaP = "Juguetes";    
      } else {    
        respuestaBot = bot(
          "Seleccione una categoría válida.",
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
    
        break;
      }
    
      step = 202;    
      respuestaBot = bot(
        "Por favor, escriba los productos que mas le interecen comercializar de esta categoría",
        [],
        step,
        datosFormulario
      );   
      break;
    }

    // Producto
    case 202: {
    datosFormulario.productoP = msg;
    step = 4;
    respuestaBot = bot(
      "Perfecto. Ahora necesitamos algunos datos para que un asesor se comunique con usted.\n\n¿Cuál es su nombre y apellido?",
      [],
      step,
      datosFormulario
    );  
    break;
  }

    // ===================== RETAIL =====================
    case 300: {    
      const ok = ["5", "6", "Más de 1.000", "Menos de 1.000"].includes(msg);   
      if (!ok) {
        respuestaBot = bot(
          "Seleccione una opción válida",
          ["5. Más de 1.000", "6. Menos de 1.000"],
          step,
          datosFormulario
        );
        break;
      }
    
      datosFormulario.cantidad =
        msg === "5" ? "Más de 1.000" : "Menos de 1.000";
    
      step = 301;    
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
      break;
    }
    
    case 301: {    
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
        break;
      }
    
      step = 302;
    
      respuestaBot = bot(
        "¿Qué producto desea comercializar?",
        [],
        step,
        datosFormulario
      );   
      break;
    }
    
    case 302: {    
      datosFormulario.productoR = msg;    
      step = 4;
    
      respuestaBot = bot(
        "Perfecto. Ahora necesitamos algunos datos para que un asesor se comunique con usted.\n\n¿Cuál es su nombre y apellido?",
        [],
        step,
        datosFormulario
      ); 
      break;
    }

    // ===================== OTRA SOLICITUD =====================

    case 500: {
    
      datosFormulario.otraSolicitud = msg;
    
      step = 4;
    
      respuestaBot = bot(
        "Perfecto. Ahora necesitamos algunos datos para que un asesor se comunique con usted.\n\n¿Cuál es su nombre y apellido?",
        [],
        step,
        datosFormulario
      );
    
      break;
    }

    default: {   
              state.flow = "inicio";
              step = 0;    
              respuestaBot = bot(
                "Reiniciando conversación...",
                [],
                
                step,
                datosFormulario
              );  
            }    
          }
        
          state.step = step;
          state.datosFormulario = datosFormulario;    
          userStates.set(from, state);    
          return respuestaBot;    
        }
             
    // ===================== DATOS FINALES =====================

    async function handleDatosFinales(userState, from, msg) {
      let { step, datosFormulario } = userState;
      let respuestaBot;
    
      switch (step) {    
        case 4:
          datosFormulario.nombre = msg;
          step = 5;    
          respuestaBot = bot(
            "¿Cuál es el nombre de su empresa?",
            [],
            step,
            datosFormulario
          );
          break;
    
        case 5:
          datosFormulario.empresa = msg;
          step = 6;
          respuestaBot = bot(
            "Si desea que el asesor lo llame digite su número de celular, de lo contrario escriba: NO",
            [],
            step,
            datosFormulario
          );
          break;
    
        case 6:
          if (msg.toUpperCase() !== "NO" && !esTelefonoValido(msg)) {
          return bot(
              "Ingrese un número válido o escriba NO.",
              [],
              step,
              datosFormulario
          );
      }
      
      datosFormulario.telefono = msg.toUpperCase() === "NO" ? "" : msg;
          step = 7;    
          respuestaBot = bot(
            "¿En qué ciudad se encuentra?",
            [],
            step,
            datosFormulario
          );
        
          break;
    
        case 7:
          datosFormulario.ciudad = msg;
          step = 10;   
          respuestaBot = bot(
            "Por favor, digite su correo:",
            [],
            step,
            datosFormulario
          );
          break;
    
        case 10:    
          if (!esEmailValido(msg)) {
            return bot(
              "Correo inválido. Por favor ingréselo nuevamente.",
              [],
              step,
              datosFormulario
            );
          }    
          datosFormulario.email = msg;
          step = 8;  
          respuestaBot = bot(
            "Queremos conocerlo mejor. Comparta su página web o redes sociales:",
            [],
            step,
            datosFormulario
          );
          break;
    
        case 8:   
          datosFormulario.web = msg;
          await fetch("https://hook.us2.make.com/8p85rcjm949d0xp0d0buu25jeyabihoj", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(datosFormulario)
          });
    
          const nombre = datosFormulario.nombre;    
          // Reiniciar conversación
          userState.flow = "inicio";
          userState.step = 0;
          userState.datosFormulario = getInitialData();
    
          userStates.set(from, userState);  
          return bot(
            `Perfecto ${nombre}, un asesor se contactará contigo en un plazo máximo de 3 horas. Gracias por usar nuestro servicio.`,
            [],
            0,
            getInitialData()
          );
      }
    
      userState.step = step;
      userState.datosFormulario = datosFormulario;
    
      userStates.set(from, userState);
    
      return respuestaBot;
    }
