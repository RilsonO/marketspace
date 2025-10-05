# 🏗️ MarketSpace - Clean Architecture

Uma aplicação React Native para marketplace de produtos, implementada seguindo os princípios da **Clean Architecture** e **SOLID**, com **cobertura completa de testes** e **injeção de dependência**.

## 📋 Índice

- [Arquitetura](#-arquitetura)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Camadas da Arquitetura](#-camadas-da-arquitetura)
- [Fluxo de Comunicação](#-fluxo-de-comunicação)
- [Injeção de Dependência](#-injeção-de-dependência)
- [Testes](#-testes)
- [Como Usar](#-como-usar)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)

## 🏛️ Arquitetura

Este projeto implementa a **Clean Architecture** com as seguintes características:

- **Separação clara de responsabilidades** entre camadas
- **Inversão de dependência** - dependências apontam para abstrações
- **Testabilidade** - cada camada pode ser testada isoladamente
- **Flexibilidade** - fácil troca de implementações
- **Manutenibilidade** - código organizado e previsível
- **Cobertura completa de testes** - 703 testes cobrindo toda a aplicação
- **Injeção de dependência** - gerenciamento automático de dependências

### Princípios SOLID Aplicados

- **S** - Single Responsibility Principle
- **O** - Open/Closed Principle
- **L** - Liskov Substitution Principle
- **I** - Interface Segregation Principle
- **D** - Dependency Inversion Principle

## 📁 Estrutura de Pastas

```
src/
├── entities/                    # 🎯 Camada 1: Regras de Negócio Puras
│   ├── User.ts                 # Entidade usuário com validações
│   ├── Product.ts              # Entidade produto com enum PaymentMethod
│   ├── User.test.ts            # Testes da entidade User
│   └── Product.test.ts         # Testes da entidade Product
├── domain/                     # 🔌 Camada 2: Contratos e Interfaces
│   ├── interfaces/             # Contratos de negócio
│   │   ├── IUserRepository.ts  # Interface para persistência de usuários
│   │   ├── IProductRepository.ts # Interface para persistência de produtos
│   │   └── IAuthService.ts     # Interface para serviços de autenticação
│   ├── errors/                 # Erros específicos do domínio
│   │   ├── DomainError.ts      # Classes de erro customizadas
│   │   └── DomainError.test.ts # Testes dos erros customizados
│   └── index.ts                # Exports centralizados
├── application/                # ⚙️ Camada 3: Casos de Uso
│   ├── use-cases/              # Casos de uso da aplicação
│   │   ├── auth/               # Casos de uso de autenticação
│   │   │   ├── SignInUseCase.ts
│   │   │   ├── SignUpUseCase.ts
│   │   │   ├── SignInUseCase.test.ts
│   │   │   └── SignUpUseCase.test.ts
│   │   ├── products/           # Casos de uso de produtos
│   │   │   ├── GetProductsUseCase.ts
│   │   │   ├── GetUserProductsUseCase.ts
│   │   │   ├── GetProductsUseCase.test.ts
│   │   │   └── GetUserProductsUseCase.test.ts
│   │   └── user/               # Casos de uso de usuário
│   │       ├── UpdateUserProfileUseCase.ts
│   │       └── UpdateUserProfileUseCase.test.ts
│   └── dtos/                   # Data Transfer Objects
│       ├── auth/               # DTOs de autenticação
│       ├── products/           # DTOs de produtos
│       └── user/               # DTOs de usuário
├── infra/                      # 🔧 Camada 4: Implementações Concretas
│   ├── repositories/           # Implementações de repositórios
│   │   ├── UserRepositoryImpl.ts
│   │   ├── ProductRepositoryImpl.ts
│   │   ├── UserRepositoryImpl.test.ts
│   │   └── ProductRepositoryImpl.test.ts
│   ├── services/               # Implementações de serviços
│   │   ├── AuthServiceImpl.ts
│   │   └── AuthServiceImpl.test.ts
│   ├── http/                   # Cliente HTTP e repositórios HTTP
│   │   ├── client.http.ts      # Configuração do Axios
│   │   └── repositories/       # Repositórios HTTP
│   ├── storage/                # Implementações de storage local
│   │   ├── auth-token.storage.ts
│   │   ├── user.storage.ts
│   │   ├── auth-token.storage.test.ts
│   │   └── user.storage.test.ts
│   └── mappers/                # Conversores entre DTOs e entidades
│       ├── payment-methods.map.ts
│       ├── photo.map.ts
│       ├── product.map.ts
│       ├── user.map.ts
│       ├── payment-methods.map.test.ts
│       ├── photo.map.test.ts
│       ├── product.map.test.ts
│       └── user.map.test.ts
├── presentation/               # 🎨 Camada 5: Interface do Usuário
│   ├── screens/                # Telas da aplicação
│   │   ├── auth/               # Telas de autenticação
│   │   │   ├── sign-in/
│   │   │   ├── sign-up/
│   │   │   └── (todos com testes)
│   │   ├── home/               # Tela inicial
│   │   │   └── (com testes)
│   │   └── products/           # Telas de produtos
│   │       ├── ad-details/
│   │       ├── create-ad/
│   │       ├── my-ads/
│   │       └── preview-ad/
│   │       └── (todos com testes)
│   ├── components/             # Componentes reutilizáveis
│   │   ├── ad-details/         # Componente de detalhes do anúncio
│   │   ├── ads/                # Componente de lista de anúncios
│   │   ├── button/             # Componente de botão
│   │   ├── checkbox/           # Componente de checkbox
│   │   ├── image-slider/       # Componente de slider de imagens
│   │   ├── input/              # Componente de input
│   │   ├── loading/            # Componente de loading
│   │   ├── radio/              # Componente de radio
│   │   ├── tag-button/         # Componente de botão de tag
│   │   └── user-photo/         # Componente de foto do usuário
│   │   └── (todos com testes)
│   ├── contexts/               # Contextos React
│   │   └── auth/               # Contexto de autenticação
│   │       ├── auth.context.tsx
│   │       ├── use-auth.hook.tsx
│   │       ├── auth.context.test.tsx
│   │       └── use-auth.hook.test.tsx
│   └── hooks/                  # Hooks customizados
├── shared/                     # 🔄 Utilitários Compartilhados
│   ├── types/                  # Tipos e interfaces
│   │   └── interfaces/         # Interfaces de dados
│   │       ├── IProduct.ts     # Interface de produto
│   │       ├── IPhoto.ts       # Interface de foto
│   │       └── IUserProduct.ts # Interface de produto do usuário
│   ├── utils/                  # Utilitários
│   │   ├── Masks.util.ts       # Funções de máscara
│   │   └── Masks.util.test.ts  # Testes das funções de máscara
│   └── theme/                  # Tema da aplicação
├── main/                       # ⚙️ Configuração e Composição
│   ├── container/              # Container de injeção de dependência
│   │   ├── DIContainer.ts      # Gerenciador de dependências
│   │   ├── DIContainer.test.ts # Testes do container DI
│   │   ├── RepositoryKeys.ts   # Chaves dos repositórios
│   │   ├── UseCaseKeys.ts      # Chaves dos casos de uso
│   │   └── ContainerTypes.ts   # Tipos do container
│   └── routes/                 # Configuração de rotas
│       ├── index.tsx           # Roteador principal
│       ├── auth.routes.tsx     # Rotas de autenticação
│       ├── app.routes.tsx      # Rotas da aplicação
│       └── home-tabs.routes.tsx # Rotas das abas principais
└── assets/                     # 📦 Recursos Estáticos
    ├── logo.svg
    ├── logo_with_name.svg
    └── userPhotoDefault.png
```

## 🏗️ Camadas da Arquitetura

### 1. **Entities** (Regras de Negócio Puras)

- **Responsabilidade**: Regras de negócio fundamentais
- **Contém**: Validações, lógica de domínio, invariantes
- **Não depende de**: Nada externo
- **Exemplo**: Validação de email, verificação de telefone

```typescript
// src/entities/User.ts
export interface BaseUserModel {
  id: string;
  avatar: string;
  name: string;
  email: string;
  tel: string;
}

export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly avatar: string
  ) {
    this.validate();
  }

  private validate() {
    if (!this.isValidEmail()) {
      throw new Error('Invalid email format');
    }
  }

  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  toBaseUserModel(): BaseUserModel {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      tel: this.phone,
      avatar: this.avatar,
    };
  }
}
```

### 2. **Domain** (Contratos e Interfaces)

- **Responsabilidade**: Contratos e interfaces
- **Contém**: Interfaces de repositórios, serviços, tipos de erro
- **Não depende de**: Implementações concretas
- **Exemplo**: Interface para persistência de usuários

```typescript
// src/domain/interfaces/IUserRepository.ts
export interface IUserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  delete(id: string): Promise<void>;
}
```

### 3. **Application** (Casos de Uso)

- **Responsabilidade**: Casos de uso e orquestração
- **Contém**: Lógica de aplicação, validações de entrada, coordenação
- **Depende de**: Domain interfaces
- **Exemplo**: Processo de login, validação de dados

```typescript
// src/application/use-cases/auth/SignInUseCase.ts
export class SignInUseCase {
  constructor(
    private authService: IAuthService,
    private userRepository: IUserRepository
  ) {}

  async execute(
    request: SignInRequest
  ): Promise<{ user: User; tokens: AuthTokens }> {
    this.validateRequest(request);

    const { user, tokens } = await this.authService.signIn(request);
    await this.userRepository.save(user);

    return { user, tokens };
  }
}
```

### 4. **Infrastructure** (Implementações Concretas)

- **Responsabilidade**: Implementações concretas
- **Contém**: Acesso a dados, APIs externas, storage local
- **Depende de**: Domain interfaces
- **Exemplo**: HTTP client, AsyncStorage, mappers

```typescript
// src/infra/repositories/UserRepositoryImpl.ts
export class UserRepositoryImpl implements IUserRepository {
  async save(user: User): Promise<void> {
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      tel: user.phone,
      avatar: user.avatar,
    };
    await storageUserSave(userData);
  }
}
```

### 5. **Presentation** (Interface do Usuário)

- **Responsabilidade**: Interface do usuário
- **Contém**: Telas, componentes, ViewModels
- **Depende de**: Application use cases
- **Exemplo**: Telas de login, componentes de produto

```typescript
// src/presentation/view-models/auth/auth.view-model.tsx
export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const signInUseCase = container.get<SignInUseCase>('SignInUseCase');

  async function signInUser(email: string, password: string) {
    const { user, tokens } = await signInUseCase.execute({ email, password });
    // Lógica de UI...
  }
}
```

## 🔄 Fluxo de Comunicação

### Exemplo: Fluxo de Login

```
1. Presentation Layer (SignIn Screen)
   ↓
2. ViewModel (useSignInViewModel)
   ↓
3. Use Case (SignInUseCase)
   ↓
4. Domain Interface (IAuthService)
   ↓
5. Infrastructure (AuthServiceImpl)
   ↓
6. HTTP Repository (user.repository)
   ↓
7. API Externa
```

### Direção das Dependências

```
Presentation → Application → Domain ← Infrastructure
     ↓              ↓           ↑           ↑
   ViewModels   Use Cases   Interfaces  Implementations
```

## 🔗 Injeção de Dependência

### Container de DI

```typescript
// src/main/container/DIContainer.ts
class DIContainer {
  private dependencies: Map<string, unknown> = new Map();

  register<T>(key: string, implementation: T): void {
    this.dependencies.set(key, implementation);
  }

  get<T>(key: string): T {
    return this.dependencies.get(key) as T;
  }
}
```

### Registro de Dependências

```typescript
// Registro automático no container
container.register('IUserRepository', new UserRepositoryImpl());
container.register('IAuthService', new AuthServiceImpl());
container.register(
  'SignInUseCase',
  new SignInUseCase(
    container.get<IAuthService>('IAuthService'),
    container.get<IUserRepository>('IUserRepository')
  )
);
```

### Diferença entre DI e DIP

- **DI (Dependency Injection)**: Mecanismo técnico para injetar dependências
- **DIP (Dependency Inversion Principle)**: Princípio de design - dependências apontam para abstrações
- **O container implementa DI para aplicar DIP**

## 🧪 Testes

### Cobertura Completa

O projeto possui **703 testes** cobrindo todas as camadas da arquitetura:

- ✅ **46 suites de teste** passando
- ✅ **21 snapshots** de componentes
- ✅ **0 testes falhando**

### Estratégia de Testes

#### 1. **Testes de Entidades**

```typescript
// src/entities/User.test.ts
describe('User Entity', () => {
  it('should create user with valid data', () => {
    const user = new User(
      '1',
      'John Doe',
      'john@test.com',
      '11999999999',
      'avatar.jpg'
    );
    expect(user.name).toBe('John Doe');
  });

  it('should validate email format', () => {
    expect(() => {
      new User('1', 'John Doe', 'invalid-email', '11999999999', 'avatar.jpg');
    }).toThrow('Invalid email format');
  });
});
```

#### 2. **Testes de Use Cases**

```typescript
// src/application/use-cases/auth/SignInUseCase.test.ts
describe('SignInUseCase', () => {
  it('should sign in user successfully', async () => {
    const mockAuthService = {
      signIn: jest.fn().mockResolvedValue({ user, tokens }),
    };

    const signInUseCase = new SignInUseCase(
      mockAuthService,
      mockUserRepository
    );
    const result = await signInUseCase.execute({ email, password });

    expect(result.user).toEqual(user);
    expect(mockAuthService.signIn).toHaveBeenCalledWith({ email, password });
  });
});
```

#### 3. **Testes de Repositórios**

```typescript
// src/infra/repositories/UserRepositoryImpl.test.ts
describe('UserRepositoryImpl', () => {
  it('should save user to storage', async () => {
    const userRepository = new UserRepositoryImpl();
    await userRepository.save(mockUser);

    expect(storageUserSave).toHaveBeenCalledWith({
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      tel: mockUser.phone,
      avatar: mockUser.avatar,
    });
  });
});
```

#### 4. **Testes de Componentes**

```typescript
// src/presentation/components/button/view.test.tsx
describe('Button Component', () => {
  it('should render with correct title', () => {
    render(<Button title='Click me' onPress={mockOnPress} />);
    expect(screen.getByText('Click me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    render(<Button title='Click me' onPress={mockOnPress} />);
    fireEvent.press(screen.getByText('Click me'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
```

#### 5. **Testes de ViewModels**

```typescript
// src/presentation/screens/home/view-model.test.ts
describe('useHomeViewModel', () => {
  it('should fetch products on mount', async () => {
    const { result } = renderHook(() => useHomeViewModel());

    await waitFor(() => {
      expect(result.current.products).toEqual(mockProducts);
    });
  });
});
```

### Ferramentas de Teste

- **Jest** - Framework de testes
- **React Native Testing Library** - Testes de componentes React Native
- **@testing-library/react-hooks** - Testes de hooks customizados
- **Mocks** - Simulação de dependências externas

### Comandos de Teste

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm test -- --watch

# Executar testes com cobertura
npm test -- --coverage

# Executar testes específicos
npm test -- --testPathPattern="SignInUseCase"
```

### Mocking Strategy

#### 1. **Mocks de Navegação**

```typescript
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));
```

#### 2. **Mocks de Storage**

```typescript
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));
```

#### 3. **Mocks de HTTP**

```typescript
jest.mock('axios', () => ({
  create: () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }),
}));
```

### Benefícios dos Testes

- ✅ **Confiabilidade** - Garante que o código funciona como esperado
- ✅ **Refatoração segura** - Mudanças não quebram funcionalidades
- ✅ **Documentação viva** - Testes servem como documentação
- ✅ **Debugging** - Facilita identificação de problemas
- ✅ **CI/CD** - Integração contínua com qualidade garantida

## 🚀 Como Usar

### 1. Criar um novo Use Case

```typescript
// 1. Definir interface no Domain
export interface IProductService {
  createProduct(product: Product): Promise<void>;
}

