export const normalizarTexto = (texto) => {
    if (!texto) return ''; // Manejar valores undefined o null
    return texto.toLowerCase().replace(/[^a-z0-9\s]/gi, '').trim();
};

