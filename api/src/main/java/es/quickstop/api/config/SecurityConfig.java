package es.quickstop.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
@EnableWebSecurity // Habilita la seguridad web en la aplicación
public class SecurityConfig {

    // ... Bean de PasswordEncoder ...
    
    // Configuración del filtro de seguridad
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Deshabilitar CSRF (Crucial para APIs REST)
            .csrf(csrf -> csrf.disable()) 
            
            // 2. Configurar la gestión de sesiones como STATELESS (Necesario para JWT)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // 3. Definición de Reglas de Autorización
            .authorizeHttpRequests(auth -> auth
                // Permitir el acceso sin autenticación a /auth/register y /auth/login
                .requestMatchers("/auth/register", "/auth/login", "/parking/**").permitAll()
                
                // Permitir también acceso público a la documentación y assets de Vite
                .requestMatchers(
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/index.html", // Rutas para que el frontend funcione
                    "/"
                ).permitAll()
                
                // Las demás peticiones REQUIEREN autenticación
                .anyRequest().authenticated()
            );

        // Si usas JWT, aquí añadirías el filtro de JWT
        // http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return  new BCryptPasswordEncoder();
    }
}