package es.daw.jakartalogin;

import java.io.IOException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import es.daw.jakartalogin.exception.TxtNoEncontradoException;
import es.daw.jakartalogin.util.FileUtil;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/alta")
public class AltaServlet extends HttpServlet {

    private static final Logger LOGGER = Logger.getLogger(AltaServlet.class.getName());

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            List<String> tecnologias = FileUtil.leerFichero(getServletContext(), "/WEB-INF/datos/tecnologias.txt");
            LOGGER.info(tecnologias.toString());

            List<String> niveles = FileUtil.leerFichero(getServletContext(), "/WEB-INF/datos/niveles.txt");
            LOGGER.info(niveles.toString());

            request.setAttribute("tecnologias", tecnologias);
            request.setAttribute("niveles", niveles);
        } catch (TxtNoEncontradoException | IOException e) {
            LOGGER.severe(e.getMessage());

            request.setAttribute("mensajeError", e.getMessage());
            request.getRequestDispatcher("/WEB-INF/error.jsp").forward(request, response);
            return;
        }
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
            request.setAttribute("mensajeError", "el nombre es obligatorio");
            try {
                request.setAttribute("tecnologias", FileUtil.leerFichero(getServletContext(), "/WEB-INF/datos/tecnologias.txt"));
                request.setAttribute("niveles", FileUtil.leerFichero(getServletContext(), "/WEB-INF/datos/niveles.txt"));
            } catch (TxtNoEncontradoException | IOException e) {
                LOGGER.severe(e.getMessage());
            }
            request.getRequestDispatcher("/WEB-INF/formulario.jsp").forward(request, response);
            return;
        }

        request.setAttribute("nombre", escaparHTML(nombre.trim()));
        request.setAttribute("email", escaparHTML(email.trim()));
        request.setAttribute("tecnologia", escaparHTML(tecnologia));
        request.setAttribute("nivel", escaparHTML(nivel));

        request.getRequestDispatcher("/WEB-INF/confirmacion.jsp").forward(request, response);
    }

    private String escaparHTML(String valor) {
        if (valor == null) {
            return "";
        }
        return valor.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
