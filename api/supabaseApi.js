export async function getEstado(telefono) {
  const { data, error } = await supabase
    .from("estados_chatbot")
    .select("*")
    .eq("telefono", telefono)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return {
      ok: false,
      estado: null
    };
  }

  return {
    ok: true,
    estado: {
      flow: data.flow,
      step: data.step,
      datosFormulario: data.datos
    }
  };
}
