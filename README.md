# MoraHub

MoraHub é uma plataforma de marketplace para moradores de residências universitárias. O projeto permite que usuários criem, gerenciem e visualizem anúncios de produtos e serviços.

## Tecnologias

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)

## Requisitos

- Node.js 18+
- Conta no Supabase

## Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd morahub
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Preencha as seguintes variáveis no arquivo `.env`:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Estrutura do Banco de Dados

O projeto utiliza o Supabase como banco de dados. As principais tabelas são:

- `users`: Armazena informações dos usuários
- `housing`: Cadastro de residências
- `categories`: Categorias de produtos/serviços
- `subcategories`: Subcategorias vinculadas às categorias
- `listings`: Anúncios de produtos/serviços
- `housing_validations`: Validações de vínculo com residências
- `ufmg_validations`: Validações de vínculo com a UFMG

## Autenticação

O sistema possui diferentes níveis de acesso:

- `VISITOR`: Acesso básico de visualização
- `UFMG`: Usuário com vínculo UFMG validado
- `RESIDENT`: Morador com residência validada
- `ADMIN`: Acesso administrativo completo

## Funcionalidades

### Autenticação
- Login com email/senha
- Registro de novos usuários
- Recuperação de senha
- Validação de vínculo UFMG/Residência

### Anúncios
- Criação de anúncios com múltiplas imagens
- Edição e exclusão de anúncios próprios
- Visualização detalhada com galeria de imagens
- Contato via WhatsApp
- Filtros por residência e categoria
- Contador de visualizações

### Gerenciamento de Imagens
- Upload de múltiplas imagens
- Armazenamento no Supabase Storage
- URLs assinadas para maior segurança
- Preview de imagens antes do upload

## Políticas de Segurança

### Row Level Security (RLS)
O projeto implementa políticas RLS no Supabase para garantir:

- Usuários só podem editar seus próprios anúncios
- Apenas administradores podem gerenciar residências
- Acesso público controlado a imagens e anúncios

### Storage
Políticas de acesso ao bucket de imagens:

- Upload permitido apenas para usuários autenticados
- Arquivos organizados por usuário
- URLs assinadas para acesso temporário

## Estrutura do Projeto

```
src/
├── components/         # Componentes React
│   ├── ui/            # Componentes de UI reutilizáveis
│   ├── auth/          # Componentes de autenticação
│   └── listing/       # Componentes de anúncios
├── hooks/             # Custom hooks
├── pages/             # Páginas da aplicação
├── services/          # Serviços de API
├── lib/               # Configurações e utilitários
└── integrations/      # Integrações com serviços externos
```

## Desenvolvimento

### Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Preview do build
npm run preview

# Lint
npm run lint

# Formatação
npm run format
```

### Boas Práticas

1. **Commits**: Siga o padrão Conventional Commits
   - `feat`: Nova funcionalidade
   - `fix`: Correção de bug
   - `docs`: Documentação
   - `style`: Formatação
   - `refactor`: Refatoração
   - `test`: Testes
   - `chore`: Manutenção

2. **Código**:
   - Use TypeScript para type safety
   - Mantenha componentes pequenos e focados
   - Documente funções e componentes complexos
   - Utilize os hooks do React adequadamente

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Suporte

Para suporte, envie um email para [seu-email@exemplo.com](mailto:seu-email@exemplo.com) ou abra uma issue no GitHub.
