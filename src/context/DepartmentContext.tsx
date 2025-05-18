import React, { createContext, useContext, useState, useEffect } from 'react';

interface Department {
  name: string;
  description: string;
  employeeCount: number;
}

interface DepartmentContextType {
  departments: Department[];
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
  updateEmployeeCount: (departmentName: string, change: number) => void;
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined);

export const useDepartments = () => {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error('useDepartments must be used within a DepartmentProvider');
  }
  return context;
};

const initialDepartments: Department[] = [
  {
    name: 'Engineering',
    description: 'Software development team',
    employeeCount: 1,
  },
  {
    name: 'Marketing',
    description: 'Marketing and communications team',
    employeeCount: 1,
  },
  {
    name: 'Human Resources',
    description: 'HR management and recruitment',
    employeeCount: 0,
  },
];

export const DepartmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);

  const updateEmployeeCount = (departmentName: string, change: number) => {
    setDepartments(prevDepartments =>
      prevDepartments.map(dept =>
        dept.name === departmentName
          ? { ...dept, employeeCount: Math.max(0, dept.employeeCount + change) }
          : dept
      )
    );
  };

  return (
    <DepartmentContext.Provider value={{ departments, setDepartments, updateEmployeeCount }}>
      {children}
    </DepartmentContext.Provider>
  );
};

export default DepartmentContext; 