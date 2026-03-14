package es.quickstop.api.reservation;

import es.quickstop.api.user.UserRepository;
import es.quickstop.api.parking.ParkingRepository;
import es.quickstop.api.parking.model.Parking;
import es.quickstop.api.reservation.dto.ReservationDTO;
import es.quickstop.api.reservation.model.Reservation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ParkingRepository parkingRepository;
    private final UserRepository userRepository;
    private final ReservationMapper reservationMapper;

    @Transactional
    public ReservationDTO createReservation(ReservationDTO dto) {
        Parking parking = parkingRepository.findById(dto.getParkingId())
                .orElseThrow(() -> new RuntimeException("Parking no encontrado"));

        long occupiedSpots = reservationRepository.countOverlappingReservations(
                dto.getParkingId(),
                dto.getStartTime(),
                dto.getEndTime());

        if (occupiedSpots >= parking.getAvailableSpots()) {
            throw new RuntimeException("Capacidad máxima alcanzada para el horario seleccionado");
        }
        System.out.println("Creating reservation for parking ID: " + dto.getParkingId() + ", Start: "
                + dto.getStartTime() + ", End: " + dto.getEndTime());
        Reservation reservation = Reservation.builder()
                .user(userRepository.getReferenceById(dto.getUserId()))
                .parking(parking)
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .totalPrice(dto.getTotalPrice())
                .status(Reservation.ReservationStatus.ACTIVE)
                .build();

        return reservationMapper.toDTO(reservationRepository.save(reservation));
    }

    @Transactional(readOnly = true)
    public List<ReservationDTO> getReservationsByUser(Long userId) {
        return reservationRepository.findByUserIdOrderByStartTimeDesc(userId)
                .stream()
                .map(reservationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReservationDTO cancelReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        reservation.setStatus(Reservation.ReservationStatus.CANCELLED);
        return reservationMapper.toDTO(reservationRepository.save(reservation));
    }

    public LocalDateTime findNextAvailableSlot(Long parkingId) {
        Parking parking = parkingRepository.findById(parkingId)
                .orElseThrow(() -> new RuntimeException("Parking no encontrado"));

        LocalDateTime candidateStart = LocalDateTime.now();
        // Redondeamos a la siguiente media hora
        candidateStart = candidateStart.plusMinutes(30 - (candidateStart.getMinute() % 30)).withSecond(0).withNano(0);
        int maxDaysToSearch = 7; // Límite de búsqueda para evitar bucles infinitos
        LocalDateTime limitEnd = candidateStart.plusDays(maxDaysToSearch);
        while (candidateStart.isBefore(limitEnd)) {
            LocalDateTime candidateStartEnd = candidateStart.plusHours(1); // Probamos un bloque de 1 hora
            long occupied = reservationRepository.countOverlappingReservations(
                    parkingId,
                    candidateStart,
                    candidateStartEnd);
            if (occupied < parking.getAvailableSpots()) {
                return candidateStart;
            }
            // Si está lleno, saltamos 30 minutos y volvemos a comprobar
            candidateStart = candidateStart.plusMinutes(30);
        }
        return null;
    }

    public Long getAvailableSpots(ReservationDTO reservationDTO) {
        Parking parking = parkingRepository.findById(reservationDTO.getParkingId())
                .orElseThrow(() -> new RuntimeException("Parking no encontrado"));

        long occupiedSpots = reservationRepository.countOverlappingReservations(
                reservationDTO.getParkingId(),
                reservationDTO.getStartTime(),
                reservationDTO.getEndTime());
        System.out.println("Calculating available spots for parking ID: " + reservationDTO.getParkingId() + ", Start: "
                + reservationDTO.getStartTime() + ", End: " + reservationDTO.getEndTime() + ", Occupied: " + occupiedSpots);
        return Math.max(0, parking.getAvailableSpots() - occupiedSpots);
    }


}