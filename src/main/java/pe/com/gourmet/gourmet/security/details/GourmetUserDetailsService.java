package pe.com.gourmet.gourmet.security.details;

import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import pe.com.gourmet.gourmet.repository.UsuarioRepository;

@Service
public class GourmetUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public GourmetUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        var usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("No existe el correo: " + correo));

        return new GourmetUserDetails(usuario);
    }
}
