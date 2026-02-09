package es.quickstop.api.parking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import es.quickstop.api.parking.model.Parking;
import java.util.List;
import org.locationtech.jts.geom.Point;

@Repository
public interface ParkingRepository extends JpaRepository<Parking, Long> {
    @Query(value = "SELECT * FROM parkings p WHERE ST_DWithin(p.location, :centro, :distanciaMetros) = true", nativeQuery = true)
    List<Parking> findNearWithinDistance(Point centro, double distanciaMetros);
}
