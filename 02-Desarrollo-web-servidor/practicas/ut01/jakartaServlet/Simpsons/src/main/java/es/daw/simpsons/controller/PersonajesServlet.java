package es.daw.simpsons.controller;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

import es.daw.simpsons.model.Personaje;
import es.daw.simpsons.servicio.PersonajeServicio;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

@WebServlet("/personajes")
public class PersonajesServlet extends HttpServlet {
    private String message;

    public void init() {
        message = "Hello World!";
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
    String lugar = request.getParameter("lugar");
    Integer edadMax = entero(request.getParameter("edadMax"));
    String ordenadoPor = request.getParameter("ordenadoPor");
    boolean descendente = request.getParameter("descendente") != null && Boolean.parseBoolean(request.getParameter("descendente"));
    String limite =  request.getParameter("limite");

    PersonajeServicio servicio = new PersonajeServicio();
    List<Personaje> personajes = servicio.buscar();

    request.setAttribute("personajes", personajes);
    request.setAttribute("lugares", personajes.stream().map(Personaje::lugar).distinct().sorted().toList());

    request.getRequestDispatcher("/WEB-INF/personajes.jsp").forward(request,response);

    }

    private Integer entero(String valor) {
        try {
            return Integer.valueOf(valor);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public void destroy() {
    }
}