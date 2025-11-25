package com.br.caring.saude.api.sgi.domain.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "SGI_USUARIO_PERMISSAO")
@IdClass(UsuarioPermissao.UsuarioPermissaoId.class)
public class UsuarioPermissao {
    @Id
    @Column(name = "USU_ID")
    private Long usuId;

    @Id
    @Column(name = "PERM_ID")
    private Long permId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PERM_ID", insertable = false, updatable = false)
    private Permissao permissao;

    public UsuarioPermissao() {}
    public UsuarioPermissao(Long usuId, Long permId) {
        this.usuId = usuId;
        this.permId = permId;
    }

    public static class UsuarioPermissaoId implements Serializable {
        private Long usuId;
        private Long permId;
        public UsuarioPermissaoId() {}
        public UsuarioPermissaoId(Long usuId, Long permId) {
            this.usuId = usuId;
            this.permId = permId;
        }
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            UsuarioPermissaoId that = (UsuarioPermissaoId) o;
            return usuId.equals(that.usuId) && permId.equals(that.permId);
        }
        @Override
        public int hashCode() {
            return usuId.hashCode() + permId.hashCode();
        }
    }
}
