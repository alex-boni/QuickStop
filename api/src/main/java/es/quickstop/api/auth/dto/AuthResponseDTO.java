package es.quickstop.api.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Genera getters, setters, toString, equals, y hashCode
@NoArgsConstructor // Genera un constructor sin argumentos
@AllArgsConstructor // Genera un constructor con todos los argumentos
public class AuthResponseDTO {
    private String token; // El token JWT (para Login y Registro si es auto-login)
    private Long userId;
    private String name;
    private String email;
    private String role;
    
    
}

