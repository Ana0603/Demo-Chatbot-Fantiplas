function procesarMensaje(step, datosFormulario, msg){

```
switch(step){

    case 0:

        if(msg === "Envases industriales"){

            datosFormulario.lineaNegocio = msg;

            return {
                step:100,
                datosFormulario,
                respuesta:"¿Cual es el volumen de unidades que requiere?",
                opciones:["Más de 1.000","Menos de 1.000"]
            };
        }

        if(msg === "Productos de Merchandisign | Promocional"){

            datosFormulario.lineaNegocio = msg;

            return {
                step:101,
                datosFormulario,
                respuesta:"¿Cual es el volumen de unidades que requiere?",
                opciones:["Más de 1.000","Menos de 1.000"]
            };
        }

        if(msg === "Retail, supermercados y miselaneas"){

            datosFormulario.lineaNegocio = msg;

            return {
                step:102,
                datosFormulario,
                respuesta:"¿Cual es el volumen de unidades que requiere?",
                opciones:["Más de 1.000","Menos de 1.000"]
            };
        }

        if(msg === "Otra solicitud"){

            return {
                step:500,
                datosFormulario,
                respuesta:"¿Cual es el volumen de unidades que requiere?",
                opciones:["Más de 1.000","Menos de 1.000"]
            };
        }

        return {
            step:0,
            datosFormulario,
            respuesta:"Por favor seleccione una de las opciones disponibles."
        };

}
```

}
