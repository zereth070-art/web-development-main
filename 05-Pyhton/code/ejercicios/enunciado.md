# 🧾 Mini proyecto: generador de ticket de compra

> **Trabajo por parejas · Python · 2.º CFGS DAW**

**Autores:** Nombre del alumno 1 y nombre del alumno 2<br>
**Profesor:** Víctor Pablo Prado Sánchez

## 1. Situación

Una pequeña tienda necesita un programa en Python que calcule el importe de una compra y muestre un ticket sencillo.

El proyecto se realizará en grupos de dos alumnos.

## 2. Objetivo

Crear un programa que:

- Solicite los datos de una compra.
- Realice los cálculos necesarios.
- Muestre un ticket ordenado con el precio final.

## 3. Datos de entrada

El programa debe solicitar:

| Dato | Tipo recomendado |
| --- | --- |
| Nombre del cliente | `str` |
| Nombre del producto | `str` |
| Precio por unidad sin IVA | `float` |
| Cantidad comprada | `int` |
| Porcentaje de descuento | `float` |

### Constante obligatoria

El IVA debe almacenarse como una constante:

```python
IVA = 0.21
```

## 4. Cálculos

```text
Subtotal = precio por unidad × cantidad
Descuento = subtotal × porcentaje de descuento / 100
Base después del descuento = subtotal − descuento
Importe del IVA = base después del descuento × IVA
Total = base después del descuento + importe del IVA
```

## 5. Ejemplo de ejecución

### Entrada

```text
Nombre del cliente: Laura
Nombre del producto: Teclado
Precio por unidad: 25.50
Cantidad: 2
Descuento aplicado (%): 10
```

### Ticket esperado

```text
========== TICKET DE COMPRA ==========
Cliente: Laura
Producto: Teclado
Precio por unidad: 25.50 €
Cantidad: 2
Subtotal: 51.00 €
Descuento: 5.10 €
IVA: 9.64 €
TOTAL: 55.54 €
Gracias por su compra
=======================================
```

## 6. Requisitos obligatorios

El programa debe incluir:

- [ ] Variables con nombres descriptivos.
- [ ] Una constante para el IVA.
- [ ] Literales numéricos y de texto.
- [ ] Datos de tipo `str`, `int` y `float`.
- [ ] Conversiones mediante `int()` y `float()`.
- [ ] Operadores aritméticos.
- [ ] Expresiones con paréntesis.
- [ ] Comentarios que expliquen las partes principales.
- [ ] Resultados económicos con dos decimales.
- [ ] Una salida ordenada y fácil de leer.

Para mostrar dos decimales:

```python
print(f"Total: {total:.2f} €")
```

## 7. Organización de la pareja

### Alumno 1: entrada de datos

- Crear el proyecto.
- Definir la constante.
- Solicitar los datos.
- Realizar las conversiones de tipo.
- Comprobar los tipos mediante `type()` durante las pruebas.

### Alumno 2: cálculos y ticket

- Programar las operaciones.
- Diseñar la salida del ticket.
- Añadir los comentarios.
- Comprobar que los resultados aparecen con dos decimales.

Después, los dos alumnos revisarán conjuntamente todo el programa. Cada integrante deberá poder explicar cualquier parte del código.

## 8. Fases de trabajo

### Fase 1 · Diseño

Antes de programar, anotad:

- Qué variables necesitáis.
- Qué tipo tendrá cada variable.
- Qué operaciones realizará el programa.
- Qué información aparecerá en el ticket.

### Fase 2 · Implementación

1. Cread el archivo `ticket_compra.py`.
2. Escribid el programa.
3. Añadid comentarios que expliquen las partes principales.

### Fase 3 · Pruebas

Probad como mínimo estos casos y comprobad los resultados con una calculadora:

| Caso | Precio | Cantidad | Descuento |
| ---: | ---: | ---: | ---: |
| 1 | 10.00 € | 1 | 0 % |
| 2 | 25.50 € | 2 | 10 % |
| 3 | 7.95 € | 5 | 15 % |

### Fase 4 · Presentación

Cada pareja explicará brevemente:

- Las variables utilizadas.
- Las conversiones realizadas.
- Las operaciones del programa.
- La diferencia entre la constante `IVA` y las variables.
- Una prueba realizada.

## 9. Entrega

Cada pareja entregará:

- [ ] El archivo `ticket_compra.py`.
- [ ] Una captura de una ejecución correcta.
- [ ] Una tabla con los tres casos de prueba y sus resultados.
- [ ] Los nombres de los dos integrantes en un comentario inicial:

```python
# Proyecto: Generador de ticket de compra
# Autores: Nombre del alumno 1 y nombre del alumno 2
```

## 10. Evaluación

| Aspecto | Puntuación |
| --- | ---: |
| Entrada de datos y conversiones | 2 puntos |
| Variables, constante y tipos de datos | 2 puntos |
| Operaciones y resultados correctos | 2 puntos |
| Ticket ordenado y legible | 1,5 puntos |
| Comentarios y claridad del código | 1 punto |
| Pruebas realizadas | 1 punto |
| Explicación y trabajo en pareja | 0,5 puntos |
| **Total** | **10 puntos** |

## 11. Ampliación voluntaria

Si una pareja termina antes, puede añadir:

- Nombre de la tienda.
- Fecha de la compra introducida por el usuario.
- Gastos de envío.
- Una segunda clase de IVA.
- Comparaciones que indiquen mensajes según el importe final.
