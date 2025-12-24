package pe.com.gourmet.gourmet.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.com.gourmet.gourmet.model.Opinion;
import pe.com.gourmet.gourmet.model.Reserva;
import pe.com.gourmet.gourmet.model.Usuario;
import pe.com.gourmet.gourmet.repository.OpinionRepository;
import pe.com.gourmet.gourmet.repository.ReservaRepository;
import pe.com.gourmet.gourmet.repository.UsuarioRepository;

@Service
public class OpinionService {

    private final OpinionRepository opinionRepository;
    private final ReservaRepository reservaRepository;
    private final UsuarioRepository usuarioRepository;

    public OpinionService(OpinionRepository opinionRepository, ReservaRepository reservaRepository, UsuarioRepository usuarioRepository) {
        this.opinionRepository = opinionRepository;
        this.reservaRepository = reservaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Opinion buscarPorReserva(Integer idReserva) {
        return opinionRepository.findByReserva_IdReserva(idReserva).orElse(null);
    }

    @Transactional
    public void guardarOpinion(Integer idReserva, Integer idUsuario, Integer calificacion, String comentario) {

        Reserva r = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new IllegalArgumentException("Reserva no existe"));

        // validar que la reserva sea del usuario (seguridad)
        if (!r.getUsuario().getIdUsuario().equals(idUsuario)) {
            throw new IllegalArgumentException("No puedes calificar una reserva que no es tuya");
        }

        // validar estado ATENDIDA (tu regla)
        if (r.getEstado() != Reserva.EstadoReserva.ATENDIDA) {
            throw new IllegalArgumentException("Solo puedes calificar reservas atendidas");
        }

        // evitar duplicado (por UNIQUE id_reserva)
        if (opinionRepository.existsByReserva_IdReserva(idReserva)) {
            throw new IllegalArgumentException("Esta reserva ya fue calificada");
        }

        Usuario u = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no existe"));

        Opinion op = new Opinion();
        op.setReserva(r);
        op.setUsuario(u);
        op.setCalificacion(calificacion);
        op.setComentario(comentario);

        opinionRepository.save(op);
    }
}
