package es.daw.simpsons.servicio;

import es.daw.simpsons.model.Personaje;
import es.daw.simpsons.repository.PersonajeRepositorio;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

public class PersonajeServicio  {
    private final PersonajeRepositorio repository = new PersonajeRepositorio();

    public List<Personaje> buscar(){
        return repository.findAll();
    }

    /**
     * Búsqueda con filtros, orden y límite. Todos los parámetros son opcionales:
     * null (o vacío en el caso de lugar/ordenarPor) significa "no aplicar".
     */
    public List<Personaje> buscar(String lugar, Integer edadMax, String ordenarPor,
                                 boolean descendente, Integer limite) {

        Stream<Personaje> stream = repository.findAll().stream();

        if (lugar != null && !lugar.isBlank()) {
            stream = stream.filter(p -> p.lugar().equals(lugar));
        }

        if (edadMax != null) {
            stream = stream.filter(p -> p.edad() <= edadMax);
        }

        Comparator<Personaje> comparador = switch (ordenarPor == null ? "" : ordenarPor) {
            case "apellido" -> Comparator.comparing(Personaje::apellido, String.CASE_INSENSITIVE_ORDER);
            case "edad"     -> Comparator.comparingInt(Personaje::edad)
                                .thenComparing(Personaje::nombre, String.CASE_INSENSITIVE_ORDER);
            default         -> Comparator.comparing(Personaje::nombre, String.CASE_INSENSITIVE_ORDER);
        };

        if (descendente) {
            comparador = comparador.reversed();
        }
        stream = stream.sorted(comparador);

        if (limite != null && limite > 0) {
            stream = stream.limit(limite);
        }

        return stream.toList();
    }
}
