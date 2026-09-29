package es.daw.simpsons.servicio;

import es.daw.simpsons.model.Personaje;
import es.daw.simpsons.repository.PersonajeRepositorio;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

public class PersonajeServicio  {
   private final PersonajeRepositorio repository = new PersonajeRepositorio();

   public List<Personaje> buscar(){
       return repository.findAll();
   }
}
