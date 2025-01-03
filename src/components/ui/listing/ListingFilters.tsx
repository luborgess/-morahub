import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Icons } from '@/components/ui/icons';
import { useListing } from '@/hooks/useListing';
import type { ListingFilter } from '@/services/listing.service';

export function ListingFilters() {
  const {
    filters,
    setFilters,
    categories,
    housing,
    fetchCategories,
    fetchHousing,
  } = useListing();

  useEffect(() => {
    fetchCategories();
    fetchHousing();
  }, []);

  const handleFilterChange = (key: keyof ListingFilter, value: any) => {
    setFilters({ ...filters, [key]: value === 'all' ? undefined : value });
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <div className="flex-1">
          <Label htmlFor="search">Buscar</Label>
          <div className="relative">
            <Icons.search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Buscar anúncios..."
              className="pl-8"
              value={filters.search_query || ''}
              onChange={(e) => handleFilterChange('search_query', e.target.value)}
            />
          </div>
        </div>
        <div className="w-[180px]">
          <Label htmlFor="type">Tipo</Label>
          <Select
            value={filters.type || 'all'}
            onValueChange={(value) => handleFilterChange('type', value)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="SALE">Venda</SelectItem>
              <SelectItem value="RENT">Aluguel</SelectItem>
              <SelectItem value="DONATION">Doação</SelectItem>
              <SelectItem value="EXCHANGE">Troca</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="housing">Residência</Label>
          <Select
            value={filters.housing_id || 'all'}
            onValueChange={(value) => handleFilterChange('housing_id', value)}
          >
            <SelectTrigger id="housing">
              <SelectValue placeholder="Residência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {housing?.map((h: any) => (
                <SelectItem key={h.id} value={h.id}>
                  {h.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="category">Categoria</Label>
          <Select
            value={filters.category_id || 'all'}
            onValueChange={(value) => handleFilterChange('category_id', value)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories?.map((category: any) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="condition">Condição</Label>
          <Select
            value={filters.condition || 'all'}
            onValueChange={(value) => handleFilterChange('condition', value)}
          >
            <SelectTrigger id="condition">
              <SelectValue placeholder="Condição" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="NOVO">Novo</SelectItem>
              <SelectItem value="SEMINOVO">Seminovo</SelectItem>
              <SelectItem value="USADO">Usado</SelectItem>
              <SelectItem value="DEFEITO">Com Defeito</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Preço</Label>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.min_price || ''}
              onChange={(e) => handleFilterChange('min_price', e.target.value ? Number(e.target.value) : undefined)}
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.max_price || ''}
              onChange={(e) => handleFilterChange('max_price', e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => setFilters({})}
      >
        <Icons.reset className="mr-2 h-4 w-4" />
        Limpar Filtros
      </Button>
    </div>
  );
}
