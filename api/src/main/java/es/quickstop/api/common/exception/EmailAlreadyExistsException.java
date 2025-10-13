package es.quickstop.api.common.exception;

/**
 * Excepción lanzada cuando se intenta registrar un usuario con un email que ya existe
 * en la base de datos.
 * Esta es una excepción de tiempo de ejecución (RuntimeException), lo que significa 
 * que no es necesario declararla en las firmas de los métodos.
 */
public class EmailAlreadyExistsException extends RuntimeException {

    // Constructor que recibe un mensaje (usado en AuthService)
    public EmailAlreadyExistsException(String message) {
        super(message);
    }
    
    // Opcional: Constructor que también recibe la causa original
    public EmailAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
}
