package pe.com.gourmet.gourmet.security.details;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import pe.com.gourmet.gourmet.model.Usuario;

import java.util.Collection;
import java.util.List;

public class GourmetUserDetails implements UserDetails {

    private final Integer idUsuario;
    private final String nombres;
    private final String correo;
    private final String clave;
    private final Usuario.RolUsuario rol;
    private final Boolean activo;

    public GourmetUserDetails(Usuario u) {
        this.idUsuario = u.getIdUsuario();
        this.nombres = u.getNombres();
        this.correo = u.getCorreo();
        this.clave = u.getClave();
        this.rol = u.getRol();
        this.activo = u.getActivo();
    }

    public Integer getIdUsuario() { return idUsuario; }
    public String getNombres() { return nombres; }
    public Usuario.RolUsuario getRol() { return rol; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // hasRole("ADMIN") => espera "ROLE_ADMIN"
        return List.of(new SimpleGrantedAuthority("ROLE_" + rol.name()));
    }

    @Override public String getUsername() { return correo; }
    @Override public String getPassword() { return clave; }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() {
        return activo != null && activo;
    }
}
