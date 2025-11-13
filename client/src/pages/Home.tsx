import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import LoginModal from "@/components/LoginModal";
import AdminModal from "@/components/AdminModal";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Queries
  const { data: carrosselData = [] } = trpc.carrossel.list.useQuery();
  const { data: investimentosData = [] } = trpc.investimentos.list.useQuery();
  const { data: configData } = trpc.config.get.useQuery();

  // Auto-advance carousel
  useEffect(() => {
    if (carrosselData.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carrosselData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carrosselData.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? carrosselData.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carrosselData.length);
  };

  const currentCarrossel = carrosselData[currentSlide];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={APP_LOGO} alt="Lobianco" className="h-10 w-10" />
            <span className="font-bold text-lg text-black hidden sm:inline">
              Lobianco
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-black hover:text-blue-700 transition">
              Home
            </a>
            <a href="#lancamentos" className="text-black hover:text-blue-700 transition">
              Compra na Planta
            </a>
            <a href="#aluguel" className="text-black hover:text-blue-700 transition">
              Aluguel
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">{user?.name || user?.email}</span>
                <Button
                  onClick={() => logout()}
                  variant="outline"
                  size="sm"
                >
                  Sair
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setShowLoginModal(true)}
                className="bg-blue-700 hover:bg-blue-800 text-white"
                size="sm"
              >
                Entrar
              </Button>
            )
          }

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-200 bg-gray-50 py-4">
            <div className="container mx-auto px-4 flex flex-col gap-4">
              <a href="#home" className="text-black hover:text-blue-700 transition">
                Home
              </a>
              <a href="#lancamentos" className="text-black hover:text-blue-700 transition">
                Compra na Planta
              </a>
              <a href="#aluguel" className="text-black hover:text-blue-700 transition">
                Aluguel
              </a>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Carousel Section */}
        <section id="home" className="relative h-96 md:h-[500px] bg-gray-900 overflow-hidden">
          {carrosselData.length > 0 ? (
            <>
              {/* Slides */}
              {carrosselData.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    idx === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {slide.imagemUrl ? (
                    <img
                      src={slide.imagemUrl}
                      alt={slide.titulo}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-700 to-blue-900 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h2 className="text-4xl font-bold mb-4">{slide.titulo}</h2>
                        <p className="text-lg text-gray-200">{slide.descricao}</p>
                      </div>
                    </div>
                  )}

                  {/* Overlay with content */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        {slide.titulo}
                      </h2>
                      <p className="text-lg md:text-xl text-gray-200 mb-8">
                        {slide.descricao}
                      </p>
                      <Button className="bg-blue-700 hover:bg-blue-800 text-white">
                        Saiba Mais
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Navigation Arrows */}
              <button
                onClick={handlePrevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full transition"
              >
                <ChevronLeft size={24} className="text-black" />
              </button>
              <button
                onClick={handleNextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full transition"
              >
                <ChevronRight size={24} className="text-black" />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {carrosselData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-3 h-3 rounded-full transition ${
                      idx === currentSlide ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-700 to-blue-900 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-4xl font-bold mb-4">Bem-vindo à Lobianco</h2>
                <p className="text-lg text-gray-200">Investimentos Imobiliários</p>
              </div>
            </div>
          )}
        </section>

        {/* Cards Section */}
        <section id="investimentos" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-black">
              Nossos Investimentos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {investimentosData.map((investimento) => (
                <div
                  key={investimento.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  {investimento.imagemUrl ? (
                    <img
                      src={investimento.imagemUrl}
                      alt={investimento.titulo}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center">
                      <span className="text-white text-center px-4">
                        {investimento.titulo}
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-black mb-2">
                      {investimento.titulo}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {investimento.descricao}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-blue-700 uppercase">
                        {investimento.tipo === "lancamentos"
                          ? "Lançamentos"
                          : investimento.tipo === "na_planta"
                          ? "Na Planta"
                          : "Aluguel"}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-700 border-blue-700 hover:bg-blue-50"
                      >
                        Ver Mais
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="sobre" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-black">
              Quem Somos
            </h2>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-gray-600 text-lg leading-relaxed">
                {configData?.quemSomos ||
                  "Lobianco Investimentos é uma empresa especializada em investimentos imobiliários, oferecendo oportunidades de crescimento patrimonial através de projetos imobiliários de qualidade. Com anos de experiência no mercado, garantimos transparência e segurança em cada investimento."}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Logo Section */}
            <div>
              <img src={APP_LOGO} alt="Lobianco" className="h-12 w-12 mb-4" />
              <p className="text-gray-400">Investimentos Imobiliários</p>
            </div>

            {/* Links Section */}
            <div>
              <h4 className="font-bold mb-4">Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#home" className="text-gray-400 hover:text-white transition">
                    Volta ao Início
                  </a>
                </li>
                <li>
                  <a href="#investimentos" className="text-gray-400 hover:text-white transition">
                    Investimentos
                  </a>
                </li>
              </ul>
            </div>

            {/* Admin Section */}
            <div>
              <h4 className="font-bold mb-4">Gestão</h4>
              {isAuthenticated && user?.role === "admin" ? (
                <button
                  onClick={() => setShowAdminModal(true)}
                  className="text-gray-400 hover:text-white transition"
                >
                  Área de Gestão
                </button>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-gray-400 hover:text-white transition"
                >
                  Login Admin
                </button>
              )}
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Lobianco Investimentos. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      )}

      {showAdminModal && isAuthenticated && user?.role === "admin" && (
        <AdminModal
          isOpen={showAdminModal}
          onClose={() => setShowAdminModal(false)}
        />
      )}
    </div>
  );
}
