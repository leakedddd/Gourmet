package pe.com.gourmet.gourmet.controller.admin;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import pe.com.gourmet.gourmet.dto.EmpleadoDto;
import pe.com.gourmet.gourmet.model.Usuario;
import pe.com.gourmet.gourmet.service.AdminPersonalService;
import org.springframework.security.access.prepost.PreAuthorize;

@Controller
@RequestMapping("/admin/personal")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPersonalController {

    private final AdminPersonalService personalService;

    public AdminPersonalController(AdminPersonalService personalService) {
        this.personalService = personalService;
    }

    @GetMapping
    public String listado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String busqueda,
            Model model
    ) {
        Page<Usuario> empleadosPage = personalService.listarEmpleados(page, size, busqueda);

        model.addAttribute("empleados", empleadosPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", empleadosPage.getTotalPages());
        model.addAttribute("totalElements", empleadosPage.getTotalElements());
        model.addAttribute("busqueda", busqueda != null ? busqueda : "");
        model.addAttribute("empleadoDto", new EmpleadoDto());

        return "admin/admin-personal";
    }

    @PostMapping
    public String crear(@Valid @ModelAttribute("empleadoDto") EmpleadoDto dto,
                        BindingResult br,
                        Model model) {
        if (br.hasErrors()) {
            Page<Usuario> empleadosPage = personalService.listarEmpleados(0, 10, null);
            model.addAttribute("empleados", empleadosPage.getContent());
            model.addAttribute("currentPage", 0);
            model.addAttribute("totalPages", empleadosPage.getTotalPages());
            return "admin/admin-personal";
        }
        try {
            personalService.crearEmpleado(dto);
            return "redirect:/admin/personal?ok=true";
        } catch (IllegalArgumentException ex) {
            Page<Usuario> empleadosPage = personalService.listarEmpleados(0, 10, null);
            model.addAttribute("empleados", empleadosPage.getContent());
            model.addAttribute("currentPage", 0);
            model.addAttribute("totalPages", empleadosPage.getTotalPages());
            model.addAttribute("error", ex.getMessage());
            return "admin/admin-personal";
        }
    }

    @PostMapping("/{id}/rol")
    public String cambiarRol(@PathVariable("id") Integer id,
                             @RequestParam("rol") String rol) {
        personalService.cambiarRol(id, rol);
        return "redirect:/admin/personal?ok=true";
    }

    @PostMapping("/{id}/estado")
    public String cambiarEstado(@PathVariable("id") Integer id,
                                @RequestParam("activo") Boolean activo) {
        personalService.cambiarEstadoCuenta(id, activo);
        return "redirect:/admin/personal?ok=true";
    }
}