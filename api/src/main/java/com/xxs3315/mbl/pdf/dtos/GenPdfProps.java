package com.xxs3315.mbl.pdf.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GenPdfProps {
  @NotBlank(message = "not blank")
  private String data;

  @NotBlank(message = "not blank")
  private String type;
}
