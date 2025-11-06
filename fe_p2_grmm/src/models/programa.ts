import type { NivelAcademico } from './nivel-academico'

export type EstadoPrograma = 'En Planificación' | 'En curso' | 'Finalizado'

export interface Programa {
  id: number
  idNivelAcademico: number
  descripcion: string
  nombre: string
  version: number
  duracionMeses: number
  costo: number 
  fechaInicio: Date 
  estado: EstadoPrograma
  nivelAcademico?: NivelAcademico
}
