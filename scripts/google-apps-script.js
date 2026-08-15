// ============================================================
// Saastreria — Webhook de leads v2
// Recibe datos del chat-bot y del formulario de diagnóstico,
// los guarda en el Sheet, notifica al equipo por correo y
// envía confirmación automática al lead.
//
// CÓMO ACTUALIZAR:
// 1. Abre script.google.com → selecciona el proyecto
// 2. Borra TODO el contenido y pega este archivo completo
// 3. Implementar → Administrar implementaciones → lápiz (editar)
//    → Versión: Nueva versión → Implementar
// 4. La URL del endpoint NO cambia
// ============================================================

var EQUIPO_EMAIL = 'cesarjimenezarcia@gmail.com'; // ← correo donde llegan los leads
var SHEET_NAME   = 'Leads';                  // ← nombre de la pestaña del Sheet

// ─── Entrada principal ────────────────────────────────────
function doPost(e) {
  try {
    var raw  = JSON.parse(e.postData.contents);
    var data = normalizar(raw);

    guardarEnSheet(data);
    notificarEquipo(data);
    confirmarLead(data);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─── 1. Normalizar campos (bot + formulario) ──────────────
function normalizar(raw) {
  var d = {};
  for (var key in raw) {
    var val = raw[key];
    d[key] = Array.isArray(val) ? val.join(', ') : String(val || '').trim();
  }
  d.timestamp = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });
  // Detectar fuente si no viene explícita
  if (!d.fuente) d.fuente = d.cargo ? 'bot' : 'formulario';
  // Unificar campo de teléfono
  d.contacto_tel = d.whatsapp || d.telefono || '';
  // Unificar campo de urgencia/prioridad
  d.urgencia_unified = d.urgencia || d.prioridad || '';
  return d;
}

// ─── 2. Guardar en Google Sheets ──────────────────────────
function guardarEnSheet(d) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    var headers = [
      'Fecha', 'Fuente', 'Nombre', 'Empresa', 'Cargo',
      'Email', 'WhatsApp / Tel', 'País', 'Sector',
      'Equipo', 'Presupuesto', 'Urgencia', 'Desafío'
    ];
    sheet.getRange(1, 1, 1, headers.length)
         .setValues([headers])
         .setFontWeight('bold')
         .setBackground('#0D1F3C')
         .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    d.timestamp,
    d.fuente,
    d.nombre        || '',
    d.empresa       || '',
    d.cargo         || '',
    d.email         || '',
    d.contacto_tel  || '',
    d.pais_codigo   || '',
    d.sector        || '',
    d.equipo        || '',
    d.presupuesto   || '',
    d.urgencia_unified || '',
    d.desafio       || '',
  ]);
}

// ─── 3. Email de alerta al equipo de ventas ───────────────
function notificarEquipo(d) {
  var nombre   = d.nombre  || 'Sin nombre';
  var empresa  = d.empresa || 'Sin empresa';
  var urgencia = d.urgencia_unified || '';

  var urgenciaLabel = urgencia.toLowerCase().indexOf('urgent') !== -1
    ? '🔴 URGENTE'
    : urgencia ? '⏱ ' + urgencia : '';

  var asunto = '🔔 Nuevo lead'
    + (urgenciaLabel ? ' ' + urgenciaLabel : '')
    + ' — ' + nombre + ' · ' + empresa;

  // WhatsApp clickeable
  var waLink = d.contacto_tel
    ? (d.contacto_tel.indexOf('wa.me') !== -1
        ? d.contacto_tel
        : 'https://wa.me/' + d.contacto_tel.replace(/\D/g, ''))
    : '';

  var filas = [
    ['Nombre',     nombre],
    ['Empresa',    empresa],
    ['Cargo',      d.cargo],
    ['Email',      d.email ? '<a href="mailto:' + d.email + '">' + d.email + '</a>' : ''],
    ['WhatsApp',   waLink  ? '<a href="' + waLink + '" style="color:#25D366;font-weight:600;">' + (d.whatsapp || d.telefono || waLink) + '</a>' : ''],
    ['País',       d.pais_codigo],
    ['Sector',     d.sector],
    ['Equipo',     d.equipo],
    ['Presupuesto',d.presupuesto],
    ['Urgencia',   urgencia],
    ['Fuente',     d.fuente === 'bot' ? 'Chat asistente' : 'Formulario /diagnostico/'],
    ['Hora',       d.timestamp],
  ].filter(function(f) { return f[1]; });

  var rows = filas.map(function(f) {
    return '<tr>'
      + '<td style="padding:9px 14px;font-size:12px;font-weight:600;color:#64748b;white-space:nowrap;background:#f8fafc;border-bottom:1px solid #e2e8f0;">' + f[0] + '</td>'
      + '<td style="padding:9px 14px;font-size:13px;color:#0f172a;border-bottom:1px solid #e2e8f0;">' + f[1] + '</td>'
      + '</tr>';
  }).join('');

  var desafioHtml = d.desafio
    ? '<div style="margin:20px 0;padding:16px 18px;background:#f0f4ff;border-left:4px solid #1B3461;border-radius:0 8px 8px 0;">'
      + '<p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#1B3461;text-transform:uppercase;letter-spacing:.06em;">Desafío / problema</p>'
      + '<p style="margin:0;font-size:14px;color:#0f172a;line-height:1.7;">' + d.desafio + '</p>'
      + '</div>'
    : '';

  var ctaWA = waLink
    ? '<a href="' + waLink + '" style="display:inline-block;margin-top:20px;padding:12px 26px;background:#25D366;color:white;text-decoration:none;border-radius:8px;font-weight:700;font-size:14px;">💬 Abrir WhatsApp ahora</a>'
    : '';

  var html = ''
    + '<div style="font-family:Inter,Arial,sans-serif;max-width:620px;margin:0 auto;">'
    + '  <div style="background:#0D1F3C;padding:24px 28px;border-radius:12px 12px 0 0;">'
    + '    <p style="margin:0;color:rgba(255,255,255,.5);font-size:11px;text-transform:uppercase;letter-spacing:.08em;">Saastreria · Diagnóstico nuevo</p>'
    + '    <h1 style="margin:8px 0 4px;color:white;font-size:22px;font-weight:800;">' + nombre + '</h1>'
    + '    <p style="margin:0;color:rgba(255,255,255,.65);font-size:14px;">' + empresa + (d.cargo ? ' · ' + d.cargo : '') + '</p>'
    + '  </div>'
    + '  <div style="background:white;padding:28px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:0;">'
    + desafioHtml
    + '    <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">'
    + rows
    + '    </table>'
    + ctaWA
    + '    <p style="margin-top:24px;font-size:12px;color:#94a3b8;line-height:1.5;">'
    + '      Lead recibido desde el ' + (d.fuente === 'bot' ? 'asistente de diagnóstico' : 'formulario de contacto') + ' de saastreria.cloud.'
    + '    </p>'
    + '  </div>'
    + '</div>';

  MailApp.sendEmail({ to: EQUIPO_EMAIL, subject: asunto, htmlBody: html });
}

