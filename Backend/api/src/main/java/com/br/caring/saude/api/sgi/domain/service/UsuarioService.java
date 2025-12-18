package com.br.caring.saude.api.sgi.domain.service;

import com.br.caring.saude.api.sgi.domain.entity.Usuario;
import com.br.caring.saude.api.sgi.domain.entity.Perfil;
import com.br.caring.saude.api.sgi.domain.entity.Permissao;
import com.br.caring.saude.api.sgi.domain.entity.TeaClinica;
import com.br.caring.saude.api.sgi.domain.entity.TeaTerapeuta;
import com.br.caring.saude.api.sgi.domain.entity.TeaPaciente;
import com.br.caring.saude.api.sgi.domain.repository.PerfilRepository;
import com.br.caring.saude.api.sgi.domain.repository.PermissaoRepository;
import com.br.caring.saude.api.sgi.domain.repository.UsuarioRepository;

import com.br.caring.saude.api.sgi.domain.repository.TeaClinicaRepository;
import com.br.caring.saude.api.sgi.domain.repository.TeaTerapeutaRepository;
import com.br.caring.saude.api.sgi.domain.repository.TeaPacienteRepository;
import com.br.caring.saude.api.sgi.dto.LoginRequestDTO;
import com.br.caring.saude.api.sgi.dto.LoginResponseDTO;
import com.br.caring.saude.api.sgi.dto.UsuarioRequestDTO;
import com.br.caring.saude.api.sgi.dto.UsuarioResponseDTO;
import com.br.caring.saude.api.sgi.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PerfilRepository perfilRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PermissaoRepository permissaoRepository;




    @Autowired
    private TeaClinicaRepository teaClinicaRepository;

    @Autowired
    private TeaTerapeutaRepository teaTerapeutaRepository;
    @Autowired
    private TeaPacienteRepository teaPacienteRepository;

    public UsuarioResponseDTO criarUsuario(UsuarioRequestDTO requestDTO) {
        // Verifica se já existe usuário com o mesmo CPF
        if (usuarioRepository.existsByCpf(requestDTO.getCpf())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "CPF já cadastrado");
        }

        // Verifica se já existe usuário com o mesmo email
        if (usuarioRepository.existsByEmail(requestDTO.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email já cadastrado");
        }

        // Valida/busca o perfil (se não informado, usar "USER")
        Perfil perfil;
        Object perfilValue = requestDTO.getPerfil();
        if (perfilValue == null) {
            perfil = perfilRepository.findByNome("USER")
                .orElseGet(() -> perfilRepository.save(new Perfil("USER", "Criado automaticamente")));
        } else if (perfilValue instanceof Number) {
            Long perfilId = ((Number) perfilValue).longValue();
            perfil = perfilRepository.findById(perfilId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Perfil não encontrado com ID: " + perfilId));
        } else {
            String perfilNome = perfilValue.toString().trim().toUpperCase();
            if (perfilNome.equals("USUARIO")) perfilNome = "USER";
            if (!perfilNome.matches("^(USER|ADMIN|GESTOR|TERAPEUTA|PACIENTE)$")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Perfil inválido. Use USER, ADMIN, GESTOR, TERAPEUTA, PACIENTE ou seus IDs correspondentes");
            }
            final String perfilNomeFinal = perfilNome;
            perfil = perfilRepository.findByNome(perfilNomeFinal)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Perfil não encontrado: " + perfilNomeFinal));
        }

        Usuario usuario = new Usuario();
        usuario.setCpf(requestDTO.getCpf());
        usuario.setNome(requestDTO.getNome());
        usuario.setEmail(requestDTO.getEmail());
        usuario.setSenha(passwordEncoder.encode(requestDTO.getSenha()));
        usuario.setPerfil(perfil);
        usuario.setStatus(true);
        usuario.setTelefone(requestDTO.getTelefone());

        // Vincular clínica se informado
        if (requestDTO.getTeaCliId() != null) {
            TeaClinica clinica = teaClinicaRepository.findById(requestDTO.getTeaCliId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Clínica não encontrada"));
            usuario.setTeaClinica(clinica);
        } else {
            usuario.setTeaClinica(null);
        }

        // Vincular permissões enviadas pelo frontend (roles)
        if (requestDTO.getRoles() != null && !requestDTO.getRoles().isEmpty()) {
            List<Permissao> permissoes = permissaoRepository.findAll().stream()
                .filter(p -> requestDTO.getRoles().contains(p.getNome()))
                .toList();
            usuario.getPermissoes().clear();
            usuario.getPermissoes().addAll(permissoes);
        }

        usuario = usuarioRepository.save(usuario);

        return converterParaDTO(usuario);
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> listarUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponseDTO> listarUsuarios(Long clinicaId) {
        if (clinicaId != null) {
            return usuarioRepository.findAll().stream()
                    .filter(u -> u.getTeaClinica() != null && u.getTeaClinica().getId().equals(clinicaId))
                    .map(this::converterParaDTO)
                    .collect(Collectors.toList());
        } else {
            return usuarioRepository.findAll().stream()
                    .map(this::converterParaDTO)
                    .collect(Collectors.toList());
        }
    }

    @Transactional(readOnly = true)
    public UsuarioResponseDTO buscarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
        return converterParaDTO(usuario);
    }

    public UsuarioResponseDTO atualizarUsuario(Long id, UsuarioRequestDTO requestDTO) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        // Verifica se o email já existe para outro usuário
        if (!usuario.getEmail().equals(requestDTO.getEmail()) &&
            usuarioRepository.existsByEmail(requestDTO.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email já cadastrado");
        }

        // Valida/busca o perfil
        Perfil perfil;
        if (requestDTO.getPerfil() != null) {
            Object perfilValue = requestDTO.getPerfil();
            if (perfilValue instanceof Number) {
                Long perfilId = ((Number) perfilValue).longValue();
                perfil = perfilRepository.findById(perfilId)
                    .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Perfil não encontrado com ID: " + perfilId));
            } else {
                String perfilNome = perfilValue.toString().trim().toUpperCase();
                if (perfilNome.equals("USUARIO")) perfilNome = "USER";
                if (!perfilNome.matches("^(USER|ADMIN|GESTOR|TERAPEUTA|PACIENTE)$")) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Perfil inválido. Use USER, ADMIN, GESTOR, TERAPEUTA, PACIENTE ou seus IDs correspondentes");
                }
                final String perfilNomeFinal2 = perfilNome;
                perfil = perfilRepository.findByNome(perfilNomeFinal2)
                    .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Perfil não encontrado com nome: " + perfilNomeFinal2));
            }
        } else {
            perfil = usuario.getPerfil();
        }

        usuario.setNome(requestDTO.getNome());
        usuario.setEmail(requestDTO.getEmail());
        if (requestDTO.getSenha() != null && !requestDTO.getSenha().isBlank()) {
            usuario.setSenha(passwordEncoder.encode(requestDTO.getSenha()));
        }
        usuario.setPerfil(perfil);
        usuario.setTelefone(requestDTO.getTelefone());

        // Vincular clínica se informado
        if (requestDTO.getTeaCliId() != null) {
            TeaClinica clinica = teaClinicaRepository.findById(requestDTO.getTeaCliId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Clínica não encontrada"));
            usuario.setTeaClinica(clinica);
        } else {
            usuario.setTeaClinica(null);
        }

        // Vincular permissões enviadas pelo frontend (roles)
        if (requestDTO.getRoles() != null && !requestDTO.getRoles().isEmpty()) {
            List<Permissao> permissoes = permissaoRepository.findAll().stream()
                .filter(p -> requestDTO.getRoles().contains(p.getNome()))
                .toList();
            usuario.getPermissoes().clear();
            usuario.getPermissoes().addAll(permissoes);
        }

        usuario = usuarioRepository.save(usuario);

        return converterParaDTO(usuario);
    }

    public void deletarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado");
        }
        usuarioRepository.deleteById(id);
    }

    // Substitui o método antigo login(LoginRequestDTO) para usar LoginResultDTO
    @Transactional(readOnly = true)
    public LoginResponseDTO login(LoginRequestDTO request) {
        System.out.println("===============================================");
        System.out.println("DEBUG - Iniciando processo de login");
        System.out.println("Email recebido: " + request.getEmail());

        try {
            System.out.println("Buscando usuário no banco...");
            var usuarioOptional = usuarioRepository.findByEmail(request.getEmail());

            if (usuarioOptional.isEmpty()) {
                // Não achou em usuários, tenta terapeuta
                var terapeutaOptional = teaTerapeutaRepository.findByEmail(request.getEmail());
                if (terapeutaOptional.isPresent()) {
                    TeaTerapeuta terapeuta = terapeutaOptional.get();
                    boolean senhaCorreta = passwordEncoder.matches(request.getSenha(), terapeuta.getSenha());
                    if (!senhaCorreta) {
                        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou senha inválidos");
                    }
                    LoginResponseDTO response = new LoginResponseDTO();
                    LoginResponseDTO.UsuarioResponseDTO userDto = new LoginResponseDTO.UsuarioResponseDTO();
                    userDto.setId(terapeuta.getId());
                    userDto.setNome(terapeuta.getNome());
                    userDto.setEmail(terapeuta.getEmail());
                    userDto.setStatus(terapeuta.getStatus() != null && terapeuta.getStatus() == 1);
                    userDto.setPerfil("TERAPEUTA");
                    userDto.setPerfilId(terapeuta.getPerfilId());
                    userDto.setTelefone(terapeuta.getTelefone());
                    userDto.setTeaCliId(terapeuta.getClinicaId());
                    // Permitir roles do front, se existirem, senão usar padrão
                    if (terapeuta.getRoles() != null && !terapeuta.getRoles().isEmpty()) {
                        userDto.setRoles(terapeuta.getRoles());
                    } else {
                        userDto.setRoles(List.of("TERAPEUTA_MODULO"));
                    }
                    response.setUser(userDto);
                    Map<String, Object> claims = new HashMap<>();
                    claims.put("id", terapeuta.getId());
                    claims.put("nome", terapeuta.getNome());
                    claims.put("email", terapeuta.getEmail());
                    claims.put("perfil", "TERAPEUTA");
                    String token = jwtUtil.generateToken(terapeuta.getId().toString(), claims);
                    response.setToken(token);
                    String refreshToken = jwtUtil.generateRefreshToken(terapeuta.getId().toString(), claims);
                    response.setRefreshToken(refreshToken);
                    return response;
                }
                // Não achou em terapeuta, tenta paciente
                var pacienteOptional = teaPacienteRepository.findByEmail(request.getEmail());
                if (pacienteOptional.isPresent()) {
                    TeaPaciente paciente = pacienteOptional.get();
                    boolean senhaCorreta = passwordEncoder.matches(request.getSenha(), paciente.getSenha());
                    if (!senhaCorreta) {
                        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou senha inválidos");
                    }
                    LoginResponseDTO response = new LoginResponseDTO();
                    LoginResponseDTO.UsuarioResponseDTO userDto = new LoginResponseDTO.UsuarioResponseDTO();
                    userDto.setId(paciente.getId());
                    userDto.setNome(paciente.getNome());
                    userDto.setEmail(paciente.getEmail());
                    userDto.setStatus(paciente.getStatus() != null && paciente.getStatus() == 1);
                    userDto.setPerfil("PACIENTE");
                    userDto.setPerfilId(null); // Pacientes não têm perfil no sistema
                    userDto.setTelefone(paciente.getTelefone());
                    userDto.setTeaCliId(paciente.getClinicaId());
                    if (paciente.getRoles() != null && !paciente.getRoles().isEmpty()) {
                        userDto.setRoles(paciente.getRoles());
                    } else {
                        userDto.setRoles(List.of("PACIENTE_MODULO"));
                    }
                    response.setUser(userDto);
                    Map<String, Object> claims = new HashMap<>();
                    claims.put("id", paciente.getId());
                    claims.put("nome", paciente.getNome());
                    claims.put("email", paciente.getEmail());
                    claims.put("perfil", "PACIENTE");
                    String token = jwtUtil.generateToken(paciente.getId().toString(), claims);
                    response.setToken(token);
                    String refreshToken = jwtUtil.generateRefreshToken(paciente.getId().toString(), claims);
                    response.setRefreshToken(refreshToken);
                    return response;
                }
                // Não achou em nenhum
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou senha inválidos");
            }

            Usuario usuario = usuarioOptional.get();

            // FORÇAR CARREGAMENTO DOS RELACIONAMENTOS (inicializa proxies do Hibernate)
            if (usuario.getPerfil() != null) {
                usuario.getPerfil().getId(); // Força carregar Perfil
                usuario.getPerfil().getNome(); // Força carregar nome
            }
            if (usuario.getTeaClinica() != null) {
                usuario.getTeaClinica().getId(); // Força carregar TeaClinica
                usuario.getTeaClinica().getNome(); // Força carregar nome
            }

            System.out.println("Usuário encontrado:");
            System.out.println("ID: " + usuario.getId());
            System.out.println("Email: " + usuario.getEmail());
            System.out.println("Nome: " + usuario.getNome());
            System.out.println("Hash da senha no banco: " + usuario.getSenha());
            System.out.println("Senha fornecida (antes do hash): " + request.getSenha());

            boolean senhaCorreta = passwordEncoder.matches(request.getSenha(), usuario.getSenha());
            System.out.println("Resultado da verificação da senha: " + senhaCorreta);

            if (!senhaCorreta) {
                System.out.println("ERRO - Senha incorreta");
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou senha inválidos");
            }

            System.out.println("Senha correta, gerando response e token...");

            LoginResponseDTO response = new LoginResponseDTO();
            LoginResponseDTO.UsuarioResponseDTO userDto = new LoginResponseDTO.UsuarioResponseDTO();
            userDto.setId(usuario.getId());
            userDto.setCpf(usuario.getCpf());
            userDto.setNome(usuario.getNome());
            userDto.setEmail(usuario.getEmail());
            userDto.setStatus(usuario.getStatus());
            userDto.setPerfil(usuario.getPerfil() != null ? usuario.getPerfil().getNome() : null);
            userDto.setPerfilId(usuario.getPerfil() != null ? usuario.getPerfil().getId() : null);
            userDto.setTelefone(usuario.getTelefone());
            userDto.setTeaCliId(usuario.getTeaClinica() != null ? usuario.getTeaClinica().getId() : null);
            // Buscar permissões do usuário
            if (usuario.getPermissoes() != null) {
                var roles = usuario.getPermissoes().stream()
                    .map(Permissao::getNome)
                    .toList();
                userDto.setRoles(roles);
            }
            response.setUser(userDto);
            // Gerar token JWT e retorna no response esses dados
            Map<String, Object> claims = new HashMap<>();
            claims.put("id", usuario.getId());
            claims.put("nome", usuario.getNome());
            claims.put("email", usuario.getEmail());
            claims.put("perfil", usuario.getPerfil() != null ? usuario.getPerfil().getNome() : null);
            String token = jwtUtil.generateToken(usuario.getId().toString(), claims);
            response.setToken(token);
            String refreshToken = jwtUtil.generateRefreshToken(usuario.getId().toString(), claims);
            response.setRefreshToken(refreshToken);

            System.out.println("Login concluído com sucesso. Token gerado.");
            return response;
        } catch (Exception e) {
            System.err.println("Erro durante o login: " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Erro ao realizar login: " + e.getMessage());
        } finally {
            System.out.println("===============================================");
        }
    }

    private UsuarioResponseDTO converterParaDTO(Usuario usuario) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());
        dto.setStatus(usuario.getStatus());
        dto.setPerfil(usuario.getPerfil() != null ? usuario.getPerfil().getNome() : null);
        dto.setPerfilId(usuario.getPerfil() != null ? usuario.getPerfil().getId() : null);
        dto.setTelefone(usuario.getTelefone());
        dto.setTeaCliId(usuario.getTeaClinica() != null ? usuario.getTeaClinica().getId() : null);

        if (usuario.getPermissoes() != null) {
            var roles = usuario.getPermissoes().stream()
                .map(Permissao::getNome)
                .toList();
            dto.setRoles(roles);
        }
        return dto;
    }
}
