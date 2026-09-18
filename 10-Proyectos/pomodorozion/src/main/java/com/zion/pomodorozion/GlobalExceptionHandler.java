package com.zion.pomodorozion;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice //escucha las excepciones lanzadas por todos los controladores, sin tocar su código. Spring lo detecta automáticamente al estar en el paquete base
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
                                            //captura la MethodArgumentNotValidException que dispara @Valid. Devuelve 400 con el mapa {campo: mensaje}; cada message que pusiste en las anotaciones aparece aquí.
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, Object> fieldErrors = new LinkedHashMap<>();
        for (FieldError error: ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }
        return build(HttpStatus.BAD_REQUEST, "Error de validacion", fieldErrors);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
                                                //JSON mal formado, por ejemplo si pones un string en lugar de un int. Devuelve 400 con el mensaje "Cuerpo de la peticion no valido"
    public ResponseEntity<Map<String, Object>> handleUnreadable(HttpMessageNotReadableException ex) {
        return build(HttpStatus.BAD_REQUEST, "Cuerpo de la peticion no valido", null);
    }
    

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleStatus(ResponseStatusException ex) {
    HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());
    return build(status, ex.getReason(), null);
}

    @ExceptionHandler(Exception.class)         //cualquier error no previsto se traduce en 500 sin filtrar la traza interna al cliente.
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno del servidor", null);
    }

    private ResponseEntity<Map<String, Object>> build(HttpStatus status, String message, Map<String, Object> errors) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        if (errors != null) {
            body.put("errors", errors);
        }
        return new ResponseEntity<>(body, status);
    }
}