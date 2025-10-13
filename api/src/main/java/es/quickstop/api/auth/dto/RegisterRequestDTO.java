package es.quickstop.api.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Genera getters y setters automáticamente
@NoArgsConstructor // Genera un constructor sin argumentos
@AllArgsConstructor // Genera un constructor con todos los argumentos
public class RegisterRequestDTO {
    
    @Size(min = 4, message = "El nombre debe tener al menos 4 caracteres.")
    private String name;
    
    @Email(message = "Formato de correo inválido.")
    private String email;

    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres.")
    private String password;
    
    // El rol ya está validado por el frontend, pero se debe recibir
    @NotNull
    private String role;

    // Getters y Setters generados por Lombok
}
