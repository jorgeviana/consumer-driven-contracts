package com.example.stocks;

import com.example.stocks.StockRepository.Stock;
import org.springframework.data.annotation.Id;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

public interface SentimentRepository {

    Optional<Instant> lastUpdated(Stock stock);
    Map<String, Object> findSentiment(Stock stock);
    void update(Stock stock, Map<String, Object> sentiment);

    record StockSentimentEntity(
        @Id Stock id,
        Map<String, Object> sentiment
    ) {}
}
