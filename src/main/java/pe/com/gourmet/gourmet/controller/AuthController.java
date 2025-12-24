package pe.com.gourmet.gourmet.controller;

import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import pe.com.gourmet.gourmet.dto.RegisterDto;
import pe.com.gourmet.gourmet.service.UsuarioService;

@Controller
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/login")
    public String login() {
        return "auth/login";
    }

    @GetMapping("/register")
    public String registerForm(Model model) {
        model.addAttribute("registerDto", new RegisterDto());
        return "auth/register";
    }

    @PostMapping("/register")
    public String registerPost(
            @Valid @ModelAttribute("registerDto") RegisterDto dto,
            BindingResult br,
            Model model
    ) {
        if (br.hasErrors()) {
            return "auth/register";
        }

        try {
            usuarioService.registrarCliente(dto);
        } catch (IllegalArgumentException ex) {
            model.addAttribute("error", ex.getMessage());
            return "auth/register";
        }

        // Opción 1: mandar a login con mensaje
        return "redirect:/login?registered=true";
    }
}
