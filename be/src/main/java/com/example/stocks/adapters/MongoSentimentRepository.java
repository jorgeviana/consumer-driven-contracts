package com.example.stocks.adapters;

import com.example.stocks.SentimentRepository;
import com.example.stocks.SentimentRepository.StockSentimentEntity;
import com.example.stocks.StockRepository.LastUpdatedEntity;
import com.example.stocks.StockRepository.Stock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

@Repository
interface SentimentRepositoryImpl extends MongoRepository<StockSentimentEntity, Stock> {}


@Repository
public class MongoSentimentRepository implements SentimentRepository {

    @Autowired
    SentimentRepositoryImpl sentimentRepositoryImpl;

    @Autowired
    LastUpdatedRepository lastUpdatedRepository;


    @Override
    public Optional<Instant> lastUpdated(Stock stock) {
        Optional<LastUpdatedEntity> byId = lastUpdatedRepository.findById(stock);
        return byId.map(LastUpdatedEntity::lastUpdated);
    }

    @Override
    public Map<String, Object> findSentiment(Stock stock) {
        Optional<StockSentimentEntity> byId = sentimentRepositoryImpl.findById(stock);
        if (byId.isPresent()) {
            return byId.get().sentiment();
        }
        throw new RuntimeException("Fix this programming error. Could not find stock in repo: " + stock);
    }

    @Override
    public void update(Stock stock, Map<String, Object> sentiment) {
        lastUpdatedRepository.save(new LastUpdatedEntity(stock, Instant.now()));
        sentimentRepositoryImpl.save(new StockSentimentEntity(stock, sentiment));
    }
}
