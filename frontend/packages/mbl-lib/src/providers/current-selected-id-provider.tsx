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

  const value = React.useMemo(
    () => ({
      currentSelectedId,
      setCurrentSelectedId: (newCurrentSelectedId: string) => {
        console.log(
          "CurrentSelectedIdProvider - setCurrentSelectedId called:",
          {
            newCurrentSelectedId,
            currentSelectedId,
            changed: newCurrentSelectedId !== currentSelectedId,
          },
        );
        // 只有当值真正改变时才更新状态
        if (newCurrentSelectedId !== currentSelectedId) {
          setCurrentSelectedId(newCurrentSelectedId);
        }
      },
    }),
    [currentSelectedId],
  );

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
