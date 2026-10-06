package es.daw.simpsons.servicio;

import es.daw.simpsons.model.Personaje;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PersonajeServicioTest {

    private final PersonajeServicio servicio = new PersonajeServicio();

    @Test
    void sinParametrosDevuelveTodos() {
        assertEquals(servicio.buscar().size(), servicio.buscar(null, null, null, false, null).size());
    }

    @Test
    void filtraPorLugar() {
        List<Personaje> resultado = servicio.buscar("Central Nuclear", null, null, false, null);
        assertFalse(resultado.isEmpty());
        assertTrue(resultado.stream().allMatch(p -> p.lugar().equals("Central Nuclear")));
    }

    @Test
    void filtraPorEdadMaxima() {
        List<Personaje> resultado = servicio.buscar(null, 18, null, false, null);
        assertTrue(resultado.stream().allMatch(p -> p.edad() <= 18));
    }

    @Test
    void ordenaPorEdadDescendente() {
        List<Personaje> resultado = servicio.buscar(null, null, "edad", true, null);
        for (int i = 1; i < resultado.size(); i++) {
            assertTrue(resultado.get(i - 1).edad() >= resultado.get(i).edad());
        }
    }

    @Test
    void ordenaPorNombreAscendente() {
        List<Personaje> resultado = servicio.buscar(null, null, "nombre", false, null);
        for (int i = 1; i < resultado.size(); i++) {
            assertTrue(resultado.get(i - 1).nombre()
                    .compareToIgnoreCase(resultado.get(i).nombre()) <= 0);
        }
    }

    @Test
    void aplicaLimite() {
        assertEquals(5, servicio.buscar(null, null, "nombre", false, 5).size());
    }

    @Test
    void limiteNoValidoNoAplica() {
        assertEquals(servicio.buscar().size(),
                servicio.buscar(null, null, null, false, 0).size());
    }

    @Test
    void combinaFiltroOrdenYLimite() {
        List<Personaje> resultado = servicio.buscar("Escuela Primaria", 12, "edad", true, 3);
        assertEquals(3, resultado.size());
        assertTrue(resultado.stream().allMatch(p -> p.lugar().equals("Escuela Primaria") && p.edad() <= 12));
        for (int i = 1; i < resultado.size(); i++) {
            assertTrue(resultado.get(i - 1).edad() >= resultado.get(i).edad());
        }
    }
}
