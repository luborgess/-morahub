import { Navbar } from "@/components/Navbar";
import { ListingCard } from "@/components/ListingCard";

// Mock data for initial display
const MOCK_LISTINGS = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    title: "Revisão de TCC",
    price: 150,
    type: "SALE" as const,
    category: {
      name: "Serviços Acadêmicos",
      type: "SERVICE" as const
    },
    subcategory: "Revisão de Trabalhos",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    user: {
      name: "João Silva",
      commercial_name: "Revisão Acadêmica"
    }
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    title: "Marmitas Fitness",
    price: 25,
    type: "SALE" as const,
    category: {
      name: "Alimentação e Bebidas",
      type: "PRODUCT" as const
    },
    subcategory: "Marmitas e Refeições Prontas",
    imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    user: {
      name: "Maria Santos",
      commercial_name: "Marmitas da Maria"
    }
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    title: "Notebook Dell Inspiron",
    price: 2500,
    type: "SALE" as const,
    condition: "SEMINOVO" as const,
    category: {
      name: "Eletrônicos",
      type: "PRODUCT" as const
    },
    subcategory: "Notebooks e Computadores",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    user: {
      name: "Pedro Oliveira"
    }
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    title: "Livros de Cálculo",
    price: 0,
    type: "DONATION" as const,
    condition: "USADO" as const,
    category: {
      name: "Material Acadêmico",
      type: "PRODUCT" as const
    },
    subcategory: "Livros Universitários",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    user: {
      name: "Ana Beatriz"
    }
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Encontre o que Precisa</h1>
          <p className="text-muted-foreground text-lg">
            Produtos e serviços para a comunidade universitária
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_LISTINGS.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </section>
      </main>
    </div>
  );
};

export default Index;