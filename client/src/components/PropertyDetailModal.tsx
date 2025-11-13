import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface PropertyDetailModalProps {
  isOpen: boolean;
  propertyId: number | null;
  onClose: () => void;
}

export default function PropertyDetailModal({
  isOpen,
  propertyId,
  onClose,
}: PropertyDetailModalProps) {
  const { data: property } = trpc.properties.getById.useQuery(
    { id: propertyId || 0 },
    { enabled: !!propertyId }
  );
  const { data: settings } = trpc.settings.get.useQuery();

  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{property.title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Imagem */}
          <div>
            {property.mainImage && (
              <img
                src={property.mainImage}
                alt={property.title}
                className="w-full h-80 object-cover rounded-lg shadow-lg"
              />
            )}
          </div>

          {/* Informações */}
          <div>
            <p className="text-gray-600 text-lg mb-2">{property.location}</p>
            <h3 className="text-3xl font-bold text-green-600 mb-4">
              R$ {property.price?.toLocaleString("pt-BR")}
            </h3>

            <ul className="space-y-2 text-sm">
              <li>📏 <strong>Área:</strong> {property.areaMt2}m²</li>
              <li>🛏️ <strong>Quartos:</strong> {property.bedrooms}</li>
              <li>🚿 <strong>Banheiros:</strong> {property.bathrooms}</li>
              {property.suites && <li>🛏️ <strong>Suítes:</strong> {property.suites}</li>}
              {property.garage && <li>🚗 <strong>Garagem:</strong> {property.garage}</li>}
              {property.pool === 1 && <li>🏊 <strong>Piscina:</strong> Sim</li>}
              {property.gym === 1 && <li>🏋️ <strong>Academia:</strong> Sim</li>}
              {property.bbq === 1 && <li>🍖 <strong>Churrasqueira:</strong> Sim</li>}
              {property.condominium && <li>💼 <strong>Condomínio:</strong> R$ {property.condominium.toLocaleString("pt-BR")}</li>}
              {property.iptu && <li>🧾 <strong>IPTU:</strong> R$ {property.iptu.toLocaleString("pt-BR")}</li>}
            </ul>

            {property.description && (
              <p className="mt-4 text-gray-700">{property.description}</p>
            )}
          </div>
        </div>

        {/* Rodapé com Redes Sociais */}
        <div className="mt-6 pt-4 border-t flex justify-center gap-6">
          {settings?.whatsapp && (
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 text-3xl hover:scale-110 transition"
              title="WhatsApp"
            >
              💬
            </a>
          )}
          {settings?.facebook && (
            <a
              href={settings.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-3xl hover:scale-110 transition"
              title="Facebook"
            >
              f
            </a>
          )}
          {settings?.instagram && (
            <a
              href={settings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 text-3xl hover:scale-110 transition"
              title="Instagram"
            >
              📷
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
