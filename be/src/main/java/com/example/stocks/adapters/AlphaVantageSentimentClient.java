package com.example.stocks.adapters;

import com.example.stocks.ExternalSentimentService;
import com.example.stocks.StockRepository.Stock;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AlphaVantageSentimentClient implements ExternalSentimentService {

    @Autowired
    private RestTemplateBuilder restTemplateBuilder;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private Environment environment;

    @Override
    public Map<String, Object> getSentiment(Stock stock) {
        Map<String, Object> data = getSentimentRawData(stock);

        // TODO perhaps bean validator is more elegant
        if (data.isEmpty()) {
            throw new RuntimeException("Invalid data received from external API - empty");
        }
        if (data.containsKey("Error Message")) {
            throw new RuntimeException("Invalid data received from external API - error: " + data.get("Error Message"));
        }

        return objectMapper.convertValue(data, Map.class);
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
