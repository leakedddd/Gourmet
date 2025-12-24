package pe.com.gourmet.gourmet.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pe.com.gourmet.gourmet.model.Usuario;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByCorreo(String correo);
    boolean existsByCorreo(String correo);
    List<Usuario> findByRol(Usuario.RolUsuario rol);
    Page<Usuario> findByRol(Usuario.RolUsuario rol, Pageable pageable);

    @Query
            ("SELECT u FROM Usuario u WHERE u.rol = :rol AND LOWER(u.nombres) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    Page<Usuario> buscarEmpleadosPorNombre(@Param("rol") Usuario.RolUsuario rol,
                                           @Param("nombre") String nombre,
                                           Pageable pageable);
}
