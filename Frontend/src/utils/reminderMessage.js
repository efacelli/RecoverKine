export function buildReminderMessage(patient) {
  const { nombre, sesionesRestantes } = patient;

  if (sesionesRestantes <= 0) {
    return `Hola, ${nombre}. ¿Como estas? Te informamos que tu autorizacion de sesiones de kinesiologia en Recover ha finalizado. Sera necesario gestionar una nueva autorizacion con tu obra social para poder continuar con el tratamiento. Muchas gracias.`;
  }

  return `Hola, ${nombre}. ¿Como estas? Te informamos que actualmente te quedan ${sesionesRestantes} sesion${sesionesRestantes === 1 ? '' : 'es'} disponible${sesionesRestantes === 1 ? '' : 's'} de kinesiologia en Recover. Cuando finalicen sera necesario gestionar una nueva autorizacion con tu obra social para poder continuar con el tratamiento. Muchas gracias.`;
}
