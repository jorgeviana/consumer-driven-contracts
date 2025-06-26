package com.example.stocks;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.Map.Entry.comparingByKey;

@Service
class StockService {

    record EquityDto(
        String date,
        Price price
    ) {
    }

    record Price(
        double open,
        double high,
        double low,
        double close
    ) {
    }

    private static final Logger log = LoggerFactory.getLogger(StockService.class);

    private final StockRepository stockRepository;
    private final ExternalStockService externalStockService;

    StockService(StockRepository stockRepository, ExternalStockService externalStockService) {
        this.stockRepository = stockRepository;
        this.externalStockService = externalStockService;
    }

    public List<EquityDto> getEquity(StockRepository.Stock stock) {
        Optional<Instant> lastUpdated = stockRepository.lastUpdated(stock);

        ExternalStockService.StockData stockData = null;

        if (lastUpdated.isEmpty() || longTimeAgo(lastUpdated.get())) {
            stockData = externalStockService.getStockData(stock);
            stockRepository.update(stock, stockData);
            log.info("Got data for {} from external system and updated repository", stock);
        } else {
            log.info("Will get data for {} from repository", stock);
            stockData = stockRepository.findStockData(stock);
        }

        return toEquityDto(stockData);
    }

    private List<EquityDto> toEquityDto(ExternalStockService.StockData stockData) {
        return stockData.timeSeries().entrySet().stream()
            .sorted(comparingByKey())
            .map(e -> new EquityDto(
                e.getKey(),
                new Price(
                    e.getValue().open(),
                    e.getValue().high(),
                    e.getValue().low(),
                    e.getValue().close()))
            )
            .collect(Collectors.toList());
    }

    private static boolean longTimeAgo(Instant lastUpdated) {
        // TODO make timeProvider testable
        long hours = Duration.between(lastUpdated, Instant.now()).toHours();
        return hours >= 24;
    }
}
