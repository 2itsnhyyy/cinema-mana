import LoadingPage from '@/pages/LoadingPage';
import {
  useContext,
  createContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

interface Employee {
  id: number;
  name: string;
  role: string;
}

interface AuthContextType {
  employee: Employee | null;
  login: (employee: Employee, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [firstTime, setFirstTime] = useState(true);

  useEffect(() => {
    const employee = localStorage.getItem('employee');
    if (employee) {
      setEmployee(JSON.parse(employee));
    }
    setFirstTime(false);
  }, []);

  const login = (employee: Employee, token: string) => {
    setEmployee(employee);
    localStorage.setItem('employee', JSON.stringify(employee));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setEmployee(null);
    localStorage.removeItem('employee');
    localStorage.removeItem('token');
  };

  if (firstTime) {
    return <LoadingPage />;
  }

  return (
    <AuthContext.Provider value={{ employee, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = (): AuthContextType => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return authContext;
};
