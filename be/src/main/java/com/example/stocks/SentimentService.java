package com.example.stocks;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
class SentimentService {

    record SentimentDto(String title, String url) {}

    private static final Logger log = LoggerFactory.getLogger(SentimentService.class);

    private final SentimentRepository sentimentRepository;
    private final ExternalSentimentService externalSentimentService;

    SentimentService(SentimentRepository sentimentRepository, ExternalSentimentService externalSentimentService) {
        this.sentimentRepository = sentimentRepository;
        this.externalSentimentService = externalSentimentService;
    }

    public List<SentimentDto> getSentiment(StockRepository.Stock stock) {
        Optional<Instant> lastUpdated = sentimentRepository.lastUpdated(stock);

        Map<String, Object> sentiment = null;

        if (lastUpdated.isEmpty() || longTimeAgo(lastUpdated.get())) {
            sentiment = externalSentimentService.getSentiment(stock);
            sentimentRepository.update(stock, sentiment);
            log.info("Got sentiment data for {} from external system and updated repository", stock);
        } else {
            log.info("Will get sentiment data for {} from repository", stock);
            sentiment = sentimentRepository.findSentiment(stock);
        }

        return toSentimentDto(sentiment);
    }

    private List<SentimentDto> toSentimentDto(Map<String, Object> sentiment) {
        List<Map<String, Object>> feed = (List<Map<String, Object>>)  sentiment.get("feed");
        return feed.stream()
            .map(e -> new SentimentDto(e.get("title").toString(), e.get("url").toString()))
            .limit(10)
            .toList();
    }

    private static boolean longTimeAgo(Instant lastUpdated) {
        // TODO make timeProvider testable
        long hours = Duration.between(lastUpdated, Instant.now()).toHours();
        return hours >= 24;
    }
}
