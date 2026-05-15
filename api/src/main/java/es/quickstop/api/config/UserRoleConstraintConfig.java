package es.quickstop.api.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@ConditionalOnExpression("'${spring.datasource.url:}'.contains('postgresql')")
public class UserRoleConstraintConfig {

    private final JdbcTemplate jdbcTemplate;

    @EventListener(ApplicationReadyEvent.class)
    public void ensureUserRoleConstraintSupportsBoth() {
        jdbcTemplate.execute("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check");
        jdbcTemplate.execute(
            "ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('OWNER', 'DRIVER', 'BOTH'))"
        );
    }
}

