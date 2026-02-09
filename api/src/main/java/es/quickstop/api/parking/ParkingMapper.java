package es.quickstop.api.parking;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.stereotype.Component;

import es.quickstop.api.parking.dto.ParkingDTO;
import es.quickstop.api.parking.model.Parking;
import org.locationtech.jts.geom.Point;

@Component
public class ParkingMapper {
    
    public ParkingDTO toDTO(Parking parking) {
        if (parking == null) {
            return null;
        }
        return new ParkingDTO(
            parking.getId(),
            parking.getName(),
            parking.getAddress(),
            parking.getLocation().getY(),
            parking.getLocation().getX(),
            parking.getAvailableSpots(),
            parking.getPricePerHour(),
            parking.getDescription(),
            parking.getOwnerId(),
            parking.getIsActive()
        );
    }
    
    public Parking toEntity(ParkingDTO dto) {
        if (dto == null) {
            return null;
        }
        Parking parking = new Parking();
        parking.setId(dto.getId());
        parking.setName(dto.getName());
        parking.setAddress(dto.getAddress());
        GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
        Point punto = geometryFactory.createPoint(new Coordinate(dto.getLongitude(), dto.getLatitude()));
        parking.setLocation(punto);
        parking.setAvailableSpots(dto.getAvailableSpots());
        parking.setPricePerHour(dto.getPricePerHour());
        parking.setDescription(dto.getDescription());
        parking.setOwnerId(dto.getOwnerId());
        parking.setIsActive(dto.isActive());
        return parking;
    }
}
