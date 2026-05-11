package es.quickstop.api.user;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import es.quickstop.api.common.exception.EmailAlreadyExistsException;
import es.quickstop.api.user.model.User;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(Long userId) {
        User user = getActiveUserById(userId);
        return toDto(user);
    }

    @Transactional
    public UserDto updateCurrentUser(Long userId, UserUpdateRequestDto request) {
        User user = getActiveUserById(userId);

        Optional<User> existingByEmail = userRepository.findByEmail(request.getEmail());
        if (existingByEmail.isPresent() && existingByEmail.get().getId() != user.getId()) {
            throw new EmailAlreadyExistsException("El correo " + request.getEmail() + " ya está registrado.");
        }

        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());

        User saved = userRepository.save(user);
        return toDto(saved);
    }

    private User getActiveUserById(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));
        if (!user.isState()) {
            throw new IllegalArgumentException("Usuario no disponible.");
        }
        return user;
    }

    private UserDto toDto(User user) {
        return UserDto.builder()
            .id(user.getId())
            .name(user.getName())
            .email(user.getEmail())
            .role(user.getRole())
            .build();
    }
}
