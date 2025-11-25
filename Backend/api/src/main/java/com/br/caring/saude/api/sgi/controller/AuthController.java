package com.br.caring.saude.api.sgi.controller;

import com.br.caring.saude.api.sgi.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refreshToken(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        if (refreshToken == null || !jwtUtil.validateRefreshToken(refreshToken)) {
            return ResponseEntity.status(401).body(Map.of("error", "Refresh token inválido"));
        }
        String subject = jwtUtil.getSubject(refreshToken);
        Map<String, Object> claims = jwtUtil.getClaimsFromToken(refreshToken);
        String newToken = jwtUtil.generateToken(subject, claims);
        String newRefreshToken = jwtUtil.generateRefreshToken(subject, claims);
        Map<String, String> response = new HashMap<>();
        response.put("token", newToken);
        response.put("refreshToken", newRefreshToken);
        return ResponseEntity.ok(response);
    }
}

