package es.quickstop.api.auth;


import es.quickstop.api.auth.dto.AuthResponseDTO;
import es.quickstop.api.auth.dto.RegisterRequestDTO;
import es.quickstop.api.user.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

/**
 * Interfaz de MapStruct para mapear DTOs a Entidades y viceversa.
 * El atributo componentModel="spring" permite que Spring inyecte esta interfaz
 * automáticamente (usado en AuthService).
 */
@Mapper(componentModel = "spring")
public interface AuthMapper {

    // Instancia estática (opcional, pero buena práctica si no se usa Spring)
    AuthMapper INSTANCE = Mappers.getMapper(AuthMapper.class);

    // ----------------------------------------------------------------------
    // 1. DTO de Petición -> Entidad (Para el Registro)
    // ----------------------------------------------------------------------
    /**
     * Mapea el RegisterRequestDTO a la entidad User.
     * @Mapping ignora la contraseña porque el servicio (AuthService) se encarga de ENCRIPTARLA.
     */
    @Mapping(target = "id", ignore = true) // El ID lo genera la BBDD
    @Mapping(target = "name", source = "name")// Mapea name a name (aunque tienen el mismo nombre, es opcional)
    @Mapping(target = "email", source = "email") // Mapea email a email (aunque tienen el mismo nombre, es opcional)
    @Mapping(target = "role", source = "role") // El rol se establece en el servicio
    @Mapping(target = "state", constant = "true") // Por defecto, el usuario está activo al crearlo
    @Mapping(target = "termsAccepted", constant = "true") // Asumimos que aceptó términos (validado en frontend)
    @Mapping(target = "password", ignore = true) // La contraseña se encripta y se establece en el servicio
    User toUser(RegisterRequestDTO dto);

    // ----------------------------------------------------------------------
    // 2. Entidad -> DTO de Respuesta (Para el Registro/Login Exitoso)
    // ----------------------------------------------------------------------
    /**
     * Mapea la entidad User al AuthResponseDTO.
     * @Mapping se usa para asignar campos con nombres diferentes (aunque aquí coinciden).
     * Nota: El campo 'token' se establecería en el servicio después de la generación de JWT.
     */
    @Mapping(target = "token", source = "password") // Se asume que el token se añade al DTO en el servicio
    @Mapping(target = "userId", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "email", source = "email")
    AuthResponseDTO toAuthResponseDTO(User user);
}