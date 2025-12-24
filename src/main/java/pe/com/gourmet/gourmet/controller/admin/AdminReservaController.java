package pe.com.gourmet.gourmet.controller.admin;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import pe.com.gourmet.gourmet.model.Reserva;
import pe.com.gourmet.gourmet.service.ReservaService;
import org.springframework.security.access.prepost.PreAuthorize;

@Controller
@RequestMapping("/admin/reservas")
@PreAuthorize("hasAnyRole('EMPLEADO','ADMIN')")
public class AdminReservaController {

    private final ReservaService reservaService;

    public AdminReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @GetMapping
    public String listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String busqueda,
            Model model
    ) {
        Page<Reserva> reservasPage = reservaService.listarReservasAdmin(page, size, estado, busqueda);

        model.addAttribute("reservas", reservasPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", reservasPage.getTotalPages());
        model.addAttribute("totalElements", reservasPage.getTotalElements());
        model.addAttribute("estadoSel", estado != null ? estado : "");
        model.addAttribute("busqueda", busqueda != null ? busqueda : "");

        return "admin/admin-reservas";
    }

    @PostMapping("/{id}/atender")
    public String atender(@PathVariable Integer id) {
        reservaService.marcarAtendidaAdmin(id);
        return "redirect:/admin/reservas?ok=atendida";
    }

    @PostMapping("/{id}/cancelar")
    public String cancelar(@PathVariable Integer id) {
        reservaService.cancelarAdmin(id);
        return "redirect:/admin/reservas?ok=cancelada";
    }
}