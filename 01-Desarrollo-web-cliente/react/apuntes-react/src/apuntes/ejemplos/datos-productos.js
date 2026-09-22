// ============================================================
// ejemplos/datos-productos.js — datos para Lección 05
// ============================================================
// Solo DATOS: no hay componentes aquí. Todo esto son "named exports"
// (con nombre fijo), así que al importarlos van entre llaves:
//   import { productos } from './datos-productos.js'
//
// Nota: cada producto lleva un id único → eso será su key (Lección 05).
// ============================================================

export const productos = [
  { id: 1, nombre: 'Portátil', precio: 699, stock: 12, categoria: 'informatica' },
  { id: 2, nombre: 'Ratón', precio: 19, stock: 0, categoria: 'informatica' },
  { id: 3, nombre: 'Monitor 27"', precio: 189, stock: 5, categoria: 'informatica' },
  { id: 4, nombre: 'Auriculares', precio: 59, stock: 8, categoria: 'audio' },
  { id: 5, nombre: 'Micrófono', precio: 45, stock: 0, categoria: 'audio' },
  { id: 6, nombre: 'Teclado', precio: 39, stock: 3, categoria: 'informatica' },
]

export const CATEGORIAS = ['todas', 'informatica', 'audio']