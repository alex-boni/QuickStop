package es.quickstop.api.reservation;

import es.quickstop.api.reservation.dto.ReservationDTO;
import es.quickstop.api.reservation.model.Reservation;
import org.springframework.stereotype.Component;

@Component
public class ReservationMapper {

    public ReservationDTO toDTO(Reservation reservation) {
        if (reservation == null) {
            return null;
        }

        ReservationDTO dto = new ReservationDTO();
        dto.setId(reservation.getId());
        dto.setParkingId(reservation.getParking().getId());
        dto.setUserId(reservation.getUser().getId());
        dto.setStartTime(reservation.getStartTime());
        dto.setEndTime(reservation.getEndTime());
        dto.setTotalPrice(reservation.getTotalPrice());
        dto.setStatus(reservation.getStatus().name());
        
        // Incluimos el nombre del parking para facilitar la visualización en el frontend
        if (reservation.getParking() != null) {
            dto.setParkingName(reservation.getParking().getName());
        }

        return dto;
    }

    public Reservation toEntity(ReservationDTO dto) {
        if (dto == null) {
            return null;
        }

        Reservation reservation = new Reservation();
        // El ID se suele gestionar automáticamente en la creación, 
        // pero se asigna por si es una actualización.
        reservation.setId(dto.getId());
        reservation.setStartTime(dto.getStartTime());
        reservation.setEndTime(dto.getEndTime());
        reservation.setTotalPrice(dto.getTotalPrice());
        
        // El mapeo de User y Parking se debe completar en el Service
        // utilizando los métodos del repositorio o getReferenceById.
        
        if (dto.getStatus() != null) {
            reservation.setStatus(Reservation.ReservationStatus.valueOf(dto.getStatus()));
        } else {
            reservation.setStatus(Reservation.ReservationStatus.ACTIVE);
        }

        return reservation;
    }
}