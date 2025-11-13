import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const [activeTab, setActiveTab] = useState<"carrossel" | "investimentos" | "config">(
    "carrossel"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Queries
  const { data: carrosselData = [], refetch: refetchCarrossel } =
    trpc.carrossel.list.useQuery();
  const { data: investimentosData = [], refetch: refetchInvestimentos } =
    trpc.investimentos.list.useQuery();
  const { data: configData, refetch: refetchConfig } = trpc.config.get.useQuery();

  // Mutations
  const createCarrosselMutation = trpc.carrossel.create.useMutation();
  const updateCarrosselMutation = trpc.carrossel.update.useMutation();
  const deleteCarrosselMutation = trpc.carrossel.delete.useMutation();

  const createInvestimentoMutation = trpc.investimentos.create.useMutation();
  const updateInvestimentoMutation = trpc.investimentos.update.useMutation();
  const deleteInvestimentoMutation = trpc.investimentos.delete.useMutation();

  const updateConfigMutation = trpc.config.update.useMutation();

  // Form states
  const [carrosselForm, setCarrosselForm] = useState({
    titulo: "",
    descricao: "",
    imagemUrl: "",
  });

  const [investimentoForm, setInvestimentoForm] = useState({
    tipo: "lancamentos" as const,
    titulo: "",
    descricao: "",
    imagemUrl: "",
  });

  const [configForm, setConfigForm] = useState({
    quemSomos: configData?.quemSomos || "",
    corPrimaria: configData?.corPrimaria || "#1E40AF",
  });

  const handleAddCarrossel = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await createCarrosselMutation.mutateAsync(carrosselForm);
      setCarrosselForm({ titulo: "", descricao: "", imagemUrl: "" });
      setSuccess("Slide adicionado com sucesso!");
      refetchCarrossel();
    } catch (err) {
      setError("Erro ao adicionar slide");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCarrossel = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este slide?")) return;

    setLoading(true);
    try {
      await deleteCarrosselMutation.mutateAsync({ id });
      setSuccess("Slide deletado com sucesso!");
      refetchCarrossel();
    } catch (err) {
      setError("Erro ao deletar slide");
    } finally {
      setLoading(false);
    }
  };

  const handleAddInvestimento = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await createInvestimentoMutation.mutateAsync(investimentoForm);
      setInvestimentoForm({
        tipo: "lancamentos",
        titulo: "",
        descricao: "",
        imagemUrl: "",
      });
      setSuccess("Investimento adicionado com sucesso!");
      refetchInvestimentos();
    } catch (err) {
      setError("Erro ao adicionar investimento");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInvestimento = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este investimento?")) return;

    setLoading(true);
    try {
      await deleteInvestimentoMutation.mutateAsync({ id });
      setSuccess("Investimento deletado com sucesso!");
      refetchInvestimentos();
    } catch (err) {
      setError("Erro ao deletar investimento");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await updateConfigMutation.mutateAsync(configForm);
      setSuccess("Configurações atualizadas com sucesso!");
      refetchConfig();
    } catch (err) {
      setError("Erro ao atualizar configurações");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <X size={24} />
        </button>

        {/* Modal Content */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-black mb-6">Área de Gestão</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("carrossel")}
              className={`px-4 py-2 font-semibold border-b-2 transition ${
                activeTab === "carrossel"
                  ? "border-blue-700 text-blue-700"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Carrossel
            </button>
            <button
              onClick={() => setActiveTab("investimentos")}
              className={`px-4 py-2 font-semibold border-b-2 transition ${
                activeTab === "investimentos"
                  ? "border-blue-700 text-blue-700"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Investimentos
            </button>
            <button
              onClick={() => setActiveTab("config")}
              className={`px-4 py-2 font-semibold border-b-2 transition ${
                activeTab === "config"
                  ? "border-blue-700 text-blue-700"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Configurações
            </button>
          </div>

          {/* Carrossel Tab */}
          {activeTab === "carrossel" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-black mb-4">Adicionar Slide</h3>
                <form onSubmit={handleAddCarrossel} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título
                    </label>
                    <input
                      type="text"
                      value={carrosselForm.titulo}
                      onChange={(e) =>
                        setCarrosselForm({
                          ...carrosselForm,
                          titulo: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={carrosselForm.descricao}
                      onChange={(e) =>
                        setCarrosselForm({
                          ...carrosselForm,
                          descricao: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 resize-none"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL da Imagem
                    </label>
                    <input
                      type="url"
                      value={carrosselForm.imagemUrl}
                      onChange={(e) =>
                        setCarrosselForm({
                          ...carrosselForm,
                          imagemUrl: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                      placeholder="https://..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-700 hover:bg-blue-800 text-white"
                  >
                    {loading ? "Adicionando..." : "Adicionar Slide"}
                  </Button>
                </form>
              </div>

              {/* Carrossel List */}
              <div>
                <h3 className="text-lg font-bold text-black mb-4">Slides Existentes</h3>
                <div className="space-y-4">
                  {carrosselData.map((slide) => (
                    <div
                      key={slide.id}
                      className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-black">{slide.titulo}</h4>
                        <p className="text-sm text-gray-600">{slide.descricao}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteCarrossel(slide.id)}
                        disabled={loading}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Investimentos Tab */}
          {activeTab === "investimentos" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-black mb-4">
                  Adicionar Investimento
                </h3>
                <form onSubmit={handleAddInvestimento} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo
                    </label>
                    <select
                      value={investimentoForm.tipo}
                      onChange={(e) =>
                        setInvestimentoForm({
                          ...investimentoForm,
                          tipo: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                    >
                      <option value="lancamentos">Lançamentos</option>
                      <option value="na_planta">Na Planta</option>
                      <option value="aluguel">Aluguel</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título
                    </label>
                    <input
                      type="text"
                      value={investimentoForm.titulo}
                      onChange={(e) =>
                        setInvestimentoForm({
                          ...investimentoForm,
                          titulo: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={investimentoForm.descricao}
                      onChange={(e) =>
                        setInvestimentoForm({
                          ...investimentoForm,
                          descricao: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 resize-none"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL da Imagem
                    </label>
                    <input
                      type="url"
                      value={investimentoForm.imagemUrl}
                      onChange={(e) =>
                        setInvestimentoForm({
                          ...investimentoForm,
                          imagemUrl: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                      placeholder="https://..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-700 hover:bg-blue-800 text-white"
                  >
                    {loading ? "Adicionando..." : "Adicionar Investimento"}
                  </Button>
                </form>
              </div>

              {/* Investimentos List */}
              <div>
                <h3 className="text-lg font-bold text-black mb-4">
                  Investimentos Existentes
                </h3>
                <div className="space-y-4">
                  {investimentosData.map((inv) => (
                    <div
                      key={inv.id}
                      className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-black">{inv.titulo}</h4>
                        <p className="text-sm text-gray-600">{inv.descricao}</p>
                        <span className="inline-block mt-2 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                          {inv.tipo === "lancamentos"
                            ? "Lançamentos"
                            : inv.tipo === "na_planta"
                            ? "Na Planta"
                            : "Aluguel"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteInvestimento(inv.id)}
                        disabled={loading}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Config Tab */}
          {activeTab === "config" && (
            <div>
              <h3 className="text-lg font-bold text-black mb-4">Configurações do Site</h3>
              <form onSubmit={handleUpdateConfig} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quem Somos
                  </label>
                  <textarea
                    value={configForm.quemSomos}
                    onChange={(e) =>
                      setConfigForm({
                        ...configForm,
                        quemSomos: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 resize-none"
                    rows={5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor Primária
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="color"
                      value={configForm.corPrimaria}
                      onChange={(e) =>
                        setConfigForm({
                          ...configForm,
                          corPrimaria: e.target.value,
                        })
                      }
                      className="w-20 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={configForm.corPrimaria}
                      onChange={(e) =>
                        setConfigForm({
                          ...configForm,
                          corPrimaria: e.target.value,
                        })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                      placeholder="#1E40AF"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-700 hover:bg-blue-800 text-white"
                >
                  {loading ? "Salvando..." : "Salvar Configurações"}
                </Button>
              </form>
            </div>
          )}

          {/* Close Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              Fechar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
