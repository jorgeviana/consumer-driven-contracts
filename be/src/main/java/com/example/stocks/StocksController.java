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
class StocksController {

    private final StockService stockService;

    StocksController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping("equity/{exchange}/{code}")
    List<StockService.EquityDto> get(@PathVariable String exchange, @PathVariable String code) {
        Stock stock = new Stock(exchange, code);
        return stockService.getEquity(stock);
    }
}

