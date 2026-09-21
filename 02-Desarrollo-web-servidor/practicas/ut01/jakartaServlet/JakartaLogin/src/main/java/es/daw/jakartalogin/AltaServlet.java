package es.daw.jakartalogin;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import jakarta.servlet.ServletException;

@WebServlet("/alta")
public class AltaServlet extends HttpServlet {

    private static final Logger LOGGER = Logger.getLogger(AltaServlet.class.getName());

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            List<String> tecnologias = leerTecnologias("/WEB-INF/datos/tecnologias.txt");
            LOGGER.info(tecnologias.toString());
            request.setAttribute("tecnologias", tecnologias);
            request.getRequestDispatcher("/WEB-INF/formulario.jsp").forward(request, response);
        } catch (IOException e) {
            LOGGER.severe(e.getMessage());
        }

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    request.setAttribute("nombre", request.getParameter("nombre"));

    }

    /**
     * 
     * @return
     * @throws IOException
     */
    private List<String> leerTecnologias(String pathFile) throws IOException{
        if (pathFile == null) {
            throw new IOException("ruta nula");
        }
        List<String> lista = new ArrayList<>();
        InputStream is = getServletContext().getResourceAsStream(pathFile);
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
