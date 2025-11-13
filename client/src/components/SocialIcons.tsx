import React from "react";
import { trpc } from "@/lib/trpc";
import { MessageCircle, Facebook, Instagram } from "lucide-react";

export default function SocialIcons() {
  const { data: settings, isLoading } = trpc.settings.get.useQuery();

  // Dados padrão enquanto carrega ou se não houver dados
  const defaultSettings = {
    whatsapp: "5511999999999",
    facebook: "https://facebook.com/lobiancoinvestimentos",
    instagram: "https://instagram.com/lobiancoinvestimentos",
  };

  const finalSettings = settings || defaultSettings;

  return (
    <div className="fixed left-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-50">
      {finalSettings.whatsapp && (
        <a
          href={`https://wa.me/${finalSettings.whatsapp.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-white shadow-lg rounded-full flex items-center justify-center text-green-600 hover:scale-110 transition-transform hover:shadow-xl"
          title="WhatsApp"
        >
          <MessageCircle size={28} />
        </a>
      )}
      {finalSettings.facebook && (
        <a
          href={finalSettings.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-white shadow-lg rounded-full flex items-center justify-center text-blue-600 hover:scale-110 transition-transform hover:shadow-xl"
          title="Facebook"
        >
          <Facebook size={28} />
        </a>
      )}
      {finalSettings.instagram && (
        <a
          href={finalSettings.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-white shadow-lg rounded-full flex items-center justify-center text-pink-600 hover:scale-110 transition-transform hover:shadow-xl"
          title="Instagram"
        >
          <Instagram size={28} />
        </a>
      )}
    </div>
  );
}
