import React from "react";
import { createContext, useContext, useState } from "react";

type CurrentSelectedIdProviderProps = {
  children: React.ReactNode;
  defaultCurrentSelectedId?: string;
};

type CurrentSelectedIdProviderState = {
  currentSelectedId: string;
  setCurrentSelectedId: (currentSelectedId: string) => void;
};

const initialState: CurrentSelectedIdProviderState = {
  currentSelectedId: "",
  setCurrentSelectedId: () => null,
};

const CurrentSelectedIdProviderContext =
  createContext<CurrentSelectedIdProviderState>(initialState);

export function CurrentSelectedIdProvider({
  children,
  defaultCurrentSelectedId = "",
  ...props
}: CurrentSelectedIdProviderProps) {
  const [currentSelectedId, setCurrentSelectedId] = useState<string>(
    defaultCurrentSelectedId,
  );

  const value = {
    currentSelectedId,
    setCurrentSelectedId: (currentSelectedId: string) => {
      console.log("setCurrentSelectedId", currentSelectedId);
      setCurrentSelectedId(currentSelectedId);
    },
  };

  return (
    <CurrentSelectedIdProviderContext.Provider {...props} value={value}>
      {children}
    </CurrentSelectedIdProviderContext.Provider>
  );
}

export const useCurrentSelectedId = () => {
  const context = useContext(CurrentSelectedIdProviderContext);

  if (context === undefined)
    throw new Error(
      "useCurrentSelectedId must be used within a CurrentSelectedIdProvider",
    );

  return context;
};
