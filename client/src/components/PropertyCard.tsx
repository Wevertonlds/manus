import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Home, Bath, Car, DollarSign } from "lucide-react";

interface PropertyCardProps {
  id: number;
  title: string;
  location: string;
  price: number;
  areaMt2: number;
  bedrooms: number;
  bathrooms: number;
  mainImage: string;
  onViewDetails: (id: number) => void;
}

export default function PropertyCard({
  id,
  title,
  location,
  price,
  areaMt2,
  bedrooms,
  bathrooms,
  mainImage,
  onViewDetails,
}: PropertyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {mainImage && (
        <img
          src={mainImage}
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin size={16} className="mr-1" />
          {location}
        </div>

        <div className="flex gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Home size={16} className="mr-1" />
            {areaMt2}m²
          </div>
          <div className="flex items-center">
            <Bath size={16} className="mr-1" />
            {bedrooms} qts
          </div>
          <div className="flex items-center">
            <Bath size={16} className="mr-1" />
            {bathrooms} bhs
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-green-600 font-bold text-lg">
            <DollarSign size={20} />
            {price.toLocaleString("pt-BR")}
          </div>
        </div>

        <Button
          onClick={() => onViewDetails(id)}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          Ver Detalhes
        </Button>
      </div>
    </div>
  );
}
