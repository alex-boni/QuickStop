package es.quickstop.api.auth;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import es.quickstop.api.auth.dto.AuthResponseDTO;
import es.quickstop.api.auth.dto.RegisterRequestDTO;
import es.quickstop.api.auth.dto.LoginRequestDTO;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.mockito.Mockito;

import java.util.Map;

/*
 * El WebMvcTest carga solo el contexto necesario para testear el controlador, osea no arranca APP
 * 
 * AutoConfigureMockMvc crea el bean MockMvc para hacer peticiones simuladas HTTP al controlador y quita
 * filtros de seguridad como el de 403 (que significa que no estamos autenticados)
 *
 * MockBean crea un mock de AuthService e inyecta en el contexto del test, de forma que
 * cuando el controlador lo necesite, se le inyecta el mock en lugar de la implementación real.
 * 
 * Alex si no lo entiendes me dices y te lo explico
 */
@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false) // <- desactiva los filtros de seguridad (evita 403)
class AuthControllerUnitTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService; // revisar warning del mock

    @Autowired
    private ObjectMapper objectMapper;

    /*
     * Aqui lo que hacemos es crear un request simulado de registro, y mockear
     * la respuesta del AuthService para que devuelva un AuthResponseDTO con datos.
     * 
     * No usamos bd ni logicainterna sino que valudamos que el controlador reciba el
     * JSON,
     * invoque al servicio y retorno lo esperado que es un 201 (created)con el body
     */
    @Test
    void register_returnsCreated_andBody() throws Exception {
        Map<String, Object> req = Map.of( //lo ponemos a map poruque es mas rapido que crear DTO pero en el login podemos usar el DTO
                "email", "user@example.com",
                "password", "password123",
                "name", "Usuario",
                "role", "OWNER"); //creo que aqui no importa el role porque lo tenemos siempre fijo 

        // creamos el mock y definimos su comportamiento con los when - thenReturn
        AuthResponseDTO respMock = Mockito.mock(AuthResponseDTO.class);
        when(respMock.getEmail()).thenReturn("user@example.com");
        when(respMock.getToken()).thenReturn("fake-jwt-token");
        when(authService.register(any(RegisterRequestDTO.class))).thenReturn(respMock);

        // simulamos la peticion POST al endpoint /auth/register con el req convertido a
        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req))) // convertimos el map req a JSON
                .andExpect(status().isCreated()) // HTTP 201
                .andExpect(jsonPath("$.email").value("user@example.com"))
                .andExpect(jsonPath("$.token").value("fake-jwt-token"));
    }

    @Test
    void login_returnsOk_andBody() throws Exception {
        // creamos un objeto de peticiion como el que un user nromal mandaria al hacer
        // un login
        LoginRequestDTO req = new LoginRequestDTO();
        req.setEmail("user@example.com"); // simulamos un login con email y password
        req.setPassword("password123");

        // usmaos el mock para engañar al servidor y no usar la bd real, basicamente
        // creamos un objeto falso
        AuthResponseDTO respMock = Mockito.mock(AuthResponseDTO.class);
        when(respMock.getEmail()).thenReturn("user@example.com"); // esto seria lo que devolveria el servicio
        when(respMock.getToken()).thenReturn("fake-jwt-token"); // en plan si nos piden un token -> "fake-jwt-token"
        when(authService.login(any(LoginRequestDTO.class))).thenReturn(respMock); // cuando el servicio login es llamado
                                                                                  // con cualquier LoginRequestDTO,
                                                                                  // devuelve el respMock

        // hacemos la peticion simulada al endpoint /auth/login con el objeto req
        // convertido a JSON
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("user@example.com"))
                .andExpect(jsonPath("$.token").value("fake-jwt-token"));
    }
}