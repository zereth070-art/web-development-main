package es.daw.simpsons.clasico;

import es.daw.simpsons.model.Personaje;

import java.util.Comparator;

/**
 * RECORDATORIO DE 1º: cómo se ordenaba "a la antigua".
 * Una clase aparte que implementa Comparator y define compare().
 *
 * (No confundir con Comparable, que es la interfaz que implementa la PROPIA clase
 *  y define compareTo(): el "orden natural", como el de String o Integer.)
 *
 * Esta clase NO la usa la aplicación: está aquí solo para comparar con
 *
 *     Comparator.comparingInt(Personaje::edad).thenComparing(Personaje::nombre)
 *
 * que hace exactamente lo mismo en una línea.
 */
public class ComparadorPorEdad implements Comparator<Personaje> {

    @Override
    public int compare(Personaje p1, Personaje p2) {
        // Negativo si p1 va antes, positivo si va después, 0 si empatan.
        int resultado = Integer.compare(p1.edad(), p2.edad());

        // Si tienen la misma edad, desempatamos por nombre.
        if (resultado == 0) {
            resultado = p1.nombre().compareTo(p2.nombre());
        }
        return resultado;
    }
}