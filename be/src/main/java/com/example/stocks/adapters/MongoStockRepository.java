package com.example.stocks.adapters;

import com.example.stocks.ExternalStockService;
import com.example.stocks.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;


@Repository
interface TimeSeriesRepository extends MongoRepository<StockRepository.StockDataEntity, StockRepository.Stock> {}
@Repository
interface LastUpdatedRepository extends MongoRepository<StockRepository.LastUpdatedEntity, StockRepository.Stock> {}


@Repository
public class MongoStockRepository implements StockRepository {

    @Autowired
    TimeSeriesRepository timeSeriesRepository;

    @Autowired
    LastUpdatedRepository lastUpdatedRepository;

    @Override
    public Optional<Instant> lastUpdated(Stock stock) {
        Optional<LastUpdatedEntity> byId = lastUpdatedRepository.findById(stock);
        return byId.map(LastUpdatedEntity::lastUpdated);
    }

    @Override
    public ExternalStockService.StockData findStockData(Stock stock) {
        Optional<StockDataEntity> byId = timeSeriesRepository.findById(stock);
        if (byId.isPresent()) {
            return byId.get().stockData();
        }
        throw new RuntimeException("Fix this programming error. Could not find stock in repo: " + stock);
    }

    @Override
    @Transactional
    public void update(Stock stock, ExternalStockService.StockData data) {
        lastUpdatedRepository.save(new LastUpdatedEntity(stock, Instant.now()));
        timeSeriesRepository.save(new StockDataEntity(stock, data));
    }
}
