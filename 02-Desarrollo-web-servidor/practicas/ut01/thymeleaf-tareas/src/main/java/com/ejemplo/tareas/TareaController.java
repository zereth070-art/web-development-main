package com.ejemplo.tareas;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class TareaController {

    private final List<Tarea> tareas = new ArrayList<>();
    private long siguienteId = 1;

    public TareaController() {
        tareas.add(new Tarea(siguienteId++, "Estudiar RA1 (arquitecturas)", true));
        tareas.add(new Tarea(siguienteId++, "Montar la web del grupo 291", false));
    }

    @GetMapping("/")
    public String inicio(Model model) {
        model.addAttribute("tareas", tareas);
        return "index";
    }

    @PostMapping("/tareas")
    public String crear(@RequestParam String titulo) {
        if (titulo != null && !titulo.isBlank()) {
            tareas.add(new Tarea(siguienteId++, titulo.trim(), false));
        }
        return "redirect:/";
    }

    @PostMapping("/tareas/{id}/hecha")
    public String hacerTareas(@PathVariable Long id) {
        tareas.replaceAll(t -> t.id().equals(id) ? new Tarea(t.id(), t.titulo(), true) : t);
        return "redirect:/";
    }

}