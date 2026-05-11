package es.quickstop.api.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateRequestDto {

    @NotBlank(message = "El nombre es obligatorio.")
    @Size(min = 4, message = "El nombre debe tener al menos 4 caracteres.")
    private String name;

    @NotBlank(message = "El email es obligatorio.")
    @Email(message = "Formato de correo inválido.")
    private String email;
}

