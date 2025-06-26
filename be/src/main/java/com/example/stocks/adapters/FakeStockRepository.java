package com.example.stocks.adapters;

import com.example.stocks.ExternalStockService;
import com.example.stocks.StockRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Configuration
@Profile("fakeRepo")
class RepositoryConfig {

    @Primary
    @Bean
    StockRepository fakeStockRepository() {
        return new FakeStockRepository();
    }
}

class FakeStockRepository implements StockRepository {

    private Map<Stock, Instant> lastUpdated = new HashMap<>();
    private Map<Stock, StockDataEntity> data = new HashMap<>();

    @Override
    public Optional<Instant> lastUpdated(Stock stock) {
        Instant date = lastUpdated.get(stock);
        if (date == null) {
            return Optional.empty();
        }
        return Optional.of(date);
    }

    @Override
    public ExternalStockService.StockData findStockData(Stock stock) {
        return data.get(stock).stockData();
    }

    @Override
    public void update(Stock stock, ExternalStockService.StockData data) {
        lastUpdated.put(stock, Instant.now());
        this.data.put(stock, new StockDataEntity(stock, data));
    }
}
