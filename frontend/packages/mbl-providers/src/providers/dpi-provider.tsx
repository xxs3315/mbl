import React from "react";
import { createContext, useContext, useState } from "react";

export type DpiProviderProps = {
  children: React.ReactNode;
  defaultDpi?: number;
};

export type DpiProviderState = {
  dpi: number;
  setDpi: (dpi: number) => void;
};

const initialState: DpiProviderState = {
  dpi: 96,
  setDpi: () => null,
};

const DpiProviderContext = createContext<DpiProviderState>(initialState);

export function DpiProvider({
  children,
  defaultDpi = 96,
  ...props
}: DpiProviderProps) {
  const [dpi, setDpi] = useState<number>(defaultDpi);

  const value = {
    dpi,
    setDpi: (dpi: number) => {
      setDpi(dpi);
    },
  };

  return (
    <DpiProviderContext.Provider {...props} value={value}>
      {children}
    </DpiProviderContext.Provider>
  );
}

export const useDpi = () => {
  const context = useContext(DpiProviderContext);

  if (context === undefined)
    throw new Error("useDpi must be used within a DpiProvider");

  return context;
};
