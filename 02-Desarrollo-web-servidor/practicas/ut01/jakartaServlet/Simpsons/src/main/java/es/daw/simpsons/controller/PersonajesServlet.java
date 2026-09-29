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
        response.setContentType("text/html");
    String lugar = request.getParameter("lugar");
    int edadMax = Integer.parseInt(request.getParameter("edadMax"));
    String ordenadoPor = request.getParameter("ordenadoPor");
    boolean descendente = request.getParameter("descendente")!= null ? Boolean.parseBoolean(request.getParameter("descendente")) : false;
    String limite =  request.getParameter("limite");

    PersonajeServicio servicio = new PersonajeServicio();
    List<Personaje> personajes = servicio.buscar();
    //NECESITO OBTENER TOA LA LISTA DE LOS SIMPOSNS

        request.getRequestDispatcher("/formulario").forward(request,response);

    }

    public void destroy() {
    }
}