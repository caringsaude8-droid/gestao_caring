package com.br.caring.saude.api.sgi.dto;

import lombok.Data;

@Data
public class LoginResultDTO {
    private String token;
    private String refreshToken;
    private UsuarioResponseDTO user;

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
