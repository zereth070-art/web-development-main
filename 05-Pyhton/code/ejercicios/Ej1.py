# ----- VARIABLES ------
iva = 0.21
cliente = input("Nombre del cliente: ")
nombre_producto = input("Nombre del producto: ")
precio_unidad = float(input("Precio por unidad: "))
cantidad = int(input("Cantidad: "))
descuento = int(input("Descuento aplicado (%): "))
# aqui lo convertimos directamente en float o a int las variables
# que sabemos para que sean numericas para trabajar de manera mas comoda

# ---- Calculos ----
# Subtotal = precio por unidad x cantidad
subtotal = precio_unidad * cantidad
# Descuento = subtotal x procentaje de descuento / 100
descuento = subtotal * descuento / 100
# Base despues del descuento  = subtotal - descuento
base_descuento = subtotal - descuento
# Importe del IVA = base despues del descuento x IVA
importe_IVA = base_descuento * iva
# Total = base despues del descuento + importe del IVA
total = base_descuento + importe_IVA

# ---- IMPRIMIR EL TICKET ----
print(f"========== TICKET DE COMPRA ==========")
#Cliente
print(f"Cliente:{cliente}")
#Producto
print(f"Producto:{nombre_producto}")
#Precio por unidad
print(f"Precio por unidad:{precio_unidad} €")
#Cantidad:
print(f"Cantidad:{cantidad}")
#Subtotal
print(f"Subtotal:{subtotal:.2f}")
#Descuento
print(f"Descuento:{descuento:.2f} €")
#Importe del IVA
print(f"IVA:{importe_IVA:.2f} €")
#Total
print(f"TOTAL: {total:.2f} €")
print(f"Gracias por su compra")
print(f"=====================================")
