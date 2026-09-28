package es.daw.simpsons.model;

public record Personaje (
            String nombre,
            String apellido,
            int edad,
            String ocupacion,
            String lugar,   //Sitio donde se suele ver el personaje
            boolean principal // ¿Es de la familia protagonista?
){

        //optiopnal, puedo tener metodos
    public  String nombreCompleto(){
        return apellido.isBlank() ? nombre : nombre + " " +  apellido;

    }

    public boolean esMenor(){
        return edad < 18;
    }

}
