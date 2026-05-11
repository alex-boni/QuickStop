package es.quickstop.api.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.quickstop.api.common.exception.EmailAlreadyExistsException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getMyProfile(Authentication authentication) {
        try {
            Long userId = getAuthenticatedUserId(authentication);
            UserDto response = userService.getCurrentUser(userId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> updateMyProfile(
            Authentication authentication,
            @Valid @RequestBody UserUpdateRequestDto request) {
        try {
            Long userId = getAuthenticatedUserId(authentication);
            UserDto response = userService.updateCurrentUser(userId, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (EmailAlreadyExistsException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    private Long getAuthenticatedUserId(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new IllegalArgumentException("No autenticado.");
        }
        try {
            return Long.parseLong(authentication.getName());
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException("Token inválido.");
        }
    }
}
