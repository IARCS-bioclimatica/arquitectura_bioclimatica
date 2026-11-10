const PRIVATE_FOLDER_ID = 'REPLACE_WITH_PRIVATE_DRIVE_FOLDER_ID';
const ACCESS_STATUS_HEADER = 'Estado de acceso a la carpeta';

function installFormSubmitTrigger() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error('Abre este proyecto de Apps Script desde la hoja de respuestas.');
  }

  const triggerExists = ScriptApp.getProjectTriggers().some(trigger =>
    trigger.getHandlerFunction() === 'grantFolderAccessOnSubmit' &&
    trigger.getEventType() === ScriptApp.EventType.ON_FORM_SUBMIT
  );

  if (!triggerExists) {
    ScriptApp.newTrigger('grantFolderAccessOnSubmit')
      .forSpreadsheet(spreadsheet)
      .onFormSubmit()
      .create();
  }
}

function grantFolderAccessOnSubmit(event) {
  if (!event || !event.namedValues || !event.range) {
    throw new Error('Esta función debe ejecutarse mediante el activador de envío del formulario.');
  }
  if (PRIVATE_FOLDER_ID === 'REPLACE_WITH_PRIVATE_DRIVE_FOLDER_ID') {
    throw new Error('Configura PRIVATE_FOLDER_ID con el identificador de la carpeta privada.');
  }

  const sheet = event.range.getSheet();
  const row = event.range.getRow();
  const statusColumn = getOrCreateStatusColumn_(sheet);
  let email;

  try {
    const emailHeader = Object.keys(event.namedValues).find(header => {
      const normalizedHeader = header.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return normalizedHeader.includes('correo electronico') ||
        normalizedHeader.includes('email address');
    });
    email = emailHeader && event.namedValues[emailHeader]
      ? String(event.namedValues[emailHeader][0]).trim()
      : '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('No se encontró un correo electrónico válido en la respuesta.');
    }

    const folder = DriveApp.getFolderById(PRIVATE_FOLDER_ID);
    folder.addViewer(email);
    sheet.getRange(row, statusColumn)
      .setValue(`Acceso de lector concedido: ${new Date().toLocaleString()}`);
  } catch (error) {
    sheet.getRange(row, statusColumn).setValue(`Error al compartir: ${error.message}`);
    throw error;
  }
}

function getOrCreateStatusColumn_(sheet) {
  const lastColumn = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0];
  const existingColumn = headers.indexOf(ACCESS_STATUS_HEADER);
  if (existingColumn !== -1) {
    return existingColumn + 1;
  }

  const statusColumn = lastColumn + 1;
  sheet.getRange(1, statusColumn).setValue(ACCESS_STATUS_HEADER);
  return statusColumn;
}