// ─── 4. Email de confirmación al lead ─────────────────────
function confirmarLead(d) {
  if (!d.email) return;

  var primerNombre = (d.nombre || '').split(' ')[0] || 'Hola';

  var html = ''
    + '<div style="font-family:Inter,Arial,sans-serif;max-width:580px;margin:0 auto;">'
    + '  <div style="background:#0D1F3C;padding:28px 30px;border-radius:12px 12px 0 0;">'
    + '    <h1 style="margin:0 0 4px;color:white;font-size:20px;font-weight:800;">Recibimos tu solicitud</h1>'
    + '    <p style="margin:0;color:rgba(255,255,255,.6);font-size:13px;">Saastreria · Diagnóstico empresarial</p>'
    + '  </div>'
    + '  <div style="background:white;padding:30px 30px 36px;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:0;">'
    + '    <p style="margin:0 0 18px;font-size:15px;color:#0f172a;">Hola ' + primerNombre + ',</p>'
    + '    <p style="margin:0 0 16px;font-size:15px;color:#334155;line-height:1.75;">'
    + '      Ya recibimos la información que compartiste. Nuestro equipo revisará el contexto y te contactará para coordinar una conversación inicial.'
    + '    </p>'
    + '    <p style="margin:0 0 28px;font-size:15px;color:#334155;line-height:1.75;">'
    + '      Si quieres hablar antes o agregar algo más, escríbenos directamente por WhatsApp:'
    + '    </p>'
    + '    <a href="https://wa.me/573007244122" style="display:inline-block;padding:13px 28px;background:#0D1F3C;color:white;text-decoration:none;border-radius:8px;font-weight:700;font-size:14px;">'
    + '      Escribir por WhatsApp'
    + '    </a>'
    + '    <hr style="margin:28px 0;border:none;border-top:1px solid #e2e8f0;" />'
    + '    <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">'
    + '      Saastreria &nbsp;·&nbsp; '
    + '      <a href="https://saastreria.cloud" style="color:#94a3b8;">saastreria.cloud</a> &nbsp;·&nbsp; '
    + '      <a href="mailto:hola@saastreria.cloud" style="color:#94a3b8;">hola@saastreria.cloud</a>'
    + '    </p>'
    + '  </div>'
    + '</div>';

  MailApp.sendEmail({
    to:       d.email,
    subject:  primerNombre + ', recibimos tu solicitud — Saastreria',
    htmlBody: html,
    replyTo:  EQUIPO_EMAIL,
  });
}

// ─── Test manual (Ejecutar → testPost en el editor) ───────
function testPost() {
  var fake = {
    postData: {
      contents: JSON.stringify({
        nombre:     'Ana Pérez',
        empresa:    'TechCorp SAS',
        cargo:      'VP de Producto',
        email:      'ana@techcorp.co',
        whatsapp:   'https://wa.me/573104567890',
        desafio:    'Quiero conectar mi ERP con un asistente que responda preguntas de inventario en lenguaje natural.',
        sector:     'Tecnología / SaaS',
        equipo:     '6 – 20',
        presupuesto:'$20K – $100K USD',
        urgencia:   'Próximo trimestre',
        fuente:     'bot',
      })
    }
  };
  Logger.log(doPost(fake).getContent());
}
