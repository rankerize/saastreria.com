// ============================================================
// INSTRUCCIONES:
// 1. Abre la hoja → Extensiones → Apps Script
// 2. Borra TODO lo que hay y pega este archivo completo
// 3. Implementar → Administrar implementaciones → lápiz (editar)
//    → Versión: Nueva versión → Implementar
// 4. La URL NO cambia — no necesitas actualizar nada en Hostinger
// ============================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }),
      data.nombre      || '',
      data.empresa     || '',
      data.cargo       || '',
      data.email       || '',
      data.whatsapp    || '',   // llega como https://wa.me/57XXXXXXXXXX — clickeable
      Array.isArray(data.desafio) ? data.desafio.join(', ') : (data.desafio || ''),
      data.sector      || '',
      data.equipo      || '',
      data.presupuesto || '',
      data.urgencia    || '',
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

// Para probar manualmente desde el editor (Ejecutar → testPost):
function testPost() {
  var fake = {
    postData: {
      contents: JSON.stringify({
        nombre: 'Ana Pérez',
        empresa: 'TechCorp SAS',
        cargo: 'VP de Producto',
        email: 'ana@techcorp.co',
        whatsapp: 'https://wa.me/573104567890',
        desafio: ['Implementar IA en mis procesos', 'Integrar sistemas (ERP, CRM, etc.)'],
        sector: 'Tecnología / SaaS',
        equipo: '6 – 20',
        presupuesto: '$20K – $100K USD',
        urgencia: 'Próximo trimestre',
      })
    }
  };
  Logger.log(doPost(fake).getContent());
}
