import React from "react";
import { createContext, useContext, useState } from "react";

export type CurrentSelectedIdProviderProps = {
  children: React.ReactNode;
  defaultCurrentSelectedId?: string;
  defaultCurrentSubSelectedId?: string; // 子组件如table plugin的当前选中[列头，列]的id
};

export type CurrentSelectedIdProviderState = {
  currentSelectedId: string;
  currentSubSelectedId: string;
  setCurrentSelectedId: (currentSelectedId: string) => void;
  setCurrentSubSelectedId: (currentSubSelectedId: string) => void;
};

const initialState: CurrentSelectedIdProviderState = {
  currentSelectedId: "",
  currentSubSelectedId: "",
  setCurrentSelectedId: () => null,
  setCurrentSubSelectedId: () => null,
};

const CurrentSelectedIdProviderContext =
  createContext<CurrentSelectedIdProviderState>(initialState);

export function CurrentSelectedIdProvider({
  children,
  defaultCurrentSelectedId = "",
  defaultCurrentSubSelectedId = "",
  ...props
}: CurrentSelectedIdProviderProps) {
  const [currentSelectedId, setCurrentSelectedId] = useState<string>(
    defaultCurrentSelectedId,
  );

  const [currentSubSelectedId, setCurrentSubSelectedId] = useState<string>(
    defaultCurrentSubSelectedId,
  );

  const value = React.useMemo(
    () => ({
      currentSelectedId,
      currentSubSelectedId,
      setCurrentSelectedId: (newCurrentSelectedId: string) => {
        // console.log(
        //   "CurrentSelectedIdProvider - setCurrentSelectedId called:",
        //   {
        //     newCurrentSelectedId,
        //     currentSelectedId,
        //     changed: newCurrentSelectedId !== currentSelectedId,
        //   },
        // );
        // 只有当值真正改变时才更新状态
        // if (newCurrentSelectedId !== currentSelectedId) {
        setCurrentSelectedId(newCurrentSelectedId);
        // }
      },
      setCurrentSubSelectedId: (newCurrentSubSelectedId: string) => {
        // console.log(
        //   "CurrentSelectedIdProvider - setCurrentSubSelectedId called:",
        //   {
        //     newCurrentSubSelectedId,
        //     currentSubSelectedId,
        //     changed: newCurrentSubSelectedId !== currentSubSelectedId,
        //   },
        // );
        // 只有当值真正改变时才更新状态
        // if (newCurrentSubSelectedId !== currentSubSelectedId) {
        setCurrentSubSelectedId(newCurrentSubSelectedId);
        // }
      },
    }),
    [currentSelectedId, currentSubSelectedId],
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
