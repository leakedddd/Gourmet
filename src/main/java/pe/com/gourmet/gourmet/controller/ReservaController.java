package pe.com.gourmet.gourmet.controller;

import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import pe.com.gourmet.gourmet.dto.ReprogramarDto;
import pe.com.gourmet.gourmet.dto.ReservaDto;
import pe.com.gourmet.gourmet.model.Opinion;
import pe.com.gourmet.gourmet.security.details.GourmetUserDetails;
import pe.com.gourmet.gourmet.service.CalendarioService;
import pe.com.gourmet.gourmet.service.OpinionService;
import pe.com.gourmet.gourmet.service.ReservaService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Controller
public class ReservaController {

    private final ReservaService reservaService;
    private final CalendarioService calendarioService;
    private final OpinionService opinionService;

    public ReservaController(ReservaService reservaService, CalendarioService calendarioService, OpinionService opinionService) {
        this.reservaService = reservaService;
        this.calendarioService = calendarioService;
        this.opinionService = opinionService;
    }

    // FORM
    @GetMapping("/reservar")
    public String reservarForm(@AuthenticationPrincipal GourmetUserDetails user, Model model) {
        model.addAttribute("reservaDto", new ReservaDto());

        LocalDate hoy = LocalDate.now();
        LocalDate maxFecha = hoy.plusMonths(3);

        model.addAttribute("meses", calendarioService.buildMeses(hoy, maxFecha));

        return "reservas/reservar-form";
    }


    @PostMapping("/reservar")
    public String reservarPost(@AuthenticationPrincipal GourmetUserDetails user,
                               @Valid @ModelAttribute("reservaDto") ReservaDto dto,
                               BindingResult br,
                               Model model) {

        if (br.hasErrors()) {
            LocalDate hoy = LocalDate.now();
            LocalDate maxFecha = hoy.plusMonths(3);
            model.addAttribute("meses", calendarioService.buildMeses(hoy, maxFecha));
            return "reservas/reservar-form";
        }

        try {
            reservaService.crearReserva(user.getIdUsuario(), dto);
        } catch (IllegalArgumentException ex) {
            model.addAttribute("error", ex.getMessage());
            LocalDate hoy = LocalDate.now();
            LocalDate maxFecha = hoy.plusMonths(3);
            model.addAttribute("meses", calendarioService.buildMeses(hoy, maxFecha));
            return "reservas/reservar-form";
        }

        return "redirect:/mis-reservas?ok=true";
    }

    @GetMapping("/mis-reservas")
    public String misReservas(@AuthenticationPrincipal GourmetUserDetails user, Model model) {

        var reservas = reservaService.listarMisReservas(user.getIdUsuario());
        model.addAttribute("reservas", reservas);

        Map<Integer, Opinion> opiniones = new HashMap<>();
        for (var r : reservas) {
            var op = opinionService.buscarPorReserva(r.getIdReserva());
            if (op != null) opiniones.put(r.getIdReserva(), op);
        }
        model.addAttribute("opiniones", opiniones);

        return "reservas/mis-reservas";
    }

    @PostMapping("/reserva/{id}/cancelar")
    public String cancelarReserva(@PathVariable("id") Integer id,
                                  @AuthenticationPrincipal GourmetUserDetails user) {
        reservaService.cancelarReserva(id, user.getIdUsuario());
        return "redirect:/mis-reservas?cancelada=true";
    }

    @GetMapping("/reserva/{id}/reprogramar")
    public String reprogramarForm(@PathVariable("id") Integer idReserva,
                                  @AuthenticationPrincipal GourmetUserDetails user,
                                  Model model) {

        var r = reservaService.buscarPorId(idReserva);
        if (r == null) return "redirect:/mis-reservas";

        // dueño + activa (seguridad a nivel controller)
        if (!r.getUsuario().getIdUsuario().equals(user.getIdUsuario())) return "redirect:/mis-reservas";
        if (r.getEstado() != pe.com.gourmet.gourmet.model.Reserva.EstadoReserva.ACTIVA) return "redirect:/mis-reservas";

        var hoy = LocalDate.now();
        var minFecha = hoy.plusDays(1);
        var maxFecha = hoy.plusMonths(3);

        ReprogramarDto dto = new ReprogramarDto();
        dto.setFecha(r.getFecha());
        dto.setHora(r.getHora());
        dto.setObservaciones(r.getObservaciones());

        model.addAttribute("reserva", r);
        model.addAttribute("reprogramarDto", dto);
        model.addAttribute("minFecha", minFecha.toString());
        model.addAttribute("maxFecha", maxFecha.toString());
        model.addAttribute("meses", calendarioService.buildMesesReprogramar(hoy, minFecha, maxFecha, r.getFecha()));

        return "reservas/reprogramar-form";
    }

    @PostMapping("/reserva/{id}/reprogramar")
    public String reprogramarPost(@PathVariable("id") Integer idReserva,
                                  @AuthenticationPrincipal GourmetUserDetails user,
                                  @Valid @ModelAttribute("reprogramarDto") ReprogramarDto dto,
                                  BindingResult br,
                                  Model model) {

        var hoy = LocalDate.now();
        var minFecha = hoy.plusDays(1);
        var maxFecha = hoy.plusMonths(3);

        if (br.hasErrors()) {
            var r = reservaService.buscarPorId(idReserva);
            model.addAttribute("reserva", r);
            model.addAttribute("minFecha", minFecha.toString());
            model.addAttribute("maxFecha", maxFecha.toString());
            model.addAttribute("meses", calendarioService.buildMesesReprogramar(hoy, minFecha, maxFecha, dto.getFecha()));
            return "reservas/reprogramar-form";
        }

        try {
            reservaService.reprogramarReserva(idReserva, user.getIdUsuario(), dto);
            return "redirect:/mis-reservas?reprogramada=true";
        } catch (IllegalArgumentException ex) {
            var r = reservaService.buscarPorId(idReserva);
            model.addAttribute("reserva", r);
            model.addAttribute("error", ex.getMessage());
            model.addAttribute("minFecha", minFecha.toString());
            model.addAttribute("maxFecha", maxFecha.toString());
            model.addAttribute("meses", calendarioService.buildMesesReprogramar(hoy, minFecha, maxFecha, dto.getFecha()));
            return "reservas/reprogramar-form";
        }
    }

    @PostMapping("/reserva/{id}/calificar")
    public String calificar(@PathVariable("id") Integer idReserva,
                            @RequestParam("calificacion") Integer calificacion,
                            @RequestParam(value="comentario", required=false) String comentario,
                            @AuthenticationPrincipal GourmetUserDetails user) {

        opinionService.guardarOpinion(idReserva, user.getIdUsuario(), calificacion, comentario);
        return "redirect:/mis-reservas";
    }

}
