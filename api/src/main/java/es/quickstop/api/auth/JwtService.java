package es.quickstop.api.auth;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import es.quickstop.api.user.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration-ms}")
    private long jwtExpirationMs;

    public String generateToken(User user) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
            .subject(String.valueOf(user.getId()))
            .claim("email", user.getEmail())
            .claim("role", user.getRole().name())
            .issuedAt(now)
            .expiration(expiration)
            .signWith(getSigningKey())
            .compact();
    }

    public Long extractUserId(String token) {
        String subject = extractAllClaims(token).getSubject();
        return Long.parseLong(subject);
    }

    public String extractUserRole(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("role", String.class);
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractAllClaims(token);
            Date expiration = claims.getExpiration();
            return expiration != null && expiration.after(new Date());
        } catch (Exception ex) {
            return false;
        }
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    private SecretKey getSigningKey() {
        try {
            byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (RuntimeException ex) {
            byte[] raw = jwtSecret.getBytes(StandardCharsets.UTF_8);
            return Keys.hmacShaKeyFor(raw);
        }
    }
}
