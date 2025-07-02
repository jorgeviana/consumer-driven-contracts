package com.example.stocks;

import com.example.stocks.StockRepository.Stock;
import java.util.Map;

public interface ExternalSentimentService {

    Map<String, Object> getSentiment(Stock stock);
}
