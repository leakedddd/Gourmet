package pe.com.gourmet.gourmet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.com.gourmet.gourmet.model.Opinion;

import java.util.Optional;

public interface OpinionRepository extends JpaRepository<Opinion, Integer> {

    Optional<Opinion> findByReserva_IdReserva(Integer idReserva);

    boolean existsByReserva_IdReserva(Integer idReserva);
}
