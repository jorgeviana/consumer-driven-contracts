package com.example.stocks.adapters;

import com.example.stocks.ExternalStockService;
import com.example.stocks.StockRepository.Stock;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AlphaVantageClient implements ExternalStockService {

    @Autowired
    private RestTemplateBuilder restTemplateBuilder;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private Environment environment;

    @Override
    public StockData getStockData(Stock stock) {
        Map<String, Object> data = getRawData(stock);

        // TODO perhaps bean validator is more elegant
        if (data.isEmpty()) {
            throw new RuntimeException("Invalid data received from external API - empty");
        }
        if (data.containsKey("Error Message")) {
            throw new RuntimeException("Invalid data received from external API - error: " + data.get("Error Message"));
        }

        return objectMapper.convertValue(data, StockData.class);
    }

    @Override
    public List<Sentiment> getSentiment(Stock stock) {
        Map<String, Object> data = getSentimentRawData(stock);
        return List.of();
    }

    protected Map<String, Object> getRawData(Stock stock) {
        String apiKey = environment.getProperty("ALPHAVANTAGE_API_KEY");
        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException("Api key for Alpha Vantage is not defined");
        }

        // TODO you know what you need to do!
        String exchangeCode = "NDX".equals(stock.exchangeCode()) ? "" : "." + stock.exchangeCode();
        String symbol = stock.stockCode() + exchangeCode;

        return restTemplateBuilder.build()
            .exchange(
                "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={SYMBOL}&apikey={ALPHAVANTAGE_API_KEY}",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {},
                symbol,
                apiKey
            ).getBody();
    }

    protected Map<String, Object> getSentimentRawData(Stock stock) {
        String apiKey = environment.getProperty("ALPHAVANTAGE_API_KEY");
        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException("Api key for Alpha Vantage is not defined");
        }

        if (!"NDX".equals(stock.exchangeCode())) {
            throw new UnsupportedOperationException("Invalid exchange, only US exchanges supported but you passed in " + stock.exchangeCode());
        }

        String exchangeCode = "NDX".equals(stock.exchangeCode()) ? "" : "." + stock.exchangeCode();
        String symbol = stock.stockCode() + exchangeCode;

        return restTemplateBuilder.build()
            .exchange(
                "https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers={SYMBOL}&apikey={ALPHAVANTAGE_API_KEY}",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<Map<String, Object>>() {},
                symbol,
                apiKey
            ).getBody();
    }

}
