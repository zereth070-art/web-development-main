package es.daw.simpsons.repository;

import es.daw.simpsons.model.Personaje;

import java.util.List;

/**
 * "Base de datos" en memoria. Más adelante esto vendrá de una BD real,
 * pero el resto de la aplicación no tendrá que cambiar: solo pide la lista.
 *
 * Las edades son aproximadas (en la serie los personajes no envejecen).
 */
public class PersonajeRepositorio {

    // List.of() crea una lista INMUTABLE: si alguien intenta hacer add() o remove(),
    // salta una excepción. Así demostramos que los streams no tocan la lista original.
    private static final List<Personaje> PERSONAJES = List.of(
            new Personaje("Homer",    "Simpson",    39, "Inspector de seguridad", "Central Nuclear",   true),
            new Personaje("Marge",    "Simpson",    36, "Ama de casa",            "Casa Simpson",      true),
            new Personaje("Bart",     "Simpson",    10, "Estudiante",             "Escuela Primaria",  true),
            new Personaje("Lisa",     "Simpson",     8, "Estudiante",             "Escuela Primaria",  true),
            new Personaje("Maggie",   "Simpson",     1, "Bebé",                   "Casa Simpson",      true),
            new Personaje("Abe",      "Simpson",    83, "Jubilado",               "Residencia",        true),
            new Personaje("Ned",      "Flanders",   60, "Dueño del Zurditorium",  "Casa Flanders",     false),
            new Personaje("Rod",      "Flanders",   10, "Estudiante",             "Casa Flanders",     false),
            new Personaje("Todd",     "Flanders",    8, "Estudiante",             "Casa Flanders",     false),
            new Personaje("Montgomery", "Burns",   104, "Dueño de la central",    "Central Nuclear",   false),
            new Personaje("Waylon",   "Smithers",   42, "Asistente de Burns",     "Central Nuclear",   false),
            new Personaje("Lenny",    "Leonard",    40, "Operario",               "Central Nuclear",   false),
            new Personaje("Carl",     "Carlson",    40, "Operario",               "Central Nuclear",   false),
            new Personaje("Moe",      "Szyslak",    52, "Tabernero",              "Taberna de Moe",    false),
            new Personaje("Barney",   "Gumble",     40, "Cliente habitual",       "Taberna de Moe",    false),
            new Personaje("Apu",      "Nahasapeemapetilon", 45, "Dependiente",    "Badulaque",         false),
            new Personaje("Milhouse", "Van Houten", 10, "Estudiante",             "Escuela Primaria",  false),
            new Personaje("Nelson",   "Muntz",      12, "Estudiante",             "Escuela Primaria",  false),
            new Personaje("Ralph",    "Wiggum",      8, "Estudiante",             "Escuela Primaria",  false),
            new Personaje("Martin",   "Prince",     10, "Estudiante",             "Escuela Primaria",  false),
            new Personaje("Seymour",  "Skinner",    44, "Director",               "Escuela Primaria",  false),
            new Personaje("Edna",     "Krabappel",  41, "Profesora",              "Escuela Primaria",  false),
            new Personaje("Clancy",   "Wiggum",     43, "Jefe de policía",        "Comisaría",         false),
            new Personaje("Krusty",   "",           55, "Payaso",                 "Estudio de TV",     false),
            new Personaje("Julius",   "Hibbert",    50, "Médico",                 "Hospital",          false),
            new Personaje("Timothy",  "Lovejoy",    55, "Reverendo",              "Iglesia",           false),
            new Personaje("Patty",    "Bouvier",    45, "Funcionaria de tráfico", "Tráfico",           false),
            new Personaje("Selma",    "Bouvier",    45, "Funcionaria de tráfico", "Tráfico",           false),
            new Personaje("Otto",     "Mann",       30, "Conductor de autobús",   "Escuela Primaria",  false),
            new Personaje("Willie",   "",           50, "Conserje",               "Escuela Primaria",  false)
    );

    public List<Personaje> findAll() {
        return PERSONAJES;
    }
}
