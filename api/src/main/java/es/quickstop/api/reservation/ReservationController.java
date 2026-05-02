package es.quickstop.api.reservation;

import es.quickstop.api.reservation.dto.ReservationDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/reservation")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping("/create")
    public ResponseEntity<ReservationDTO> create(@RequestBody ReservationDTO dto) {
        return ResponseEntity.ok(reservationService.createReservation(dto));
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<ReservationDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getReservationById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationDTO>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reservationService.getReservationsByUser(userId));
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<ReservationDTO> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.cancelReservation(id));
    }

    @GetMapping("/next-available/{parkingId}")
    public ResponseEntity<LocalDateTime> getNextAvailable(@PathVariable Long parkingId) {
        return ResponseEntity.ok(reservationService.findNextAvailableSlot(parkingId));
    }

    @PostMapping("/available-spots")
    public ResponseEntity<Long> getAvailableSpots(@RequestBody ReservationDTO reservationDTO) {
        // System.out.println("Received request for available spots with data: " + reservationDTO);
        return ResponseEntity.ok(reservationService.getAvailableSpots(reservationDTO));
    }

    @PutMapping("/update-status/{id}")
    public ResponseEntity<ReservationDTO> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(reservationService.updateReservationStatus(id, status));
    }

}