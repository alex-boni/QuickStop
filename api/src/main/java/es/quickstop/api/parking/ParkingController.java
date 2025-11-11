package es.quickstop.api.parking;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import es.quickstop.api.parking.dto.ParkingDTO;
import java.util.List;
import java.util.ArrayList;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;

import org.springframework.web.bind.annotation.RequestBody;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/parking")
@RequiredArgsConstructor
public class ParkingController {

    private final ParkingService parkingService;

    @GetMapping("/find-all")
    public ResponseEntity<List<ParkingDTO>> getAllParkings() {
        List<ParkingDTO> parkings = parkingService.getAllParkings();
        return new ResponseEntity<>(parkings, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ParkingDTO>> searchParkings(
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam double distance) {
         List<ParkingDTO> parkings = new ArrayList<>();
        parkings.add(new ParkingDTO(1L,  -3.7038,40.4168, 50, "Owner1", 2.5, true));
        parkings.add(new ParkingDTO(2L,  2.1734, 41.3851,30, "Owner2", 3.0, true));
        parkings.add(new ParkingDTO(3L,  -0.3763,39.4699, 20, "Owner3", 1.5, true));
        parkings.add(new ParkingDTO(4L,  -5.9845,37.3891, 40, "Owner4", 2.0, true));
        parkings.add(new ParkingDTO(5L,  -2.9350,43.2630, 25, "Owner5", 2.8, true));
        parkings.add(new ParkingDTO(6L,  -3.7010, 40.4160, 25, "Owner6", 2.8, true));
        parkings.add(new ParkingDTO(7L,  -3.7020, 40.4150, 25, "Owner7", 2.8, true));
        parkings.add(new ParkingDTO(8L,  -3.7025, 40.4162, 25, "Owner8", 2.8, true));
        parkings.add(new ParkingDTO(9L,  -3.7070, 40.4180, 25, "Owner9", 2.8, true));
        parkings.add(new ParkingDTO(10L, -3.69, 40.41, 25, "Owner10", 2.8, true));
        parkings.add(new ParkingDTO(11L, -3.6905, 40.4105, 25, "Owner11", 2.8, true));
        parkings.add(new ParkingDTO(12L, -3.703, 40.416, 25, "Owner12", 2.8, true));

        // System.out.println("Found parkings: " + parkings.size());
        //simulate filtering by distance (in a real scenario, calculate the distance)
        parkings.removeIf(parking -> {
            double latDiff = parking.getLatitude() - latitude;
            double lonDiff = parking.getLongitude() - longitude;
            double dist = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111; // rough conversion to km
            return dist > distance;
        });

        //cuando este la tabla de parkings en la base de datos, hacer la consulta real con postgis
        // List<Parking> parkings = parkingService.findNerbyParkings(latitude, longitude, distance);
        // System.out.println("Found parkings: " + parkings.size());
        return new ResponseEntity<>(parkings, HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<ParkingDTO> createParking(@RequestBody ParkingDTO parkingDTO) {
        ParkingDTO createdParking = parkingService.createParking(parkingDTO);
        return new ResponseEntity<>(createdParking, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParkingDTO> getParkingById(@PathVariable Long id) {
        return parkingService.getParkingById(id)
                .map(parking -> new ResponseEntity<>(parking, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParkingDTO> updateParking(
            @PathVariable Long id, @RequestBody ParkingDTO parkingDTO) {
        return parkingService.updateParking(id, parkingDTO)
                .map(parking -> new ResponseEntity<>(parking, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParking(@PathVariable Long id) {
        if (parkingService.deleteParking(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

}
