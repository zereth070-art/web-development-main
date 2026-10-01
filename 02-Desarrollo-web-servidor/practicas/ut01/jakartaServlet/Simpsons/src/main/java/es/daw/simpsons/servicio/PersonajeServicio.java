package es.daw.simpsons.servicio;

import es.daw.simpsons.model.Personaje;
import es.daw.simpsons.repository.PersonajeRepositorio;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

public class PersonajeServicio  {
   private final PersonajeRepositorio repository = new PersonajeRepositorio();

   public List<Personaje> buscar(){
       return repository.findAll();
   }

    public List<Personaje> buscarPorLugar(String lugar){


        return  repository
                .findAll()
                .stream()
                .filter(personaje -> personaje.lugar().equals(lugar))
                .toList();
    }

    public List<Personaje> buscarPorNombre(String nombre) {
        return repository
                .findAll()
                .stream()
                .filter(personaje -> personaje.nombre().equals(nombre))
                .toList();
    }
}