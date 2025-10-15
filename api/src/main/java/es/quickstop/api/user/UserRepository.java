package es.quickstop.api.user;
import es.quickstop.api.user.model.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<User,Long> {
        /**
     * Método de búsqueda personalizado.
     * Spring Data JPA genera automáticamente la implementación de la consulta:
     * SELECT * FROM users WHERE email = ?
     * Este método es crucial para el AuthService para verificar si un email ya existe.
     * @param email El correo electrónico a buscar.
     * @return Un Optional<User> que contiene el usuario si se encuentra, o Optional.empty() si no.
     */
    Optional<User> findByEmail(String email);
}
