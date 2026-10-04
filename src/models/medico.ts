export interface MedicoCrudo {
  id?: string | number;
  nombre?: string;
  especialidad?: string;
  disponible?: string | number | boolean;
}

export interface Medico {
  id: number;
  nombre: string;
  especialidad: string;
  disponible: boolean;
}
