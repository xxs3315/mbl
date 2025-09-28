package com.xxs3315.mbl;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MblApplication {

  public static void main(String[] args) {
    SpringApplication.run(MblApplication.class, args);
  }

}