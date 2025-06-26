package com.example.stocks;

import org.junit.jupiter.api.Test;

import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

public class ZoneTest {

    @Test
    void zone() {
        Set<String> zones = ZoneId.getAvailableZoneIds();

        List<String> york = zones.stream()
            .filter(z -> z.toLowerCase().contains("york"))
            .toList();

        assertThat(york).hasSize(1);
        System.out.println(york);

        assertThat(ZoneId.SHORT_IDS).isEqualTo(ZoneOffset.SHORT_IDS);

        System.out.println(ZonedDateTime.now(ZoneId.of("America/New_York")));
    }
}
