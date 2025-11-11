package es.quickstop.api.parking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParkingDTO {
    private Long id;
    private String name;
    private String address;
    private double latitude;
    private double longitude;
    private int availableSpots;
    private BigDecimal pricePerHour;
    private String description;
    private Long ownerId;
    
    @JsonProperty("isActive")
    private boolean isActive;
}
