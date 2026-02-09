package es.quickstop.api.parking;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.HttpStatus;

import es.quickstop.api.parking.dto.ParkingDTO;
import java.util.List;
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
        System.out.println("Buscar parkings cerca de lat: " + latitude + ", lon: " + longitude + ", distancia: " + distance);
        List<ParkingDTO> parkings = parkingService.searchParkings(latitude, longitude, distance);
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
