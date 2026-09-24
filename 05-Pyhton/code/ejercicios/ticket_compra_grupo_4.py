# ----- VARIABLES ------
iva = 0.21
cliente = input("Nombre del cliente: ")
nombre_producto = input("Nombre del producto: ")
precio_unidad = float(input("Precio por unidad: "))
cantidad = int(input("Cantidad: "))
descuento = int(input("Descuento aplicado (%): "))

# Calculos
# Subtotal = precio por unidad x cantidad
subtotal = precio_unidad * cantidad
# Descuento = subtotal x procentaje de descuento / 100
descuento = subtotal * descuento / 100
# Base despues del descuento  = subtotal - descuento
base_descuento = subtotal - descuento
# Inporte del IVA = base despues del descuento x IVA
importe_IVA = base_descuento * iva
# Total = bsae despues del descuento + importe del IVA
total = base_descuento + importe_IVA

# Mostrar por dos decimales  = print(f"Total: {total:.2f} €")
#Ticket esperado

# ========== TICKET DE COMPRA ==========
print(f"========== TICKET DE COMPRA ==========")
#Cliente: Laura
print(f"Cliente:{cliente}")
#Producto: Teclado
print(f"Producto:{nombre_producto}")
#Precio por unidad: 25.50 €
print(f"Precio por unidad:{precio_unidad} €")
#Cantidad: 2
print(f"Cantidad:{cantidad}")
#Subtt(f"Subtotal:{subtotal:.2f} €")
#Descuento
print(f"Descuento:{descuento:.2f} €")
#Importe del IVA
print(f"Importe del IVA:{importe_IVA:.2f} €")
#Importe del IVA
print(f"Total:{total:.2f} €")
print(f"Gracias por su compra")
print(f"=====================================")
