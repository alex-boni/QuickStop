package es.quickstop.api.parking;

import org.springframework.stereotype.Component;

import es.quickstop.api.parking.dto.ParkingDTO;
import es.quickstop.api.parking.model.Parking;

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
            parking.getLatitude(),
            parking.getLongitude(),
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
        parking.setLatitude(dto.getLatitude());
        parking.setLongitude(dto.getLongitude());
        parking.setAvailableSpots(dto.getAvailableSpots());
        parking.setPricePerHour(dto.getPricePerHour());
        parking.setDescription(dto.getDescription());
        parking.setOwnerId(dto.getOwnerId());
        parking.setIsActive(dto.isActive());
        return parking;
    }
}
