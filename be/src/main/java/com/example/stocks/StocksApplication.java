package com.example.stocks;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StocksApplication {

    // TODO test when data is older than 24 hours. Tested manually only

    public static void main(String[] args) {
        SpringApplication.run(StocksApplication.class, args);
    }
}

