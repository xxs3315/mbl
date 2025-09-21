import React from "react";
import { createContext, useContext } from "react";

export type TableIdProviderProps = {
  children: React.ReactNode;
  tableId: string;
};

export type TableIdProviderState = {
  tableId: string;
};

const TableIdProviderContext = createContext<TableIdProviderState | null>(null);

export function TableIdProvider({
  children,
  tableId,
  ...props
}: TableIdProviderProps) {
  const value = React.useMemo(
    () => ({
      tableId,
    }),
    [tableId],
  );

  return (
    <TableIdProviderContext.Provider {...props} value={value}>
      {children}
    </TableIdProviderContext.Provider>
  );
}

export const useTableId = () => {
  const context = useContext(TableIdProviderContext);

  if (context === null)
    throw new Error("useTableId must be used within a TableIdProvider");

  return context;
};