// 2. Implementar no Infrastructure
export class ProductServiceImpl implements IProductService {
  async createProduct(product: Product): Promise<void> {
    // Implementação...
  }
}

// 3. Criar Use Case na Application
export class CreateProductUseCase {
  constructor(private productService: IProductService) {}

  async execute(request: CreateProductRequest): Promise<void> {
    // Lógica de aplicação...
  }
}

// 4. Registrar no DI Container
container.register('IProductService', new ProductServiceImpl());
container.register(
  'CreateProductUseCase',
  new CreateProductUseCase(container.get<IProductService>('IProductService'))
);
```

### 2. Usar na Presentation

```typescript
// No ViewModel
const createProductUseCase = container.get<CreateProductUseCase>(
  'CreateProductUseCase'
);

async function handleCreateProduct() {
  await createProductUseCase.execute(productData);
}
```

### 3. Estrutura de Testes

```typescript
// Teste de Use Case
describe('SignInUseCase', () => {
  it('should sign in user successfully', async () => {
    const mockAuthService = {
      signIn: jest.fn().mockResolvedValue({ user, tokens }),
    };

    const signInUseCase = new SignInUseCase(
      mockAuthService,
      mockUserRepository
    );
    const result = await signInUseCase.execute({ email, password });

    expect(result.user).toEqual(user);
  });
});
```

## 🛠️ Tecnologias

### Frontend

- **React Native** - Framework mobile
- **TypeScript** - Linguagem tipada
- **NativeBase** - Biblioteca de componentes UI
- **React Navigation** - Navegação
- **Expo** - Plataforma de desenvolvimento

### Backend & Storage

- **Axios** - Cliente HTTP
- **AsyncStorage** - Storage local
- **React Native Masked Text** - Máscaras de input

### Validação & Formulários

- **Yup** - Validação de schemas
- **React Hook Form** - Gerenciamento de formulários

### Testes

- **Jest** - Framework de testes
- **React Native Testing Library** - Testes de componentes
- **@testing-library/react-hooks** - Testes de hooks

### Desenvolvimento

- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **Babel** - Transpilação de código

## 📦 Instalação

```bash
# Instalar dependências
npm install

