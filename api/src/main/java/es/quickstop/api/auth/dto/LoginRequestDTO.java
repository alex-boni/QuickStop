package es.quickstop.api.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequestDTO {

    @Email(message = "Formato de correo inválido.")
    private String email;

    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres.")
    private String password;
}
