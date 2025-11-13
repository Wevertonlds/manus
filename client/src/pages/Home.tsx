import React, { useState, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";
import LoginPasswordModal from "@/components/LoginPasswordModal";
import AdminModal from "@/components/AdminModal";

export default function Home() {
  const { user, loading, error, isAuthenticated, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const { data: carouselData } = trpc.carrossel.list.useQuery();
  const { data: investimentosData } = trpc.investimentos.list.useQuery();
  const { data: configData } = trpc.config.get.useQuery();

  // Filtrar investimentos por tipo
  const compras = investimentosData?.filter((inv) => inv.tipo === "LANÇAMENTOS") || [];
  const comprasPlanta = investimentosData?.filter((inv) => inv.tipo === "NA_PLANTA") || [];
  const aluguel = investimentosData?.filter((inv) => inv.tipo === "ALUGUEL") || [];

  // Auto-avançar carrossel
  React.useEffect(() => {
    if (!carouselData || carouselData.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselData]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAdminClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setShowAdminModal(true);
  };

  const handleCloseAdmin = () => {
    setShowAdminModal(false);
    setIsAdminLoggedIn(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />}
            <span className="font-bold text-lg">{APP_TITLE}</span>
          </div>

          <nav className="flex items-center gap-6">
            <button
              onClick={() => scrollToSection("home")}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("compra")}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Compra
            </button>
            <button
              onClick={() => scrollToSection("compra-planta")}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Compra na Planta
            </button>
            <button
              onClick={() => scrollToSection("aluguel")}
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Aluguel
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Home Section - Carousel */}
        <section id="home" className="relative h-96 bg-gray-900 overflow-hidden">
          <div ref={carouselRef} className="relative w-full h-full">
            {carouselData && carouselData.length > 0 ? (
              <>
                {carouselData.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <img
                      src={slide.imagemUrl}
                      alt={slide.titulo}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                      <h1 className="text-4xl font-bold text-white text-center mb-4">
                        {slide.titulo}
                      </h1>
                      <p className="text-xl text-white text-center mb-8 max-w-2xl">
                        {slide.descricao}
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        {slide.botaoTexto}
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Carousel Controls */}
                <button
                  onClick={() =>
                    setCurrentSlide((prev) =>
                      prev === 0 ? carouselData.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full transition"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() =>
                    setCurrentSlide((prev) => (prev + 1) % carouselData.length)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full transition"
                >
                  <ChevronRight size={24} />
                </button>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {carouselData.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition ${
                        index === currentSlide ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <p className="text-white">Carrossel não configurado</p>
              </div>
            )}
          </div>
        </section>

        {/* Quem Somos Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Quem Somos</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {configData?.quemSomos ||
                "Lobianco Investimentos é uma empresa especializada em investimentos imobiliários, oferecendo oportunidades de crescimento patrimonial através de projetos imobiliários de qualidade."}
            </p>
          </div>
        </section>

        {/* Compra Section */}
        <section id="compra" className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Compra</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {compras.length > 0 ? (
                compras.map((inv) => (
                  <div
                    key={inv.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                  >
                    <img
                      src={inv.imagemUrl}
                      alt={inv.titulo}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{inv.titulo}</h3>
                      <p className="text-gray-600 text-sm mb-4">{inv.descricao}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-bold">
                          R$ {inv.preco?.toLocaleString("pt-BR") || "N/A"}
                        </span>
                        <Button variant="outline" size="sm">
                          Ver Mais
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-3 text-center">
                  Nenhum imóvel disponível
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Compra na Planta Section */}
        <section id="compra-planta" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Compra na Planta</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comprasPlanta.length > 0 ? (
                comprasPlanta.map((inv) => (
                  <div
                    key={inv.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                  >
                    <img
                      src={inv.imagemUrl}
                      alt={inv.titulo}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{inv.titulo}</h3>
                      <p className="text-gray-600 text-sm mb-4">{inv.descricao}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-bold">
                          R$ {inv.preco?.toLocaleString("pt-BR") || "N/A"}
                        </span>
                        <Button variant="outline" size="sm">
                          Ver Mais
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-3 text-center">
                  Nenhum imóvel disponível
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Aluguel Section */}
        <section id="aluguel" className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Aluguel</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aluguel.length > 0 ? (
                aluguel.map((inv) => (
                  <div
                    key={inv.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                  >
                    <img
                      src={inv.imagemUrl}
                      alt={inv.titulo}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{inv.titulo}</h3>
                      <p className="text-gray-600 text-sm mb-4">{inv.descricao}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-bold">
                          R$ {inv.preco?.toLocaleString("pt-BR") || "N/A"}
                        </span>
                        <Button variant="outline" size="sm">
                          Ver Mais
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-3 text-center">
                  Nenhum imóvel disponível
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Social Icons */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-30">
        <a
          href="https://wa.me/5511999999999"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition"
          title="WhatsApp"
        >
          <span className="text-xl">💬</span>
        </a>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition"
          title="Facebook"
        >
          <span className="text-xl">f</span>
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-full shadow-lg transition"
          title="Instagram"
        >
          <span className="text-xl">📷</span>
        </a>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Links</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection("home")}
                    className="hover:text-blue-400 transition"
                  >
                    Volta ao Início
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("compra")}
                    className="hover:text-blue-400 transition"
                  >
                    Compra
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("compra-planta")}
                    className="hover:text-blue-400 transition"
                  >
                    Compra na Planta
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("aluguel")}
                    className="hover:text-blue-400 transition"
                  >
                    Aluguel
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Gestão</h3>
              <button
                onClick={handleAdminClick}
                className="hover:text-blue-400 transition"
              >
                Área de Gestão
              </button>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Empresa</h3>
              <p className="text-gray-400">Lobianco Investimentos</p>
              <p className="text-gray-400 text-sm mt-2">
                Especializada em investimentos imobiliários
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>© 2024 Lobianco Investimentos. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginPasswordModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {isAdminLoggedIn && (
        <AdminModal isOpen={showAdminModal} onClose={handleCloseAdmin} />
      )}
    </div>
  );
}
