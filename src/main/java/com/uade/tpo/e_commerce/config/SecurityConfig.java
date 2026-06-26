package com.uade.tpo.e_commerce.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.uade.tpo.e_commerce.model.Role;
import com.uade.tpo.e_commerce.repository.UsuarioRepository;
import com.uade.tpo.e_commerce.security.JwtFilter;

import lombok.RequiredArgsConstructor;

import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.config.http.SessionCreationPolicy;

import com.uade.tpo.e_commerce.security.CsrfCookieFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final CsrfCookieFilter csrfCookieFilter;
    private final UsuarioRepository usuarioRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        CsrfTokenRequestAttributeHandler requestHandler = new CsrfTokenRequestAttributeHandler();
        requestHandler.setCsrfRequestAttributeName(null);

        http
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .headers(headers -> headers
                        .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'; frame-ancestors 'none';"))
                )
                .csrf(csrf -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .csrfTokenRequestHandler(requestHandler)
                        .ignoringRequestMatchers("/api/auth/**")
                )
                // Definimos qué endpoints son públicos y cuáles requieren auth/rol.
                .authorizeHttpRequests(auth -> auth
                        // Publicos
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categorias/**").permitAll()

                        // Protegidos por rol: productos (sólo ADMIN y VENDEDOR)
                        .requestMatchers(HttpMethod.POST, "/api/productos").hasAnyRole(Role.ADMIN.name(), Role.VENDEDOR.name())
                        .requestMatchers(HttpMethod.PUT, "/api/productos/**").hasAnyRole(Role.ADMIN.name(), Role.VENDEDOR.name())
                        .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasAnyRole(Role.ADMIN.name(), Role.VENDEDOR.name())

                        // Protegidos por rol: categorias y usuarios
                        .requestMatchers(HttpMethod.POST, "/api/categorias").hasRole(Role.ADMIN.name())
                        .requestMatchers(HttpMethod.PUT, "/api/categorias/**").hasRole(Role.ADMIN.name())
                        .requestMatchers(HttpMethod.DELETE, "/api/categorias/**").hasRole(Role.ADMIN.name())
                        .requestMatchers("/api/usuarios/**").hasRole(Role.ADMIN.name())

                        // Protegidos: carrito
                        .requestMatchers("/api/carrito/**").authenticated()

                        // Fallback
                        .anyRequest().authenticated())
                .addFilterAfter(csrfCookieFilter, org.springframework.security.web.authentication.www.BasicAuthenticationFilter.class)
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        // El filtro JWT corre antes del filtro de usuario/password de Spring.

        return http.build();
    }
}
