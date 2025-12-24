package pe.com.gourmet.gourmet.service;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;

@Service
public class CalendarioService {

    public List<Map<String, Object>> buildMeses(LocalDate hoy, LocalDate maxFecha) {
        List<Map<String, Object>> meses = new ArrayList<>();
        YearMonth base = YearMonth.from(hoy);

        for (int i = 0; i < 4; i++) {
            YearMonth ym = base.plusMonths(i);

            List<Map<String, Object>> dias = new ArrayList<>();
            for (int d = 1; d <= ym.lengthOfMonth(); d++) {
                LocalDate fecha = ym.atDay(d);
                boolean desactivado = fecha.isBefore(hoy) || fecha.isAfter(maxFecha);

                Map<String, Object> dia = new HashMap<>();
                dia.put("numero", d);
                dia.put("iso", fecha.toString());
                dia.put("desactivado", desactivado);
                dias.add(dia);
            }

            Map<String, Object> mes = new HashMap<>();
            String nombreMes = ym.getMonth().getDisplayName(
                    java.time.format.TextStyle.FULL,
                    new java.util.Locale("es", "ES")
            );
            mes.put("nombre", nombreMes + " " + ym.getYear());
            mes.put("dias", dias);

            meses.add(mes);
        }

        return meses;
    }

    public List<Map<String, Object>> buildMesesReprogramar(LocalDate hoy,
                                                           LocalDate minFecha,
                                                           LocalDate maxFecha,
                                                           LocalDate fechaActualReserva) {
        List<Map<String, Object>> meses = new ArrayList<>();
        YearMonth base = YearMonth.from(hoy);

        for (int i = 0; i < 4; i++) {
            YearMonth ym = base.plusMonths(i);

            List<Map<String, Object>> dias = new ArrayList<>();
            for (int d = 1; d <= ym.lengthOfMonth(); d++) {
                LocalDate fecha = ym.atDay(d);
                boolean desactivado = fecha.isBefore(minFecha) || fecha.isAfter(maxFecha);

                Map<String, Object> dia = new HashMap<>();
                dia.put("numero", d);
                dia.put("iso", fecha.toString());
                dia.put("desactivado", desactivado);
                dia.put("actual", fechaActualReserva != null && fecha.equals(fechaActualReserva));

                dias.add(dia);
            }

            Map<String, Object> mes = new HashMap<>();
            String nombreMes = ym.getMonth().getDisplayName(
                    java.time.format.TextStyle.FULL,
                    new java.util.Locale("es", "ES")
            );
            mes.put("nombre", nombreMes + " " + ym.getYear());
            mes.put("dias", dias);

            meses.add(mes);
        }

        return meses;
    }

}
