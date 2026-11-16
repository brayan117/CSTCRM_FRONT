export type RowValue = string | number | boolean | null | undefined;

export type Row = Record<string, RowValue>;

export type BadgeVariant = 'ok' | 'warn' | 'bad' | 'blue' | 'gray';

export type Dia = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes';

export interface Usuario {
  username: string;
  nombre: string;
  rol: string;
}

export interface Movil extends Row {
  id: string;
  placa: string;
  tipo: string;
  marca: string;
  modelo: string;
  cliente: string;
  estado: string;
  equipo: string;
  sim: string;
}

export interface Equipo extends Row {
  id: string;
  tipo: string;
  marca: string;
  serie: string;
  estado: string;
  movil: string;
}

export interface Simcard extends Row {
  id: string;
  operador: string;
  numero: string;
  plan: string;
  estado: string;
  movil: string;
}

export interface Tecnico extends Row {
  id: string;
  nombre: string;
  especialidad: string;
  estado: string;
  carga: number;
  telefono: string;
}

export interface Operacion extends Row {
  id: string;
  tipo: string;
  movil: string;
  tecnico: string;
  inicio: string;
  estado: string;
  avance: number;
  obs: string;
}

export interface HistorialItem extends Row {
  fecha: string;
  tipo: string;
  movil: string;
  tecnico: string;
  resultado: string;
  obs: string;
  subtipo?: string;
  equipo?: string;
  sim?: string;
}

export interface Evento {
  id: string;
  movil: string;
  fecha: string;
  tipo: string;
  titulo: string;
  desc: string;
  estado: 'ok' | 'warn' | 'bad';
}

export interface CitaSlot {
  t: string;
  c: string;
  movil: string;
  tecnico: string;
  equipo?: string;
  sim?: string;
}

export interface AgendaRow {
  hora: string;
  lunes: CitaSlot | null;
  martes: CitaSlot | null;
  miercoles: CitaSlot | null;
  jueves: CitaSlot | null;
  viernes: CitaSlot | null;
}

export interface Radio extends Row {
  id: string;
  tipo: string;
  marca: string;
  serial: string;
  cliente: string;
  estado: string;
}

export interface RadioOperacion extends Row {
  fecha: string;
  radio: string;
  tipo: string;
  detalle: string;
  estado: string;
}

export interface Canal extends Row {
  id: string;
  canal: string;
  categoria: string;
  calidad: string;
  estado: string;
}

export interface StreamOperacion extends Row {
  fecha: string;
  cuenta: string;
  tipo: string;
  detalle: string;
  estado: string;
}

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'strong' | 'muted' | 'badge' | 'chip';
  variant?: BadgeVariant;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

export interface TableAction {
  label: string;
  icon?: string;
}

export interface RowActionEvent {
  action: TableAction;
  row: Row;
}

export interface AgendaDay {
  key: Dia;
  label: string;
  sub: string;
}
