import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Loader2, Upload, X, Edit2, Trash2 } from "lucide-react";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const [activeTab, setActiveTab] = useState("carrossel");
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Carrossel state
  const [carrosselTitle, setCarrosselTitle] = useState("");
  const [carrosselDesc, setCarrosselDesc] = useState("");
  const [carrosselImage, setCarrosselImage] = useState<File | null>(null);
  const [carrosselImagePreview, setCarrosselImagePreview] = useState("");

  // Investimentos state
  const [investTitle, setInvestTitle] = useState("");
  const [investDesc, setInvestDesc] = useState("");
  const [investType, setInvestType] = useState("lancamentos");
  const [investImage, setInvestImage] = useState<File | null>(null);
  const [investImagePreview, setInvestImagePreview] = useState("");

  // Config state
  const [quemSomos, setQuemSomos] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#1E40AF");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState("");

  // Queries
  const { data: configData, refetch: refetchConfig } = trpc.config.get.useQuery();
  const { data: carrosselData = [], refetch: refetchCarrossel } = trpc.carrossel.list.useQuery();
  const { data: investimentosData = [], refetch: refetchInvestimentos } = trpc.investimentos.list.useQuery();

  // Mutations
  const createCarrossel = trpc.carrossel.create.useMutation();
  const updateCarrosselMut = trpc.carrossel.update.useMutation();
  const deleteCarrosselMut = trpc.carrossel.delete.useMutation();
  
  const createInvestimento = trpc.investimentos.create.useMutation();
  const updateInvestimentoMut = trpc.investimentos.update.useMutation();
  const deleteInvestimentoMut = trpc.investimentos.delete.useMutation();
  
  const updateConfig = trpc.config.update.useMutation();
  const uploadFile = trpc.storage.uploadFile.useMutation();

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void,
    setPreview: (preview: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  };

  const handleAddCarrossel = async () => {
    if (!carrosselTitle || !carrosselDesc) {
      toast.error("Preencha todos os campos");
      return;
    }

    setIsLoading(true);
    try {
      let imageUrl = carrosselImagePreview;

      if (carrosselImage) {
        const base64 = await fileToBase64(carrosselImage);
        const result = await uploadFile.mutateAsync({
          bucket: "carrossel",
          filename: carrosselImage.name,
          fileBase64: base64,
        });
        if (!result) {
          toast.error("Erro ao fazer upload da imagem");
          setIsLoading(false);
          return;
        }
        imageUrl = result.url;
      }

      if (editingId) {
        await updateCarrosselMut.mutateAsync({
          id: editingId,
          titulo: carrosselTitle,
          descricao: carrosselDesc,
          imagemUrl: imageUrl,
        });
        toast.success("Slide atualizado com sucesso!");
        setEditingId(null);
      } else {
        await createCarrossel.mutateAsync({
          titulo: carrosselTitle,
          descricao: carrosselDesc,
          imagemUrl: imageUrl,
        });
        toast.success("Slide adicionado com sucesso!");
      }

      setCarrosselTitle("");
      setCarrosselDesc("");
      setCarrosselImage(null);
      setCarrosselImagePreview("");
      refetchCarrossel();
    } catch (error) {
      toast.error("Erro ao salvar slide");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCarrossel = (slide: any) => {
    setEditingId(slide.id);
    setCarrosselTitle(slide.titulo);
    setCarrosselDesc(slide.descricao);
    setCarrosselImagePreview(slide.imagemUrl || "");
  };

  const handleDeleteCarrossel = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este slide?")) return;
    
    setIsLoading(true);
    try {
      await deleteCarrosselMut.mutateAsync({ id });
      toast.success("Slide excluído com sucesso!");
      refetchCarrossel();
    } catch (error) {
      toast.error("Erro ao excluir slide");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddInvestimento = async () => {
    if (!investTitle || !investDesc) {
      toast.error("Preencha todos os campos");
      return;
    }

    setIsLoading(true);
    try {
      let imageUrl = investImagePreview;

      if (investImage) {
        const base64 = await fileToBase64(investImage);
        const result = await uploadFile.mutateAsync({
          bucket: "investimentos",
          filename: investImage.name,
          fileBase64: base64,
        });
        if (!result) {
          toast.error("Erro ao fazer upload da imagem");
          setIsLoading(false);
          return;
        }
        imageUrl = result.url;
      }

      if (editingId) {
        await updateInvestimentoMut.mutateAsync({
          id: editingId,
          tipo: investType as "lancamentos" | "na_planta" | "aluguel",
          titulo: investTitle,
          descricao: investDesc,
          imagemUrl: imageUrl,
        });
        toast.success("Investimento atualizado com sucesso!");
        setEditingId(null);
      } else {
        await createInvestimento.mutateAsync({
          tipo: investType as "lancamentos" | "na_planta" | "aluguel",
          titulo: investTitle,
          descricao: investDesc,
          imagemUrl: imageUrl,
        });
        toast.success("Investimento adicionado com sucesso!");
      }

      setInvestTitle("");
      setInvestDesc("");
      setInvestImage(null);
      setInvestImagePreview("");
      refetchInvestimentos();
    } catch (error) {
      toast.error("Erro ao salvar investimento");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditInvestimento = (invest: any) => {
    setEditingId(invest.id);
    setInvestTitle(invest.titulo);
    setInvestDesc(invest.descricao);
    setInvestType(invest.tipo);
    setInvestImagePreview(invest.imagemUrl || "");
  };

  const handleDeleteInvestimento = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este investimento?")) return;
    
    setIsLoading(true);
    try {
      await deleteInvestimentoMut.mutateAsync({ id });
      toast.success("Investimento excluído com sucesso!");
      refetchInvestimentos();
    } catch (error) {
      toast.error("Erro ao excluir investimento");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateConfig = async () => {
    setIsLoading(true);
    try {
      await updateConfig.mutateAsync({
        quemSomos: quemSomos || configData?.quemSomos || "",
        corPrimaria: primaryColor,
        tamanho: 16,
      } as any);

      toast.success("Configurações atualizadas com sucesso!");
      refetchConfig();
    } catch (error) {
      toast.error("Erro ao atualizar configurações");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Área de Gestão</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="carrossel">Carrossel</TabsTrigger>
            <TabsTrigger value="investimentos">Investimentos</TabsTrigger>
            <TabsTrigger value="config">Configurações</TabsTrigger>
          </TabsList>

          {/* Carrossel Tab */}
          <TabsContent value="carrossel" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título</label>
                <Input
                  value={carrosselTitle}
                  onChange={(e) => setCarrosselTitle(e.target.value)}
                  placeholder="Ex: Oportunidade de Ouro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <Textarea
                  value={carrosselDesc}
                  onChange={(e) => setCarrosselDesc(e.target.value)}
                  placeholder="Descrição do slide"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Imagem</label>
                <div className="border-2 border-dashed rounded-lg p-4">
                  {carrosselImagePreview ? (
                    <div className="relative">
                      <img
                        src={carrosselImagePreview}
                        alt="Preview"
                        className="max-h-48 rounded"
                      />
                      <button
                        onClick={() => {
                          setCarrosselImage(null);
                          setCarrosselImagePreview("");
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload size={24} />
                      <span className="text-sm">Clique para fazer upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageChange(e, setCarrosselImage, setCarrosselImagePreview)
                        }
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <Button
                onClick={handleAddCarrossel}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                {editingId ? "Atualizar Slide" : "Adicionar Slide"}
              </Button>

              {editingId && (
                <Button
                  onClick={() => {
                    setEditingId(null);
                    setCarrosselTitle("");
                    setCarrosselDesc("");
                    setCarrosselImage(null);
                    setCarrosselImagePreview("");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Cancelar Edição
                </Button>
              )}

              <div className="mt-6">
                <h3 className="font-semibold mb-3">Slides Atuais</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {carrosselData.map((slide) => (
                    <div key={slide.id} className="p-3 bg-gray-100 rounded flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{slide.titulo}</p>
                        <p className="text-sm text-gray-600">{slide.descricao}</p>
                        {slide.imagemUrl && (
                          <img src={slide.imagemUrl} alt={slide.titulo} className="max-h-20 mt-2 rounded" />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCarrossel(slide)}
                          className="p-2 hover:bg-blue-100 rounded"
                        >
                          <Edit2 size={16} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteCarrossel(slide.id)}
                          className="p-2 hover:bg-red-100 rounded"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Investimentos Tab */}
          <TabsContent value="investimentos" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo</label>
                <select
                  value={investType}
                  onChange={(e) => setInvestType(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="lancamentos">Lançamentos</option>
                  <option value="na_planta">Na Planta</option>
                  <option value="aluguel">Aluguel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Título</label>
                <Input
                  value={investTitle}
                  onChange={(e) => setInvestTitle(e.target.value)}
                  placeholder="Ex: Residencial Premium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <Textarea
                  value={investDesc}
                  onChange={(e) => setInvestDesc(e.target.value)}
                  placeholder="Descrição do investimento"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Imagem</label>
                <div className="border-2 border-dashed rounded-lg p-4">
                  {investImagePreview ? (
                    <div className="relative">
                      <img
                        src={investImagePreview}
                        alt="Preview"
                        className="max-h-48 rounded"
                      />
                      <button
                        onClick={() => {
                          setInvestImage(null);
                          setInvestImagePreview("");
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload size={24} />
                      <span className="text-sm">Clique para fazer upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageChange(e, setInvestImage, setInvestImagePreview)
                        }
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <Button
                onClick={handleAddInvestimento}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                {editingId ? "Atualizar Investimento" : "Adicionar Investimento"}
              </Button>

              {editingId && (
                <Button
                  onClick={() => {
                    setEditingId(null);
                    setInvestTitle("");
                    setInvestDesc("");
                    setInvestImage(null);
                    setInvestImagePreview("");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Cancelar Edição
                </Button>
              )}

              <div className="mt-6">
                <h3 className="font-semibold mb-3">Investimentos Atuais</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {investimentosData.map((invest) => (
                    <div key={invest.id} className="p-3 bg-gray-100 rounded flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{invest.titulo}</p>
                        <p className="text-xs text-gray-500 mb-1">{invest.tipo}</p>
                        <p className="text-sm text-gray-600">{invest.descricao}</p>
                        {invest.imagemUrl && (
                          <img src={invest.imagemUrl} alt={invest.titulo} className="max-h-20 mt-2 rounded" />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditInvestimento(invest)}
                          className="p-2 hover:bg-blue-100 rounded"
                        >
                          <Edit2 size={16} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteInvestimento(invest.id)}
                          className="p-2 hover:bg-red-100 rounded"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Config Tab */}
          <TabsContent value="config" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Quem Somos</label>
                <Textarea
                  value={quemSomos || configData?.quemSomos || ""}
                  onChange={(e) => setQuemSomos(e.target.value)}
                  placeholder="Descrição da empresa"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cor Primária</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-10 rounded"
                  />
                  <Input value={primaryColor} readOnly />
                </div>
              </div>

              <Button
                onClick={handleUpdateConfig}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                Salvar Configurações
              </Button>

              {configData && (
                <div className="mt-6 p-4 bg-blue-50 rounded">
                  <h3 className="font-semibold mb-2">Configurações Atuais</h3>
                  <p className="text-sm"><strong>Quem Somos:</strong> {configData.quemSomos}</p>
                  <p className="text-sm"><strong>Cor Primária:</strong> {configData.corPrimaria}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
