package com.creditdecision.creditdecisionapplication;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com.creditdecision.creditdecisionapplication")
public class CreditdecisionapplicationApplication {

	public static void main(String[] args) {
		SpringApplication.run(CreditdecisionapplicationApplication.class, args);
	}

}
