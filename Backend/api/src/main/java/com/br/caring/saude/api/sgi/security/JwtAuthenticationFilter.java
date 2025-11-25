package com.br.caring.saude.api.sgi.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtil jwtUtil;


    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.equals("/api/v1/usuarios/login") ||
               request.getMethod().equals("OPTIONS");
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            logger.debug("Authorization header present - attempting to validate token for request {} {}", request.getMethod(), request.getRequestURI());
            try {
                boolean valid = jwtUtil.validateToken(token);
                logger.debug("Token validation result: {}", valid);
                if (valid) {
                    String subject = null;
                    try {
                        subject = jwtUtil.getSubject(token);
                    } catch (Exception ex) {
                        logger.warn("Failed to parse subject from token: {}", ex.getMessage());
                    }
                    if (subject != null) {
                        try {
                            var claims = jwtUtil.getClaimsFromToken(token);
                            String perfil = claims != null && claims.get("perfil") != null ? claims.get("perfil").toString() : null;
                            List<SimpleGrantedAuthority> authorities = perfil != null ?
                                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + perfil)) : Collections.emptyList();

                            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(subject, null, authorities);
                            SecurityContextHolder.getContext().setAuthentication(auth);
                            logger.debug("Authentication created for subject: {} with authorities: {}", subject, authorities);
                        } catch (Exception ex) {
                            logger.warn("Failed to parse claims from token: {}", ex.getMessage());
                            respondUnauthorized(response);
                            return;
                        }
                    } else {
                        logger.warn("Token validated but subject is null");
                        respondUnauthorized(response);
                        return;
                    }
                    // token válido e Authentication setada -> segue a cadeia
                    filterChain.doFilter(request, response);
                    return;
                } else {
                    logger.info("Token inválido ou expirado para request {} {}", request.getMethod(), request.getRequestURI());
                    respondUnauthorized(response);
                    return;
                }
            } catch (Exception ex) {
                // Em caso de erro na validação (formato, assinatura etc), responder 401 JSON e logar o detalhe
                logger.error("Erro ao validar token: {}", ex.getMessage(), ex);
                respondUnauthorized(response);
                return;
            }
        }
        // sem header Authorization -> continua normalmente (endpoints protegidos responderão 401)
        filterChain.doFilter(request, response);
    }

    private void respondUnauthorized(HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        String body = String.format("{\"status\":%d,\"message\":\"%s\"}", HttpServletResponse.SC_UNAUTHORIZED, "Token inválido ou expirado");
        response.getWriter().write(body);
    }
}
