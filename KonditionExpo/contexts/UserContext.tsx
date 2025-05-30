import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserContextType = {
  name: string;
  setName: (name: string) => void;
  height: string;
  setHeight: (height: string) => void;
  weight: string;
  setWeight: (weight: string) => void;
  age: number;
  setAge: (age: number) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState(0);

  return (
    <UserContext.Provider value={{ name, setName, height, setHeight, weight, setWeight, age, setAge }}>
      {children}
    </UserContext.Provider>
  );
};

//Added default fallback
export const useUser = () => {
  return useContext(UserContext) ?? {
    name: '',
    setName: () => {},
    height: '',
    setHeight: () => {},
    weight: '',
    setWeight: () => {},
    age: 0,
    setAge: () => {},
  };
};

