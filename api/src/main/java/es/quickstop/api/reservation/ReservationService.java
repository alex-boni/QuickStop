package es.quickstop.api.reservation;

import es.quickstop.api.user.UserRepository;
import es.quickstop.api.parking.ParkingRepository;
import es.quickstop.api.parking.model.Parking;
import es.quickstop.api.reservation.dto.ReservationDTO;
import es.quickstop.api.reservation.model.Reservation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                dto.getEndTime()
        );

        if (occupiedSpots >= parking.getAvailableSpots()) {
            throw new RuntimeException("Capacidad máxima alcanzada para el horario seleccionado");
        }

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
}