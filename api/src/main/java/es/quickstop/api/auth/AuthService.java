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
    private final AuthMapper authMapper;
    private final JwtService jwtService;
    
@Transactional // Asegura que la operación sea atómica (éxito total o fallo total)
    public AuthResponseDTO register(RegisterRequestDTO request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        request.setEmail(normalizedEmail);
        UserRole requestedRole = parseUserRole(request.getRole());
        
        // 1. Validación de Unicidad de Email (Crucial)
        Optional<User> existingUser = userRepository.findByEmail(normalizedEmail);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            UserRole currentRole = user.getRole();

            if (currentRole == requestedRole || currentRole == UserRole.BOTH) {
                throw new EmailAlreadyExistsException("El correo " + normalizedEmail + " ya está registrado.");
            }

            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Credenciales inválidas.");
            }

            user.setRole(UserRole.BOTH);
            User upgradedUser = userRepository.save(user);
            AuthResponseDTO response = authMapper.toAuthResponseDTO(upgradedUser);
            response.setToken(jwtService.generateToken(upgradedUser));
            response.setRole(upgradedUser.getRole().name());
            return response;
        }

        // 2. Creación y Mapeo de la Entidad
        // Usamos MapStruct (authMapper) para crear la entidad User a partir del DTO
        User user = authMapper.toUser(request);

        // 3. Encriptación de Contraseña (Mantiene la seguridad de la aplicación)
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(encodedPassword);

        // 4. Asignación de Rol
        user.setRole(requestedRole);

        // 5. Persistencia y Generación de Respuesta
        User savedUser = userRepository.save(user);

        AuthResponseDTO response = authMapper.toAuthResponseDTO(savedUser);
        response.setToken(jwtService.generateToken(savedUser));
        response.setRole(savedUser.getRole().name());
        return response;
    }

    public AuthResponseDTO login(es.quickstop.api.auth.dto.LoginRequestDTO request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        // Buscar el usuario por email
        Optional<User> userOpt = userRepository.findByEmail(normalizedEmail);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Credenciales inválidas.");
        }

        User user = userOpt.get();

        // Verificar la contraseña
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Credenciales inválidas.");
        }

        AuthResponseDTO response = authMapper.toAuthResponseDTO(user);
        response.setToken(jwtService.generateToken(user));
        response.setRole(user.getRole().name());
        return response;
    }

    private UserRole parseUserRole(String role) {
        try {
            return UserRole.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Rol de usuario inválido: " + role);
        }
    }
}
