package es.quickstop.api.parking;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.http.HttpStatus;
import es.quickstop.api.parking.dto.ParkingDTO;
import java.util.List;
import java.util.ArrayList;

 import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/parking")
public class ParkingController {

    @GetMapping("/find-all")
    public ResponseEntity<List<ParkingDTO>> getAllParkings() {
        List<ParkingDTO> parkings = new ArrayList<>();
        parkings.add(new ParkingDTO(1L, -3.7038, 40.4168, 50, "Owner1", 2.5, true));
        parkings.add(new ParkingDTO(2L, 2.1734, 41.3851, 30, "Owner2", 3.0, true));
        parkings.add(new ParkingDTO(3L, -0.3763, 39.4699, 20, "Owner3", 1.5, true));
        parkings.add(new ParkingDTO(4L, -5.9845, 37.3891, 40, "Owner4", 2.0, true));
        parkings.add(new ParkingDTO(5L, -2.9350, 43.2630, 25, "Owner5", 2.8, true));
        parkings.add(new ParkingDTO(6L, -3.7010, 40.4160, 25, "Owner6", 2.8, true));
        parkings.add(new ParkingDTO(7L, -3.7020, 40.4150, 25, "Owner7", 2.8, true));
        parkings.add(new ParkingDTO(8L, -3.7025, 40.4162, 25, "Owner8", 2.8, true));
        parkings.add(new ParkingDTO(9L, -3.7070, 40.4180, 25, "Owner9", 2.8, true));
        parkings.add(new ParkingDTO(10L, -3.69, 40.41, 25, "Owner10", 2.8, true));
        parkings.add(new ParkingDTO(11L, -3.6905, 40.4105, 25, "Owner11", 2.8, true));
        parkings.add(new ParkingDTO(12L, -3.703, 40.416, 25, "Owner12", 2.8, true));
        return new ResponseEntity<>(parkings, HttpStatus.OK);
    }

    //recibe el parking dto
    @PostMapping("/create")
    public ResponseEntity<String> createParking(@RequestBody ParkingDTO parkingDTO) {
        // Ahora Spring convierte automáticamente el JSON del body a ParkingDTO
        return new ResponseEntity<>("Parking created successfully", HttpStatus.CREATED);
    }



}
