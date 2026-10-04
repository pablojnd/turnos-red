import { readFile, writeFile } from 'node:fs/promises';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface Usuario {
  id: number;
  nombre: string;
  password: string;
  rol: string;
}

let usuarios: Usuario[] = [];
let rutaActual = './data/usuarios.json';

export async function cargarUsuarios(rutaArchivo: string): Promise<void> {
  rutaActual = rutaArchivo;
  try {
    const contenido = await readFile(rutaArchivo, 'utf8');
    usuarios = JSON.parse(contenido) as Usuario[];
  } catch {
    usuarios = [];
  }
}

async function guardarUsuarios(): Promise<void> {
  await writeFile(rutaActual, JSON.stringify(usuarios, null, 2));
}

export async function registrarUsuario(datos: {
  nombre: string;
  password: string;
  rol?: string;
}): Promise<Omit<Usuario, 'password'> | null> {
  if (usuarios.some((u) => u.nombre === datos.nombre)) return null;

  const maxId = usuarios.reduce((max, u) => (u.id > max ? u.id : max), 0);
  const usuario: Usuario = {
    id: maxId + 1,
    nombre: datos.nombre,
    password: await bcrypt.hash(datos.password, 10),
    rol: datos.rol ?? 'user',
  };

  usuarios.push(usuario);
  await guardarUsuarios();
  return { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol };
}

export async function loginUsuario(datos: {
  nombre: string;
  password: string;
}): Promise<string | null> {
  const usuario = usuarios.find((u) => u.nombre === datos.nombre);
  if (!usuario) return null;

  const valido = await bcrypt.compare(datos.password, usuario.password);
  if (!valido) return null;

  return jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    process.env.JWT_SECRET ?? '',
    { expiresIn: '2h' },
  );
}
