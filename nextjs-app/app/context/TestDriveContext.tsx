"use client";
import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';

type TestDriveContextType = {
  selectedTestDrive: string | null;
  setTestDrive: (testDriveIdOrName: string) => void;
};

const TestDriveContext = createContext<TestDriveContextType | undefined>(undefined);

export const useTestDrive = () => {
  const context = useContext(TestDriveContext);
  if (!context) {
    throw new Error('useTestDrive must be used within a TestDriveProvider');
  }
  return context;
};

export const TestDriveProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTestDrive, setSelectedTestDrive] = useState<string | null>(null);

  const setTestDrive = (testDriveIdOrName: string) => {
    setSelectedTestDrive(testDriveIdOrName);
  };

  const testDriveContextValue = useMemo(
    () => ({
      selectedTestDrive,
      setTestDrive,
    }),
    [selectedTestDrive] 
  );

  return (
    <TestDriveContext.Provider value={testDriveContextValue}>
      {children}
    </TestDriveContext.Provider>
  );
};
