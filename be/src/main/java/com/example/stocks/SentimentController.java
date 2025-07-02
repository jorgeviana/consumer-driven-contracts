package com.example.stocks;

import com.example.stocks.StockRepository.Stock;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api")
@CrossOrigin("*")
class SentimentController {

    private final SentimentService sentimentService;

    SentimentController(SentimentService sentimentService) {
        this.sentimentService = sentimentService;
    }

    @GetMapping("sentiment/{exchange}/{code}")
    List<SentimentService.SentimentDto> get(@PathVariable String exchange, @PathVariable String code) {
        Stock stock = new Stock(exchange, code);
        return sentimentService.getSentiment(stock);
    }
}

