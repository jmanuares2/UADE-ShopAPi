package com.uade.tpo.e_commerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.io.ClassPathResource;

@SpringBootApplication
public class ECommerceApplication {

	public static void main(String[] args) {

		SpringApplication app = new SpringApplication(ECommerceApplication.class);

		// Si `application-docker.properties` existe en el directorio, se activa el
		// perfil `docker`
		ClassPathResource docker = new ClassPathResource("application-docker.properties");
		if (docker.exists()) {
			app.setAdditionalProfiles("docker");
			System.out.println("Profile `docker` activated (application-docker.properties found).");
		} else {
			System.out.println("Using default configuration (application.properties).");
		}
		app.run(args);
	}

}
