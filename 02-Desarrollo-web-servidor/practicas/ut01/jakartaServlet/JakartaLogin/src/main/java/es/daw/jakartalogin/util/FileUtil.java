package es.daw.jakartalogin.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import es.daw.jakartalogin.exception.TxtNoEncontradoException;

import jakarta.servlet.ServletContext;

public class FileUtil {

    public static List<String> leerFichero(ServletContext ctx, String pathFile) throws TxtNoEncontradoException, IOException {
        if (pathFile == null) {
            throw new IOException("ruta nula");
        }
        List<String> lista = new ArrayList<>();
        //gerResourceAsStream abre un flujo de bytes (InputStream)
        InputStream is = ctx.getResourceAsStream(pathFile);

        if (is == null) {
            throw new TxtNoEncontradoException("no existe " + pathFile);
        }
        //try con recursos: todo lo que se declara dentro del parentesis se cierra automaticamente con el metodo close()
        //InputStream => bytes en crudo
        //InputStreamReader => convierte esos bytes en caracteres en un charset
        //BufferedREader => añade un buffer para leer linea a linea, me va a dar null cuando no haya mas
        try (BufferedReader br = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
            String linea;
            while ((linea = br.readLine()) != null) {
                if (!linea.isBlank()) {
                    lista.add(linea.strip());
                }
            }
        }
        return lista;
    }
}
