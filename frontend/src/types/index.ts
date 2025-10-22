export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Comida {
  _id: string;
  nome: string;
  quantidade: number;
  unidade: 'kg' | 'g' | 'unidades';
  dataValidade: string;
  tipo: 'Perecível' | 'Não Perecível';
  imagem?: string;
  disponivel: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Bebida {
  _id: string;
  nome: string;
  quantidade: number;
  unidade: 'L' | 'cl' | 'ml';
  dataValidade: string;
  tipo: 'Com Álcool' | 'Sem Álcool';
  imagem?: string;
  disponivel: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialSala {
  _id: string;
  nome: string;
  quantidade: number;
  categoria: 'cozinha' | 'sala' | 'bar' | 'limpeza' | 'outros';
  imagem?: string;
  disponivel: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  _id: string;
  nome: string;
  numero: string;
  email: string;
  turma: 'R1' | 'R2' | 'R3';
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  _id: string;
  nome: string;
  data: string;
  alunos: Student[];
  descricao?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Quebra {
  _id: string;
  service: Service;
  comidas: Array<{
    item: Comida;
    quantidade: number;
    usarTudo: boolean;
  }>;
  bebidas: Array<{
    item: Bebida;
    quantidade: number;
    usarTudo: boolean;
  }>;
  materiais: Array<{
    item: MaterialSala;
    quantidade: number;
    usarTudo: boolean;
  }>;
  data: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}
