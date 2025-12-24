package pe.com.gourmet.gourmet.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Opinion")
public class Opinion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_opinion")
    private Integer idOpinion;

    @OneToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_reserva", nullable = false, unique = true)
    private Reserva reserva;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(name = "calificacion", nullable = false)
    private Integer calificacion; // 1..5

    @Column(name = "comentario", length = 500)
    private String comentario;

    public Integer getIdOpinion() {
        return idOpinion;
    }

    public void setIdOpinion(Integer idOpinion) {
        this.idOpinion = idOpinion;
    }

    public Reserva getReserva() {
        return reserva;
    }

    public void setReserva(Reserva reserva) {
        this.reserva = reserva;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Integer getCalificacion() {
        return calificacion;
    }

    public void setCalificacion(Integer calificacion) {
        this.calificacion = calificacion;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
}
