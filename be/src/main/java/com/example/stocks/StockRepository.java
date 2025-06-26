package com.example.stocks;

import com.example.stocks.ExternalStockService.StockData;
import org.springframework.data.annotation.Id;

import java.time.Instant;
import java.util.Optional;

public interface StockRepository {

    Optional<Instant> lastUpdated(Stock stock);
    StockData findStockData(Stock stock);
    void update(Stock stock, StockData data);

    record Stock(String exchangeCode, String stockCode) {}

    record StockDataEntity(
        @Id Stock id,
        StockData stockData
    ) {}

    record LastUpdatedEntity(
        @Id Stock id,
        Instant lastUpdated
    ) {}
}


// TODO learn how to connect to Mongo running on docker and list all objects
// TODO does mongo works with spring @Transactional. chatgpt: MongoDB does work with Spring’s @Transactional but with limitations — and only if you're using MongoDB 4.0+ and replica set or sharded cluster, not standalone.
