package com.example.stocks;

import com.example.stocks.StockRepository.Stock;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

public interface ExternalStockService {

    // TODO what external returns when stock is not found? Optional or Exception in our code?
    // TODO test this -^ as currently the FE displays empty chart for the null
    StockData getStockData(Stock stock);

    // TODO top 10 only
    List<Sentiment> getSentiment(Stock stock);

    record Sentiment(
        String title,
        String url,
        double overall_sentiment_score
    ) {}

    record StockData(
        String symbol,
        String lastRefreshed,
        // TODO parse string to LocalDate or LocalDateTime, probably won't do
        Map<String, StockPrice> timeSeries
    ) {
        public StockData(
            @JsonProperty("Meta Data") Map<String, String> metadata,
            @JsonAlias({"Time Series (Daily)", "Time Series (5min)"}) Map<String, StockPrice> timeSeries
        ) {
            this(
                metadata.get("2. Symbol"),
                metadata.get("3. Last Refreshed"),
                timeSeries
            );
        }
    }

    record StockPrice(
        double open,
        double high,
        double low,
        double close
    ) {
        public StockPrice(
            @JsonProperty("1. open") double open,
            @JsonProperty("2. high") double high,
            @JsonProperty("3. low") double low,
            @JsonProperty("4. close") double close
        ) {
            this.open = open;
            this.high = high;
            this.low = low;
            this.close = close;
        }
    }
}
