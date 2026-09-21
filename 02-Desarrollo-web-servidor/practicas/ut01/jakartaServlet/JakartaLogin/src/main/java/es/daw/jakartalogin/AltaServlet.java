package es.daw.jakartalogin;

import java.io.*;
import java.util.logging.Logger;

import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import jakarta.servlet.ServletException;

@WebServlet("/alta")
public class AltaServlet extends HttpServlet {

    private static final Logger logger = Logger.getLogger(AltaServlet.class.getName());

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {



    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {



    }

}
