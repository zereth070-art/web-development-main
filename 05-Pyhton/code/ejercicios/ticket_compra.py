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
importe_IVA = base * iva
# Total = bsae despues del descuento + importe del IVA
total = base + importe

# Mostrar por dos decimales  = print(f"Total: {total:.2f} €")
#Ticket esperado

# ========== TICKET DE COMPRA ==========
printf("========== TICKET DE COMPRA ==========")
#Cliente: Laura
prinf(f"Cliente:{cliente}")
#Producto: Teclado
prinf(f"Producto:{producto}")
#Precio por unidad: 25.50 €
prinf(f"Precio por unidad:{precio_unidad} €")
#Cantidad: 2
prinf(f"Cantidad:{cantidad}")
#Subtotal
prinf(f"Subtotal:{subtotal:.2f} €")
#Descuento
prinf(f"Descuento:{descuento:.2f} €")
#Importe del IVA
prinf(f"Importe del IVA:{importe_IVA:.2f} €")
