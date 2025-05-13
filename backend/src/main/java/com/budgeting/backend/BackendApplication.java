package com.budgeting.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
//		SpringApplication.run(BackendApplication.class, args);
		ConfigurableApplicationContext ctx = SpringApplication.run(BackendApplication.class, args);
		String mongoUri = ctx.getEnvironment().getProperty("spring.data.mongodb.uri");
		System.out.println("✅ Mongo URI seen by Spring: " + mongoUri);
	}

}
