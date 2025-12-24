package pe.com.gourmet.gourmet.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.com.gourmet.gourmet.dto.RegisterDto;
import pe.com.gourmet.gourmet.model.Usuario;
import pe.com.gourmet.gourmet.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void registrarCliente(RegisterDto dto) {
        String correo = dto.getCorreo().trim().toLowerCase();

        if (usuarioRepository.existsByCorreo(correo)) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }
        if (!dto.getClave().equals(dto.getConfirmarClave())) {
            throw new IllegalArgumentException("Las claves no coinciden");
        }

        Usuario u = new Usuario();
        u.setNombres(dto.getNombres().trim());
        u.setCorreo(correo);
        u.setTelefono(dto.getTelefono().trim());
        u.setClave(passwordEncoder.encode(dto.getClave())); // BCrypt ✅
        u.setRol(Usuario.RolUsuario.CLIENTE);

        usuarioRepository.save(u);
    }
}
