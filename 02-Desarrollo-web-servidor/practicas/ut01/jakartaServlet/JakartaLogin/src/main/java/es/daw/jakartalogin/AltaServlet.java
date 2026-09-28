package es.daw.jakartalogin;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import es.daw.jakartalogin.exceptiones.FicheroNoEncontradoException;
import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;


@WebServlet("/alta")
public class AltaServlet extends HttpServlet {

    private static final Logger LOGGER = Logger.getLogger(AltaServlet.class.getName());

    private List<String> tecnologias = new ArrayList<>();
    private List<String> niveles = new ArrayList<>();


    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        try {
            tecnologias = leerFiche("/WEB-INF/datos/tecnologias.txt");
            niveles = leerFiche("/WEB-INF/datos/niveles.txt");
        }catch (IOException | FicheroNoEncontradoException e){
            LOGGER.severe(e.getMessage());
        }

    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

//        try {
//            List<String> tecnologias = leerFiche("/WEB-INF/datos/tecnologias.txt");
//            LOGGER.info(tecnologias.toString());

        // Los parámetros vía get, si no viajan llegan como null!!!
        // Si hago trim de opcional y no se ha enviado en la url como parámetro, dará un nullpointerexception
        // String opcional = request.getParameter("opcional").trim();

        request.setAttribute("tecnologias",tecnologias);
        request.setAttribute("niveles", niveles);
            request.getRequestDispatcher("/WEB-INF/formulario.jsp").forward(request,response);

//        }catch (IOException e){
//            // Enviar a una paǵina error.jsp de error el mensaje de error...
//            LOGGER.severe(e.getMessage());
//
//            // Añadir como atributo el mensaje de error...
//            request.setAttribute("mensajeError",e.getMessage());
//
//            request.getRequestDispatcher("/error.jsp").forward(request,response);
//
//        }




    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {


        // 1. LEER todos los parámetros del formulario
        String nombre = request.getParameter("nombre");
        String email = request.getParameter("email");
        String tecnologia = request.getParameter("tecnologia");
        String nivel = request.getParameter("nivel");

        LOGGER.info("nombre: "+nombre);
        LOGGER.info(String.format("email: %s",email));
        LOGGER.info(String.format("tecnologia: %s",tecnologia));
        LOGGER.info(String.format("nivel: %s",nivel));

        // 2. VALIDACIONES
        // Validar los parámetros!!!
        nombre = nombre.strip();

        // Realmente los campos del formulario si no se rellenan llegan como caden vacía y no como null
        email = email == null ? null : email.strip();
        tecnologia = tecnologia == null ? null : tecnologia.strip();
        nivel = nivel == null ? null : nivel.strip();

        // Si el nombre viene vacío que vuelva a la página del formulario indicando que
        // el nombre no puede estar vacío...

        if (nombre.isBlank()){
            request.setAttribute("mensaje","Majete!!! rellena el nombre que es obligatorio!!!!");
            //request.setAttribute("tecnologias",leerFiche("/WEB-INF/datos/tecnologias.txt"));
            request.setAttribute("tecnologias",tecnologias);
            request.setAttribute("niveles", niveles);
            request.getRequestDispatcher("/WEB-INF/formulario.jsp").forward(request,response);
            return;
        }

        //------------------
        // -----------------
        // 3. PERSISTENCIA EN BD
        // EN ESTE PUNTO SE COMPROBARÍA EN BD SI EXISTE UN USUARIO CON ESE NOMBRE... ETC...
        // CONSIDERAMOS QUE TODO OK!!! LA LÓGICA DE NEGOCIO ES MUY SENCILLITA!!!!!
        // ------------------------


        request.setAttribute("nombre",nombre);
        request.setAttribute("email",email);
        request.setAttribute("tecnologia",tecnologia);
        request.setAttribute("nivel",nivel);

        request.getRequestDispatcher("/WEB-INF/confirmacion.jsp").forward(request,response);

    }

    /**
     * Lee un fichero de texto
     * @param pathFile ruta al fichero. Debe ser absoluta y encontrarse protegida en WEB-INF
     * @return List de cadena de texto de cada linea
     * @throws IOException si no existe la ruta
     */
    private List<String> leerFiche(String pathFile) throws IOException, FicheroNoEncontradoException {
        List<String> lista = new ArrayList<>();

        // getResourceAsStream abre un flujo de bytes (InputStream)
        InputStream is = getServletContext().getResourceAsStream(pathFile);

        // PENDIENTE!!! En vez de propagar IOException, implementar una excepción propia de tipo checked
        // llamada FicheroTxtNoEncontradoException...
        if ( is == null)
            throw new FicheroNoEncontradoException("No se encuentra el fichero de texto: "+pathFile);


        // try con recursos: todo lo que se declara dentro del paréntesis se cierra automáticamente (close())
        // InputStream -> bytes en crudo
        // InputStreamReader -> convierte esos bytes en caracteres según el charset
        // BufferedReader -> añade un buffer para leer línea a línea
        try(BufferedReader br = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))){
            String linea;
            while( (linea = br.readLine()) != null){
                if (!linea.isBlank())
                    //lista.add(linea.trim());
                    lista.add(linea.strip());

            }
        }
        return lista;
    }

}