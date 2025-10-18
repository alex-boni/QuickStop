package es.quickstop.api.auth;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import es.quickstop.api.auth.dto.RegisterRequestDTO;
import es.quickstop.api.auth.dto.LoginRequestDTO;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.junit.jupiter.Container;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.utility.DockerImageName;


/*
 * 
 * Aqui no usaremos mocks, sino que arrancaremos la app completa
 */
@Testcontainers //es una libreria para usar docker en tests como una bd temporal
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT) //arranca la app completa (en unitarios solo controller)
@AutoConfigureMockMvc //crea el bean MockMvc para hacer peticiones simuladas HTTP al controlador
@AutoConfigureTestDatabase(replace = Replace.NONE) //es para no reemplazar la bd configurada en application-test.properties, usar Testcontainers DB
class AuthIntegrationTest {
    /*esto crea un contenedor de postgres con postgis para usar en los tests
    le pone un nomnre, usuario y contraseña
    cuando acabe se destruye
    el warning es porque el ide no detecta que cierra pero el testcontainers si 
    lo hace automaticamente -> podriamos ignorarlo 
    */
    //@SuppressWarnings("resource") -> con esta anotacion se quita el warning
    @Container
    static PostgreSQLContainer<?> postgres =
        new PostgreSQLContainer<>(
            DockerImageName.parse("postgis/postgis:15-3.3")
                .asCompatibleSubstituteFor("postgres")
        )
        .withDatabaseName("testdb")
        .withUsername("test")
        .withPassword("test");
    


    //conecta el spring boot con el contenedor de bd creado arriba
    @DynamicPropertySource
    static void overrideProps(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        // opcional: registry.add("spring.flyway.locations", () -> "classpath:db/migration");
    }

    @Autowired
    private MockMvc mockMvc; //simular peticiones http

    @Autowired
    private ObjectMapper objectMapper; //convertir objetos a json y viceversa

    @Test
    void register_then_login_flow() throws Exception {
        RegisterRequestDTO register = new RegisterRequestDTO(); //creamos el request de registro
        register.setEmail("inttest@example.com"); //ponemos datos ...
        register.setPassword("password123");
        register.setName("Integracion");
        //podemos probar con owner o drive 
        register.setRole("OWNER");
        
        //registraremos un usuario y lo loguearemos despues con las mismas credenciales
        String registerResp = mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(register)))
            .andExpect(status().isCreated())
            .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.email").value("inttest@example.com"))
            .andExpect(jsonPath("$.token").exists())
            .andReturn()
            .getResponse()
            .getContentAsString();

        // Opcional: extraer token/email del response
        JsonNode node = objectMapper.readTree(registerResp);
        String email = node.get("email").asText();

        //login con mismas credenciales
        LoginRequestDTO login = new LoginRequestDTO();
        login.setEmail(email);
        login.setPassword("password123");

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.email").value("inttest@example.com"))
            .andExpect(jsonPath("$.token").exists());
    }
    
}
