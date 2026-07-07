const MAKE_WEBHOOK = "https://hook.us2.make.com/i3eso5pu0c6htbqrb9t9kiggq33tj6v9";

async function llamarMake(datos, esperarJson = false) {
  console.log("Enviando a Make:", JSON.stringify(datos, null, 2));
  const response = await fetch(MAKE_WEBHOOK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datos)
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}`);
  }

  if (esperarJson) {
    const texto = await response.text();

console.log("RESPUESTA DE MAKE:");
console.log(texto);

try {
  return JSON.parse(texto);
} catch (e) {
  console.log("No era JSON");
  return {
    ok: false,
    raw: texto
  };
}
  }

  return true;
}

export async function getEstado(telefono) {
  return llamarMake({
    accion: "get",
    telefono
  }, true);
}

export async function saveEstado(telefono, estado) {
  console.log("=== SAVE ===");
  console.log("Telefono:", telefono);
  console.log("Estado:", estado);

  return llamarMake({
    accion: "save",
    telefono,
    estado: JSON.stringify(estado)
  });
}

export async function deleteEstado(telefono) {
  return llamarMake({
    accion: "delete",
    telefono
  });
}
