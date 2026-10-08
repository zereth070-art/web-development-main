package es.daw.loginspring.controller;

import ch.qos.logback.core.model.Model;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class AltaController<OpcionesService> {

    private final OpcionesService opcionesService;

    // Inyección por constructor: NO hacemos new OpcionesService(), nos lo da Spring
    public AltaController(@Qualifier("jacksonMapper") OpcionesService opcionesService) {
        this.opcionesService = opcionesService;
    }

    @GetMapping("/")
    public String inicio() {
        return "index";              // → templates/index.html
    }

    @GetMapping("/alta")
    public String mostrarFormulario(Model model) {
        // 1. Añadir al modelo las listas de tecnologías y niveles
        // 2. Devolver el nombre de la vista
        return "";
    }

    @PostMapping("/alta")
    public String procesarFormulario(@RequestParam String nombre,
                                     @RequestParam String email,
                                     @RequestParam String tecnologia,
                                     @RequestParam(name = "nivel", required = false) List<String> niveles,
                                     Model model) {
        // 1. Si nombre está vacío → mensajeError + datos introducidos + listas → "formulario"
        // 2. Si no → datos al modelo → "confirmacion"
        return nombre;
    }
}