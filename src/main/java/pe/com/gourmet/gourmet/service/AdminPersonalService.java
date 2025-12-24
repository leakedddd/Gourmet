package pe.com.gourmet.gourmet.service;

import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pe.com.gourmet.gourmet.dto.EmpleadoDto;
import pe.com.gourmet.gourmet.model.Usuario;
import pe.com.gourmet.gourmet.repository.UsuarioRepository;

import java.util.List;

@Service
public class AdminPersonalService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminPersonalService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Page<Usuario> listarEmpleados(int page, int size, String busqueda) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("nombres").ascending());

        if (busqueda != null && !busqueda.trim().isEmpty()) {
            return usuarioRepository.buscarEmpleadosPorNombre(
                    Usuario.RolUsuario.EMPLEADO,
                    busqueda.trim(),
                    pageable
            );
        }

        return usuarioRepository.findByRol(Usuario.RolUsuario.EMPLEADO, pageable);
    }

    public List<Usuario> listarEmpleados() {
        return usuarioRepository.findByRol(Usuario.RolUsuario.EMPLEADO);
    }

    @Transactional
    public void crearEmpleado(EmpleadoDto dto) {
        if (usuarioRepository.existsByCorreo(dto.getCorreo()))
            throw new IllegalArgumentException("El correo ya existe.");

        Usuario u = new Usuario();
        u.setNombres(dto.getNombres());
        u.setCorreo(dto.getCorreo());
        u.setTelefono(dto.getTelefono());
        u.setClave(passwordEncoder.encode(dto.getClave()));
        u.setRol(Usuario.RolUsuario.valueOf(dto.getRol())); // EMPLEADO (o ADMIN si permites)
        u.setActivo(true);

        usuarioRepository.save(u);
    }

    @Transactional
    public void cambiarRol(Integer idUsuario, String rol) {
        Usuario u = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no existe"));
        Usuario.RolUsuario nuevoRol = Usuario.RolUsuario.valueOf(rol);
        u.setRol(nuevoRol);
        usuarioRepository.save(u);
    }

    @Transactional
    public void cambiarEstadoCuenta(Integer idUsuario, Boolean activo) {
        Usuario u = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no existe"));
        u.setActivo(activo);
        usuarioRepository.save(u);
    }
}
