import React from "react";
import { trpc } from "@/lib/trpc";
import { MessageCircle, Facebook, Instagram } from "lucide-react";

export default function SocialIcons() {
  const { data: settings } = trpc.settings.get.useQuery();

  if (!settings) return null;

  return (
    <div className="fixed left-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-50">
      {settings.whatsapp && (
        <a
          href={`https://wa.me/${settings.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-white shadow-lg rounded-full flex items-center justify-center text-green-600 hover:scale-110 transition-transform"
          title="WhatsApp"
        >
          <MessageCircle size={28} />
        </a>
      )}
      {settings.facebook && (
        <a
          href={settings.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-white shadow-lg rounded-full flex items-center justify-center text-blue-600 hover:scale-110 transition-transform"
          title="Facebook"
        >
          <Facebook size={28} />
        </a>
      )}
      {settings.instagram && (
        <a
          href={settings.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-white shadow-lg rounded-full flex items-center justify-center text-pink-600 hover:scale-110 transition-transform"
          title="Instagram"
        >
          <Instagram size={28} />
        </a>
      )}
    </div>
  );
}
