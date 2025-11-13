import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import PropertyCard from "@/components/PropertyCard";
import PropertyDetailModal from "@/components/PropertyDetailModal";

export default function Properties() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const { data: properties = [] } = trpc.properties.list.useQuery();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Nossos Imóveis</h1>
        <p className="text-center text-gray-600 mb-12">
          Explore nossas propriedades exclusivas
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              location={property.location || ""}
              price={property.price || 0}
              areaMt2={property.areaMt2 || 0}
              bedrooms={property.bedrooms || 0}
              bathrooms={property.bathrooms || 0}
              mainImage={property.mainImage || ""}
              onViewDetails={setSelectedPropertyId}
            />
          ))}
        </div>

        {properties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Nenhum imóvel disponível no momento</p>
          </div>
        )}
      </div>

      <PropertyDetailModal
        isOpen={selectedPropertyId !== null}
        propertyId={selectedPropertyId}
        onClose={() => setSelectedPropertyId(null)}
      />
    </div>
  );
}
