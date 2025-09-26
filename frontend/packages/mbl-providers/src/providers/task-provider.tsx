import React from "react";
import { createContext, useContext, useState } from "react";

export type TaskProviderProps = {
  children: React.ReactNode;
  defaultTask?: number;
};

export type TaskProviderState = {
  task: number;
  setTask: (task: number) => void;
};

const initialState: TaskProviderState = {
  task: 0,
  setTask: () => null,
};

const TaskProviderContext = createContext<TaskProviderState>(initialState);

export function TaskProvider({
  children,
  defaultTask = 0,
  ...props
}: TaskProviderProps) {
  const [task, setTask] = useState<number>(defaultTask);

  const value = {
    task,
    setTask: (task: number) => {
      setTask(task);
    },
  };

  return (
    <TaskProviderContext.Provider {...props} value={value}>
      {children}
    </TaskProviderContext.Provider>
  );
}

export const useTask = () => {
  const context = useContext(TaskProviderContext);

  if (context === undefined)
    throw new Error("useTask must be used within a TaskProvider");

  return context;
};
