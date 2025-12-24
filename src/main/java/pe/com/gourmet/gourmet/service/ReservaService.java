package pe.com.gourmet.gourmet.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.com.gourmet.gourmet.dto.ReservaDto;
import pe.com.gourmet.gourmet.model.Reserva;
import pe.com.gourmet.gourmet.repository.ReservaRepository;
import pe.com.gourmet.gourmet.repository.UsuarioRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final UsuarioRepository usuarioRepository;

    public ReservaService(ReservaRepository reservaRepository, UsuarioRepository usuarioRepository) {
        this.reservaRepository = reservaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public void crearReserva(Integer idUsuario, ReservaDto dto) {
        var usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no existe"));

        Reserva r = new Reserva();
        r.setUsuario(usuario);

        var hoy = LocalDate.now();
        LocalTime ahora = LocalTime.now();
        var maxFecha = hoy.plusMonths(3);

        if (dto.getFecha().isBefore(hoy))
            throw new IllegalArgumentException("Solo puedes reservar desde hoy en adelante.");

        if (dto.getFecha().isAfter(maxFecha))
            throw new IllegalArgumentException("Solo puedes reservar hasta dentro de 3 meses.");

        if (dto.getFecha().isEqual(hoy)) {
            // Verificar que sea antes de las 18:30 (6:30 PM)
            if (ahora.isAfter(LocalTime.of(18, 30))) {
                throw new IllegalArgumentException("Después de las 6:30 PM solo puedes reservar para el día siguiente o posteriores");
            }

            // Calcular hora mínima con 3 horas de anticipación
            LocalTime horaMinima = ahora.plusHours(3);

            if (dto.getHora().isBefore(horaMinima)) {
                throw new IllegalArgumentException(
                        String.format("Para reservas del mismo día necesitas al menos 3 horas de anticipación. Hora mínima disponible: %s",
                                horaMinima.toString())
                );
            }
        }

        r.setFecha(dto.getFecha());
        r.setHora(dto.getHora());
        r.setCantidadPersonas(dto.getPersonas());
        r.setObservaciones(dto.getObservaciones());

        reservaRepository.save(r);
    }

    public List<Reserva> listarMisReservas(Integer idUsuario) {
        return reservaRepository.findByUsuario_IdUsuarioOrderByIdReservaDesc(idUsuario);
    }

    public Page<Reserva> listarReservasAdmin(int page, int size, String estado, String busqueda) {
        Pageable pageable = PageRequest.of(page, size);
        LocalDate hoy = LocalDate.now();

        // Búsqueda por ID
        if (busqueda != null && !busqueda.trim().isEmpty()) {
            try {
                Integer idBuscar = Integer.parseInt(busqueda.trim());
                return reservaRepository.findByIdReserva(idBuscar, pageable);
            } catch (NumberFormatException e) {
                // Si no es un número válido, retornar página vacía
                return Page.empty(pageable);
            }
        }

        // Filtro por estado
        if (estado != null && !estado.isEmpty()) {
            Reserva.EstadoReserva estadoEnum = Reserva.EstadoReserva.valueOf(estado);
            return reservaRepository.findByEstadoOrderByProximasFecha(estadoEnum, hoy, pageable);
        }

        // Todas las reservas
        return reservaRepository.findAllOrderByProximasFecha(hoy, pageable);
    }


    @Transactional
    public void cancelarReserva(Integer idReserva, Integer idUsuario) {
        var r = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new IllegalArgumentException("Reserva no existe"));

        if (!r.getUsuario().getIdUsuario().equals(idUsuario))
            throw new IllegalArgumentException("No puedes cancelar una reserva que no es tuya.");

        if (r.getEstado() != Reserva.EstadoReserva.ACTIVA)
            throw new IllegalArgumentException("Solo puedes cancelar reservas ACTIVAS.");

        r.setEstado(Reserva.EstadoReserva.CANCELADA);
        reservaRepository.save(r);
    }

    public Reserva buscarPorId(Integer idReserva) {
        return reservaRepository.findById(idReserva).orElse(null);
    }

    @Transactional
    public void reprogramarReserva(Integer idReserva, Integer idUsuario, pe.com.gourmet.gourmet.dto.ReprogramarDto dto) {
        var r = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new IllegalArgumentException("Reserva no existe"));

        if (!r.getUsuario().getIdUsuario().equals(idUsuario))
            throw new IllegalArgumentException("No puedes reprogramar una reserva que no es tuya.");

        if (r.getEstado() != Reserva.EstadoReserva.ACTIVA)
            throw new IllegalArgumentException("Solo puedes reprogramar reservas ACTIVAS.");

        var hoy = LocalDate.now();
        var minFecha = hoy.plusDays(1);
        var maxFecha = hoy.plusMonths(3);

        if (dto.getFecha().isBefore(minFecha))
            throw new IllegalArgumentException("No puedes reprogramar para hoy");

        if (dto.getFecha().isAfter(maxFecha))
            throw new IllegalArgumentException("Solo puedes reprogramar hasta dentro de 3 meses.");

        r.setFecha(dto.getFecha());
        r.setHora(dto.getHora());
        r.setObservaciones(dto.getObservaciones());

        reservaRepository.save(r);
    }

    @Transactional
    public void marcarAtendidaAdmin(Integer idReserva) {
        var r = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new IllegalArgumentException("Reserva no existe"));

        if (r.getEstado() != Reserva.EstadoReserva.ACTIVA)
            throw new IllegalArgumentException("Solo puedes atender reservas ACTIVAS.");

        r.setEstado(Reserva.EstadoReserva.ATENDIDA);
        reservaRepository.save(r);
    }

    @Transactional
    public void cancelarAdmin(Integer idReserva) {
        var r = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new IllegalArgumentException("Reserva no existe"));

        if (r.getEstado() != Reserva.EstadoReserva.ACTIVA)
            throw new IllegalArgumentException("Solo puedes cancelar reservas ACTIVAS.");

        r.setEstado(Reserva.EstadoReserva.CANCELADA);
        reservaRepository.save(r);
    }
}
