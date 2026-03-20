package es.quickstop.api.reservation;

import es.quickstop.api.reservation.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    
    List<Reservation> findByUserIdOrderByStartTimeDesc(Long userId);

    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.parking.id = :parkingId " +
           "AND r.status = 'ACTIVE' " +
           "AND r.startTime < :endTime AND r.endTime > :startTime")
    long countOverlappingReservations(
            @Param("parkingId") Long parkingId, 
            @Param("startTime") LocalDateTime startTime, 
            @Param("endTime") LocalDateTime endTime
    );

    List<Reservation> findByParkingIdAndStatus(Long parkingId, Reservation.ReservationStatus status);
}