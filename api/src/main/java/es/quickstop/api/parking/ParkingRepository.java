package es.quickstop.api.parking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import es.quickstop.api.parking.model.Parking;

@Repository
public interface ParkingRepository extends JpaRepository<Parking, Long> {
    
}
