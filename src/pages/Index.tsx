import { ListingCard } from "@/components/ui/listing/ListingCard";
import { useListing } from "@/hooks/useListing";
import { useEffect } from "react";

export default function Index() {
  const { listings, fetchListings } = useListing();

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Últimos Anúncios
        </h1>
        <p className="text-muted-foreground">
          Confira os anúncios mais recentes da comunidade
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}