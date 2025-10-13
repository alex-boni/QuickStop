package es.quickstop.api.auth;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.quickstop.api.auth.dto.AuthResponseDTO;
import es.quickstop.api.auth.dto.RegisterRequestDTO;
import es.quickstop.api.common.exception.EmailAlreadyExistsException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    
    // public AuthController(AuthService authService) {
    //     this.authService = authService;
    // }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> registerUser(@Valid @RequestBody RegisterRequestDTO request){
        try {
            // Delega la lógica de negocio al servicio (encriptación, guardado)
            AuthResponseDTO response = authService.register(request);
            //mostrar log
            System.out.println("Usuario registrado: " + response.getEmail());
            // Devuelve 201 Created si la operación fue exitosa
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (EmailAlreadyExistsException e) {
            throw e; // Será manejada por un manejador global de excepciones
        }
    }
    
}   
