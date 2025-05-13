package com.budgeting.backend.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class MongoConfigDebugLogger {

    @Value("${spring.data.mongodb.uri:NOT FOUND}")
    private String mongoUri;

    @PostConstruct
    public void printMongoUri() {
        System.out.println("🔍 Loaded Mongo URI: " + mongoUri);
    }
}
