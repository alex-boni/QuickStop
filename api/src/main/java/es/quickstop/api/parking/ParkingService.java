package es.quickstop.api.parking;

import org.springframework.stereotype.Service;

import es.quickstop.api.parking.dto.ParkingDTO;
import es.quickstop.api.parking.model.Parking;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParkingService {

    private final ParkingRepository parkingRepository;
    private final ParkingMapper parkingMapper;

    public List<ParkingDTO> getAllParkings() {
        return parkingRepository.findAll()
                .stream()
                .map(parkingMapper::toDTO)
                .collect(Collectors.toList());
    }

    public ParkingDTO createParking(ParkingDTO parkingDTO) {
        Parking parking = parkingMapper.toEntity(parkingDTO);
        Parking savedParking = parkingRepository.save(parking);
        return parkingMapper.toDTO(savedParking);
    }

    public Optional<ParkingDTO> getParkingById(Long id) {
        return parkingRepository.findById(id)
                .map(parkingMapper::toDTO);
    }

    public Optional<ParkingDTO> updateParking(Long id, ParkingDTO parkingDTO) {
        return parkingRepository.findById(id)
                .map(existingParking -> {
                    // Actualizar los campos
                    existingParking.setName(parkingDTO.getName());
                    existingParking.setAddress(parkingDTO.getAddress());
                    existingParking.setAvailableSpots(parkingDTO.getAvailableSpots());
                    existingParking.setPricePerHour(parkingDTO.getPricePerHour());
                    existingParking.setDescription(parkingDTO.getDescription());
                    existingParking.setIsActive(parkingDTO.isActive());
                    // OwnerId NO se debe cambiar por seguridad
                    
                    Parking updatedParking = parkingRepository.save(existingParking);
                    return parkingMapper.toDTO(updatedParking);
                });
    }


    public boolean deleteParking(Long id) {
        if (parkingRepository.existsById(id)) {
            parkingRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
