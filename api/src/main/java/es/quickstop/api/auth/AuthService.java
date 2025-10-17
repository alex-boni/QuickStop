package es.quickstop.api.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

import es.quickstop.api.user.model.User;
import es.quickstop.api.user.model.UserRole;
import es.quickstop.api.user.UserRepository;
import es.quickstop.api.auth.dto.AuthResponseDTO;
import es.quickstop.api.auth.dto.RegisterRequestDTO;
import es.quickstop.api.common.exception.EmailAlreadyExistsException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor // Genera un constructor con los campos finales (userRepository, passwordEncoder)
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthMapper authMapper = AuthMapper.INSTANCE;
    
@Transactional // Asegura que la operación sea atómica (éxito total o fallo total)
    public AuthResponseDTO register(RegisterRequestDTO request) {
        
        // 1. Validación de Unicidad de Email (Crucial)
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            // Lanza la excepción que se mapeará a HTTP 409 Conflict en el ControllerAdvice
            throw new EmailAlreadyExistsException("El email " + request.getEmail() + " ya está registrado.");
        }

        // 2. Creación y Mapeo de la Entidad
        // Usamos MapStruct (authMapper) para crear la entidad User a partir del DTO
        User user = authMapper.toUser(request);

        // 3. Encriptación de Contraseña (Mantiene la seguridad de la aplicación)
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(encodedPassword);

        // 4. Asignación de Rol (Asegurarse de que el string coincida con el Enum)
        try {
            // Convierte 'driver' o 'owner' a mayúsculas para que coincida con el Enum (DRIVER, OWNER)
            UserRole role = UserRole.valueOf(request.getRole().toUpperCase());
            user.setRole(role);
        } catch (IllegalArgumentException e) {
             // Si el rol enviado no es válido, se podría lanzar una excepción o asignar un default.
             throw new IllegalArgumentException("Rol de usuario inválido: " + request.getRole());
        }

        // 5. Persistencia y Generación de Respuesta
        User savedUser = userRepository.save(user);

        // Mapea la entidad guardada al DTO de respuesta.
        return authMapper.toAuthResponseDTO(savedUser);
    }

    public AuthResponseDTO login(es.quickstop.api.auth.dto.LoginRequestDTO request) {
        // Buscar el usuario por email
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Credenciales inválidas.");
        }

        User user = userOpt.get();

        // Verificar la contraseña
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Credenciales inválidas.");
        }

        // Si las credenciales son válidas, mapear y devolver el DTO de respuesta
        return authMapper.toAuthResponseDTO(user);
    }
}

