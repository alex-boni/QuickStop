package es.quickstop.api.user;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @GetMapping("/register")
public ResponseEntity<MessageResponse> getMyJson() {
        // Objeto que Spring Boot serializará a JSON
        var response = new MessageResponse("La petición GET fue exitosa y este es el JSON devuelto.");

        // Devuelve el código HTTP 200 OK con el objeto en el cuerpo
        return ResponseEntity.ok(response);
    }
    
}
