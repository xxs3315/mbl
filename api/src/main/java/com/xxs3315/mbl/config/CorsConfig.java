package com.xxs3315.mbl.config;

import java.util.Arrays;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** 跨域配置类 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

  /** 配置跨域映射 */
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry
        .addMapping("/**")
        // 允许的源地址
        .allowedOriginPatterns("*")
        // 允许的请求头
        .allowedHeaders("*")
        // 允许的请求方法
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH")
        // 是否允许发送Cookie
        .allowCredentials(true)
        // 预检请求的缓存时间（秒）
        .maxAge(3600);
  }

  /** 配置CORS源 */
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();

    // 允许所有源
    configuration.setAllowedOriginPatterns(Arrays.asList("*"));

    // 允许所有请求头
    configuration.setAllowedHeaders(Arrays.asList("*"));

    // 允许所有请求方法
    configuration.setAllowedMethods(
        Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"));

    // 允许发送Cookie
    configuration.setAllowCredentials(true);

    // 预检请求缓存时间
    configuration.setMaxAge(3600L);

    // 暴露的响应头
    configuration.setExposedHeaders(
        Arrays.asList(
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials",
            "Access-Control-Allow-Methods",
            "Access-Control-Allow-Headers",
            "Access-Control-Max-Age"));

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);

    return source;
  }
}