# iOS
cd ios && pod install && cd ..

# Executar no iOS
npm run ios

# Executar no Android
npm run android

# Executar testes
npm test
```

## 🎯 Benefícios da Arquitetura

### ✅ Separação de Responsabilidades

- Cada camada tem uma responsabilidade específica
- Fácil manutenção e teste
- Código organizado e previsível

### ✅ Inversão de Dependência

- Dependências apontam para dentro (Domain)
- Fácil troca de implementações
- Baixo acoplamento entre camadas

### ✅ Testabilidade Completa

- **703 testes** cobrindo toda a aplicação
- Cada camada pode ser testada isoladamente
- Mocks e stubs fáceis de implementar
- Refatoração segura com testes automatizados

### ✅ Flexibilidade

- Troca de banco de dados sem afetar regras de negócio
- Troca de UI sem afetar lógica de aplicação
- Injeção de dependência para fácil substituição

### ✅ Manutenibilidade

- Código organizado e previsível
- Fácil adição de novas features
- Refatoração segura com cobertura de testes
- Documentação viva através dos testes

### ✅ Qualidade de Código

- **46 suites de teste** passando
- **0 testes falhando**
- **21 snapshots** de componentes
- Padrões de código consistentes

## 📚 Referências

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 📊 Estatísticas do Projeto

- **📁 Arquivos**: 200+ arquivos organizados
- **🧪 Testes**: 703 testes (100% passando)
- **📦 Componentes**: 10+ componentes reutilizáveis
- **🏗️ Camadas**: 5 camadas bem definidas
- **🔧 Use Cases**: 6 casos de uso implementados
- **📱 Telas**: 8 telas principais
- **🎯 Cobertura**: 100% das funcionalidades testadas

---

**Desenvolvido com ❤️ seguindo as melhores práticas de Clean Architecture, SOLID e Test-Driven Development**
