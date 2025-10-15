package es.quickstop.api.user.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users") // Evita conflicto con la palabra reservada "user" en SQL, usando "users", guarda la tabla en plural
@Data // Genera getters, setters, toString, equals, hashCode
@NoArgsConstructor // Genera un constructor sin argumentos
@AllArgsConstructor // Genera un constructor con todos los argumentos
@Builder // Permite construir objetos de manera fluida
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Genera el ID automáticamente
    private long id;

    @Column(nullable = false) // No puede ser nulo y debe ser único
    private String name;

    @Column(nullable = false, unique = true) // No puede ser nulo y debe ser único
    private String email;

    @Column(nullable = false)
    private String password; // Almacena la contraseña encriptada

    @Enumerated(EnumType.STRING) // Almacena el enum como String en la base de datos
    @Column(nullable = false)
    private UserRole role; // Enum para definir el rol del usuario (OWNER, DRIVER)

    @Column(nullable = false)
    private boolean termsAccepted; // Indica si el usuario aceptó los términos y condiciones

    @Column(nullable = false)
    private boolean state; // Indica si el usuario está activo o no (soft delete)

}
