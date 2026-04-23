package com.fullstock.config;

import com.fullstock.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(List.of("http://localhost:5173", "http://127.0.0.1:5173"));
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(List.of("*"));
                config.setExposedHeaders(List.of("Content-Disposition"));
                return config;
            }))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex -> ex.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/error").permitAll()

                .requestMatchers("/api/users/**").hasRole("ADMIN")

                .requestMatchers(HttpMethod.GET, "/api/products/**").hasAnyRole("ADMIN", "ALMOXARIFE", "USUARIO")
                .requestMatchers(HttpMethod.POST, "/api/products/**").hasAnyRole("ADMIN", "ALMOXARIFE")
                .requestMatchers(HttpMethod.PUT, "/api/products/**").hasAnyRole("ADMIN", "ALMOXARIFE")
                .requestMatchers(HttpMethod.PATCH, "/api/products/**").hasAnyRole("ADMIN", "ALMOXARIFE")
                .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasAnyRole("ADMIN", "ALMOXARIFE")

                .requestMatchers(HttpMethod.GET, "/api/movements/**").hasAnyRole("ADMIN", "ALMOXARIFE", "USUARIO")
                .requestMatchers(HttpMethod.POST, "/api/movements/**").hasAnyRole("ADMIN", "ALMOXARIFE")

                .requestMatchers(HttpMethod.GET, "/api/inventory/**").hasAnyRole("ADMIN", "ALMOXARIFE", "USUARIO")
                .requestMatchers(HttpMethod.GET, "/api/reports/**").hasAnyRole("ADMIN", "ALMOXARIFE", "USUARIO")
                .requestMatchers(HttpMethod.GET, "/api/dashboard/**").hasAnyRole("ADMIN", "ALMOXARIFE", "USUARIO")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
