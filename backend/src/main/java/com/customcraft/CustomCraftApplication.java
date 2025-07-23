package com.customcraft;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.r2dbc.config.EnableR2dbcAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableR2dbcAuditing
@EnableAsync
public class CustomCraftApplication {
    public static void main(String[] args) {
        SpringApplication.run(CustomCraftApplication.class, args);
    }
}