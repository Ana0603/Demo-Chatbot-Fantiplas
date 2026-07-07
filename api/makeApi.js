const MAKE_WEBHOOK = "https://hook.us2.make.com/i3eso5pu0c6htbqrb9t9kiggq33tj6v9";

async function llamarMake(datos, esperarJson = false) {
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
    return await response.json();
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
