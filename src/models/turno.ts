export interface TurnoCrudo {
  id?: string | number;
  paciente?: string;
  documento?: string | number;
  especialidad?: string;
  fecha?: string;
  hora?: string;
  confirmado?: string | number | boolean;
  observaciones?: string;
}

export interface Turno {
  id: number;
  paciente: string;
  documento: string;
  especialidad: string;
  fecha: string;
  hora: string;
  confirmado: boolean;
  observaciones?: string;
}
