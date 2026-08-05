// Pegar esto en Google Apps Script (Extensiones → Apps Script)
// Luego: Implementar → Nueva implementación → Aplicación web
// Ejecutar como: Yo | Quién tiene acceso: Cualquier persona
// Copia la URL y pégala en VITE_SHEETS_URL del .env

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
      data.nombre    || '',
      data.empresa   || '',
      data.cargo     || '',
      data.email     || '',
      data.whatsapp  || '',
      Array.isArray(data.desafio) ? data.desafio.join(', ') : (data.desafio || ''),
      data.sector    || '',
      data.equipo    || '',
      data.presupuesto || '',
      data.urgencia  || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Para probar manualmente desde el editor:
function testPost() {
  var fake = {
    postData: {
      contents: JSON.stringify({
        nombre: 'Carlos Rodríguez',
        empresa: 'Empresa Test — CTO',
        email: 'carlos@test.com',
        whatsapp: '+57 300 000 0000',
        desafio: ['Implementar IA en mis procesos'],
        sector: 'Fintech / Banca',
        equipo: '6 – 20',
        presupuesto: '$20K – $100K USD',
        urgencia: 'Próximo trimestre',
      })
    }
  };
  Logger.log(doPost(fake).getContent());
}
