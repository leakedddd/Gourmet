package pe.com.gourmet.gourmet.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pe.com.gourmet.gourmet.model.Reserva;

import java.time.LocalDate;
import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Integer> {
    List<Reserva> findByUsuario_IdUsuarioOrderByIdReservaDesc(Integer idUsuario);
    List<Reserva> findAllByOrderByFechaAscHoraAsc();
    List<Reserva> findByEstadoOrderByFechaAscHoraAsc(Reserva.EstadoReserva estado);

    @Query("SELECT r FROM Reserva r ORDER BY " +
            "CASE WHEN r.fecha >= :hoy THEN 0 ELSE 1 END, " +
            "r.fecha ASC, r.hora ASC")
    Page<Reserva> findAllOrderByProximasFecha(@Param("hoy") LocalDate hoy, Pageable pageable);

    @Query("SELECT r FROM Reserva r WHERE r.estado = :estado ORDER BY " +
            "CASE WHEN r.fecha >= :hoy THEN 0 ELSE 1 END, " +
            "r.fecha ASC, r.hora ASC")
    Page<Reserva> findByEstadoOrderByProximasFecha(@Param("estado") Reserva.EstadoReserva estado,
                                                   @Param("hoy") LocalDate hoy,
                                                   Pageable pageable);
    @Query("SELECT r FROM Reserva r WHERE r.idReserva = :id")
    Page<Reserva> findByIdReserva(@Param("id") Integer id, Pageable pageable);
}
