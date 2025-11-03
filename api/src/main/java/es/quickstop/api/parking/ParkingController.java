package es.quickstop.api.parking;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.HttpStatus;
import es.quickstop.api.parking.dto.ParkingDTO;
import java.util.List;
import java.util.ArrayList;


@RestController
@RequestMapping("/api/parkings")
public class ParkingController {
    
    @GetMapping("/find-all")
    public ResponseEntity<List<ParkingDTO>> getAllParkings() {
        List<ParkingDTO> parkings = new ArrayList<>();
        parkings.add(new ParkingDTO(1L, 40.4168, -3.7038, 50, "Owner1", 2.5, true));
        parkings.add(new ParkingDTO(2L, 41.3851, 2.1734, 30, "Owner2", 3.0, false));
        parkings.add(new ParkingDTO(3L, 39.4699, -0.3763, 20, "Owner3", 1.5, true));
        parkings.add(new ParkingDTO(4L, 37.3891, -5.9845, 40, "Owner4", 2.0, true));
        parkings.add(new ParkingDTO(5L, 43.2630, -2.9350, 25, "Owner5", 2.8, false));
        return new ResponseEntity<>(parkings, HttpStatus.OK);
    }
    
}
