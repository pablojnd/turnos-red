/*
Ejemplo equivalente usando callbacks (node:fs):

import fs from 'node:fs';

fs.readFile('./data/turnos.json', 'utf8', (error, contenido) => {
  if (error) {
    console.error(error);
    return;
  }

  const datos = JSON.parse(contenido);
  console.log(datos);
});

En el proyecto se usa node:fs/promises porque async/await deja el flujo
más simple de leer y permite manejar errores con try...catch.
*/

export {};
