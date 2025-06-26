package com.example.stocks;

import au.com.dius.pact.provider.junit5.PactVerificationContext;
import au.com.dius.pact.provider.junitsupport.Provider;
import au.com.dius.pact.provider.junitsupport.State;
import au.com.dius.pact.provider.junitsupport.loader.PactFolder;
import au.com.dius.pact.provider.spring.spring6.PactVerificationSpring6Provider;
import au.com.dius.pact.provider.spring.spring6.Spring6MockMvcTestTarget;
import com.example.stocks.StockRepository.Stock;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestTemplate;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

@Provider("spring-api")
@PactFolder("../pacts/")
@SpringBootTest
@AutoConfigureMockMvc
class ContractTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    StockRepository stockRepository;

    @BeforeEach
    void beforeEach(PactVerificationContext context) {
        context.setTarget(new Spring6MockMvcTestTarget(mockMvc));
    }

    @TestTemplate
    @ExtendWith(PactVerificationSpring6Provider.class)
    void pactVerification(PactVerificationContext context) {
        context.verifyInteraction();
    }

    @State("equity exists")
    public void equityExists() {
        stockRepository.update(
            new Stock("LON", "TSCO"),
            new ExternalStockService.StockData(
                "symbol",
                "last refreshed",
                Map.of(
                    "2023, 11, 1", new ExternalStockService.StockPrice(51.98, 56.3, 51.59, 53.84),
                    "2023, 11, 2", new ExternalStockService.StockPrice(53.66, 54.99, 51.35, 52.95),
                    "2023, 11, 3", new ExternalStockService.StockPrice(52.76, 57.35, 52.15, 55.42),
                    "2023, 11, 4", new ExternalStockService.StockPrice(55.27, 59.1, 53.91, 56.97)
                )
            )
        );
    }

    @State("equity does not exist")
    public void equityDoesNotExist() {
    }
}
