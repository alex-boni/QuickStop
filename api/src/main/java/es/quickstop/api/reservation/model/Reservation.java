package es.quickstop.api.reservation.model;

import es.quickstop.api.parking.model.Parking;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY  )
    private Long id;
    public enum Status {
        CONFIRMED,
        CANCELLED,
        COMPLETED
    }

    @ManyToOne
    @JoinColumn(name = "parking_id", nullable = false)
    private Parking parking;
}
