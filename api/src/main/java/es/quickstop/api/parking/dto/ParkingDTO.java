package es.quickstop.api.parking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkingDTO {
    private Long id;
    private double longitude;
    private double latitude;
    private int spots;
    private String owner;
    private double price;
    private boolean available;
}
