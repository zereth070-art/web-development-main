package es.daw.jakartalogin;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;

import es.daw.jakartalogin.exception.TxtNoEncontradoException;
import es.daw.jakartalogin.util.FileUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet(value = "/alta", loadOnStartup = 1)
public class AltaServlet extends HttpServlet {

    private static final Logger LOGGER = Logger.getLogger(AltaServlet.class.getName());

    private List<String> tecnologias;
    private List<String> niveles;

    @Override
    public void init() throws ServletException {
        try {
            tecnologias = List.copyOf(FileUtil.leerFichero(getServletContext(), "/WEB-INF/datos/tecnologias.txt"));
            niveles = List.copyOf(FileUtil.leerFichero(getServletContext(), "/WEB-INF/datos/niveles.txt"));
        } catch (TxtNoEncontradoException | IOException e) {
            throw new ServletException("no se pudieron cargar los datos", e);
        }
        LOGGER.info(tecnologias.toString());
        LOGGER.info(niveles.toString());
    }

    private void setListas(HttpServletRequest request) {
        request.setAttribute("tecnologias", tecnologias);
        request.setAttribute("niveles", niveles);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setListas(request);
        request.getRequestDispatcher("/WEB-INF/formulario.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        String nombre = request.getParameter("nombre");
        String email = request.getParameter("email");
        String tecnologia = request.getParameter("tecnologia");
        String nivel = request.getParameter("nivel");

        if (nombre == null || nombre.isBlank()) {
            setListas(request);
            request.setAttribute("mensaje", "El nombre es obligatorio");
            request.setAttribute("email", email);
            request.setAttribute("tecnologia", tecnologia);
            request.setAttribute("niveles", niveles);
            request.setAttribute("nivelesSeleccionados", request.getParameterValues("nivel"));
            request.getRequestDispatcher("/WEB-INF/formulario.jsp").forward(request, response);
            return;
        }

        request.setAttribute("nombre", nombre.trim());
        request.setAttribute("email", email.trim());
        request.setAttribute("tecnologia", tecnologia);
        request.setAttribute("niveles", Arrays.toString(niveles.toArray()));

        request.getRequestDispatcher("/WEB-INF/confirmacion.jsp").forward(request, response);
    }
}
