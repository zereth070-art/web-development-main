package es.daw.jakartalogin;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

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
            List<String> tecnologias = leerTecnologias("/WEB-INF/datos/tecnologiaas.txt");
            LOGGER.info(tecnologias.toString());
            request.setAttribute("tecnologias", tecnologias);
        } catch (IOException e) {
            LOGGER.severe(e.getMessage());
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

        if (nombre == null || nombre.isBlank() || email == null || email.isBlank()) {
            response.sendRedirect(request.getContextPath() + "/alta");
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

    /**
     * 
     * @return
     * @throws IOException
     */
    private List<String> leerTecnologias(String pathFile) throws IOException {
        if (pathFile == null) {
            throw new IOException("ruta nula");
        }
        List<String> lista = new ArrayList<>();
        InputStream is = getServletContext().getResourceAsStream(pathFile);

        //En vez de propagar una IOException, implementar una exception propia de tipo checked llamada por ejemplo FicheroTxtNoEncontradoException
        if (is == null) {
            throw new IOException("no existe " + pathFile);
        }
        try (BufferedReader br = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
            String linea;
            while ((linea = br.readLine()) != null) {
                if (!linea.isBlank()) {
                    lista.add(linea.trim());
                }
            }
        }
        return lista;
    }
}