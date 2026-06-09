/* FORMULARIO SELECCIÓN ENVASES INDUSTRIALES */

let step = 0;

let respuestaBot = null;

let ultimoComercialRetail = 1;

let datosFormulario = {

    lineaNegocio: "",
    cantidad: "",
    OtraSolicitud: "",


    /* ENVASES */
    producto: "",
    contenido: "",
    categoria: "",

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
    telefono: "",
    ciudad: "",
    email: "",
    comercial: "",
    web: ""

};

function enviarLead() {

    fetch("https://hook.us2.make.com/hvl1sunf2xk4tq4mbkiwwvnndgk0s77q", {

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
            empresa: datosFormulario.empresa || "",

        })

    })

    .then(response => response.text())
    .then(data => {
        console.log("Lead enviado:", data);
    })

    .catch(error => {
        console.error("Error:", error);
    });

}

/* ========================= */
/* HANDLE RESPONSE */
/* ========================= */

function handleResponse(msg) {
    
    respuestaBot = null;

    switch(step) {

        case 0:
            
        step = 65;

        return bot(
             "Hola, soy FantiBot, el asistente de Fantiplas.\n\nLe presento nuestras líneas de negocio, por favor seleccione la que más se ajusta a su necesidad.",
                 [
                    "Envases industriales",
                    "Productos de Merchandising | Promocional",
                    "Retail, supermercados y misceláneas",
                    "Otra solicitud"
                ]
            );
            break;
            
            case 65:

            if (msg === "Envases industriales") {
        
                datosFormulario.lineaNegocio = msg;
                step = 100;
        
                return bot(
                    "¿Cuál es el volumen de unidades que requiere?",
                    [
                        "Más de 1.000",
                        "Menos de 1.000"
                    ]
                );
            }
        
            if (msg === "Productos de Merchandising | Promocional") {
        
                datosFormulario.lineaNegocio = msg;
                step = 101;
        
                return bot(
                    "¿Cuál es el volumen de unidades que requiere?",
                    [
                        "Más de 1.000",
                        "Menos de 1.000"
                    ]
                );
            }
        
            if (msg === "Retail, supermercados y misceláneas") {
        
                datosFormulario.lineaNegocio = msg;
                step = 102;
        
                return bot(
                    "¿Cuál es el volumen de unidades que requiere?",
                    [
                        "Más de 1.000",
                        "Menos de 1.000"
                    ]
                );
            }
        
            if (msg === "Otra solicitud") {
        
                datosFormulario.OtraSolicitud = msg;
                step = 500;
        
                return bot(
                    "¿Cuál es el volumen de unidades que requiere?",
                    [
                        "Más de 1.000",
                        "Menos de 1.000"
                    ]
                );
            }
        
        break;
        case 100:
        
            datosFormulario.cantidad = msg;
        
            step = 1;

            return bot("En nuestra línea de envases trabajamos con las siguientes categorías",
                    ["Alimentos", "Cosméticos", "Farmaceúticos", "Hogar - Aseo"]
                );

        break;

        case 101:

            datosFormulario.cantidad = msg;
        
            step = 200;

            return bot("¿Qué tipo de producto quiere personalizar?",
                ["Escolar", "Mascotas", "Para mujeres", "Hogar - Aseo", "Juguetes"]
               );
        
        break;

        case 102:
        
            datosFormulario.cantidad = msg;
        
            step = 300;
        
             return bot("¿Qué tipo de producto quiere comercializar?",
                ["Escolar", "Mascotas", "Para mujeres", "Hogar - Aseo", "Juguetes"]
               );
        
        break;

        /* ========================= */
        /* CATEGORÍAS ENVASES*/
        /* ========================= */

        case 1:

            if (msg === "Alimentos") {

                datosFormulario.producto = msg;

                step = 2;

                return bot("¿Qué producto vas a envasar?",);
            }

            if (msg === "Cosméticos") {

                datosFormulario.producto = msg;

                step = 2;

                return bot("¿Qué producto vas a envasar?",);

            }

            if (msg === "Farmaceúticos") {

                datosFormulario.producto = msg;

                step = 2;

                return bot("¿Qué producto vas a envasar?");

            }

            if (msg === "Hogar - Aseo") {

                datosFormulario.producto = msg;

                step = 2;

                return bot("¿Qué producto vas a envasar?");
            }

        break;

        case 2:

                datosFormulario.contenido = msg;

                step = 3;

                return bot(
                    "¿Cuál es el contenido del envase?",
                    ["50 ml", "100 ml", "250 ml, 500 ml", "1 litro", "Otro"]
                    );
    
        break;
        
        case 3:

            datosFormulario.modelo = msg;

            step = 4;

            return bot("Perfecto, a continuacion le solicitamos su informacion para que sea contactado por un representante comercial.");

        break;

        /* ========================= */
        /* FORMULARIO ENVASES */
        /* ========================= */

        case 4:

            datosFormulario.nombre = msg;

            step = 5;

            return bot("¿En que empresa trabaja?");

        case 5:

            datosFormulario.empresa = msg;

            step = 6;

            return bot("Si quiere que lo llamemos o contactemos por whatsapp, escriba su número");

        break;

        case 6:

            datosFormulario.telefono = msg;

            step = 7;

            return bot("¿Cuál la ciudad en donde se realizaria el despacho?");

        break;

        case 7:

            datosFormulario.ciudad = msg;

            step = 10;

            return bot("¿Cuál es su correo electrónico?");

        break;

        case 10:

            datosFormulario.email = msg;

            step = 8;

            return bot("Queremos conocerlo mejor. Por favor, compartanos su página web o redes sociales comerciales");

        break;

        case 8:

            datosFormulario.web = msg;

            enviarLead();

            return bot(
                `Perfecto ${datosFormulario.nombre}, acabamos de asignarle un asesor comercial enfocado en su necesidad, se pondrá en contacto con usted en un plazo máxino de 3 horas.`
            );

            enviarLead();

        break;

        /* ========================= */
        /* CATEGORÍAS MERCHANDISIGN*/
        /* ========================= */

        case 200:

            datosFormulario.categoriaP = msg;

            if (msg === "Escolar") {

                datosFormulario.productoP = msg;

                step = 3;

                return bot("Tenemos la capacidad para fabricar desde reglas, estuches, loncheras y más ¿Qué producto quiere personalizar?");
            }

            if (msg === "Mascotas") {

                datosFormulario.productoP = msg;

                step = 3;

                return bot("Podremos personalizar botellas y platos ¿Qué producto quiere personalizar?");
            }

            if (msg === "Para mujeres") {

                datosFormulario.productoP = msg;

                step = 3;

                return bot("Personalizamos diademas peinillas y pulseras ¿Qué producto quiere personalizar?");
            }

            if (msg === "Hogar") {

                datosFormulario.productoP = msg;

                step = 3;

                return bot("Personalizamos botellas, copas, vasos, platos, anchetas ¿Qué producto quiere personalizar?");
            }

            if (msg === "Juguetes") {

                datosFormulario.productoP = msg;

                step = 3;

                return bot("Por favor escriba el juguete que quiere personalizar");

            }
            
        break;

        /* ========================= */
        /* CATEGORÍAS RETAIL*/
        /* ========================= */

        case 300:

            datosFormulario.categoriaR = msg;

            if (msg === "Escolar") {

                datosFormulario.producto = msg;

                step = 3;

                return bot("Tenemos la capacidad para fabricar desde reglas, estuches, loncheras y más ¿Qué producto quiere comercializar?");
            }

            if (msg === "Mascotas") {

                datosFormulario.productoR = msg;

                step = 3;

                return bot("Somos fabricantes de botellas y platos para mascotas ¿Qué producto quiere comercializar?");
            }

            if (msg === "Para mujeres") {

                datosFormulario.productoR = msg;

                step = 3;

                return bot("Fabricamos diademas peinillas y pulseras ¿Qué producto quiere comercializar?");

            }

            if (msg === "Hogar") {

                datosFormulario.productoR = msg;

                step = 3;

                return bot("Somos fabricantes de botellas, copas, vasos, platos, anchetas ¿Qué producto quiere comercializar?");
            }

            if (msg === "Juguetes") {

                datosFormulario.productoR = msg;

                step = 3;

                return bot("Por favor escriba el juguete que quiere comercializar");

            }
        break;

         case 500:

            datosFormulario.solicitud = msg;
        
            step = 4;
        
            return bot(
                "Perfecto, hemos registrado su solicitud. Ahora necesitamos algunos datos para que un asesor pueda contactarlo."
            );
        
        break;
    }
    
    return respuestaBot;

}    
        /* BOT */
        function bot(text, options = []) {
        respuestaBot = {
            text,
            options,
            step,
            datosFormulario
            };
        return respuestaBot;
        };
