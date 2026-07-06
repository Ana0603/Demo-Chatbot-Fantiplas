const MAKE_WEBHOOK = "https://hook.us2.make.com/i3eso5pu0c6htbqrb9t9kiggq33tj6v9";

export async function getEstado(telefono) {
  const response = await fetch(MAKE_WEBHOOK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      accion: "get",
      telefono
    })
  });

  if (!response.ok) {
    throw new Error(`Error consultando estado: ${response.status}`);
  }

  return await response.json();
}

export async function saveEstado(telefono, estado) {
  const response = await fetch(MAKE_WEBHOOK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      accion: "save",
      telefono,
      estado
    })
  });

  if (!response.ok) {
    throw new Error(`Error guardando estado: ${response.status}`);
  }

  return await response.json();
}

export async function deleteEstado(telefono) {
  const response = await fetch(MAKE_WEBHOOK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      accion: "delete",
      telefono
    })
  });

  if (!response.ok) {
    throw new Error(`Error eliminando estado: ${response.status}`);
  }

  return await response.json();
}
