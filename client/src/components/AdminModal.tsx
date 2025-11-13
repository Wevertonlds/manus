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
  const [whatsapp, setWhatsapp] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState("");

  // Queries
  const { data: configData, refetch: refetchConfig } = trpc.config.get.useQuery();
  const { data: settingsData, refetch: refetchSettings } = trpc.settings.get.useQuery();
  const { data: carrosselData = [], refetch: refetchCarrossel } = trpc.carrossel.list.useQuery();
  const { data: investimentosData = [], refetch: refetchInvestimentos } = trpc.investimentos.list.useQuery();

  // Mutations
  const createCarrossel = trpc.carrossel.create.useMutation();
  const updateCarrosselMut = trpc.carrossel.update.useMutation();
  const deleteCarrosselMut = trpc.carrossel.delete.useMutation();
  const createInvestimento = trpc.investimentos.create.useMutation();
  const updateInvestimentoMut = trpc.investimentos.update.useMutation();
  const deleteInvestimentoMut = trpc.investimentos.delete.useMutation();
  const updateConfigMut = trpc.config.update.useMutation();
  const updateSettingsMut = trpc.settings.update.useMutation();
  const uploadFile = trpc.storage.uploadFile.useMutation();

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

  // Carrossel handlers
  const handleAddCarrossel = async () => {
    if (!carrosselTitle) {
      toast.error("Preencha o título");
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
        toast.success("Slide atualizado!");
        setEditingId(null);
      } else {
        await createCarrossel.mutateAsync({
          titulo: carrosselTitle,
          descricao: carrosselDesc,
          imagemUrl: imageUrl,
        });
        toast.success("Slide adicionado!");
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

  const handleDeleteCarrossel = async (id: number) => {
    if (!confirm("Tem certeza?")) return;
    try {
      await deleteCarrosselMut.mutateAsync({ id });
      toast.success("Slide excluído!");
      refetchCarrossel();
    } catch (error) {
      toast.error("Erro ao excluir");
    }
  };

  // Investimentos handlers
  const handleAddInvestimento = async () => {
    if (!investTitle) {
      toast.error("Preencha o título");
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
        toast.success("Investimento atualizado!");
        setEditingId(null);
      } else {
        await createInvestimento.mutateAsync({
          tipo: investType as "lancamentos" | "na_planta" | "aluguel",
          titulo: investTitle,
          descricao: investDesc,
          imagemUrl: imageUrl,
        });
        toast.success("Investimento adicionado!");
      }

      setInvestTitle("");
      setInvestDesc("");
      setInvestType("lancamentos");
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

  const handleDeleteInvestimento = async (id: number) => {
    if (!confirm("Tem certeza?")) return;
    try {
      await deleteInvestimentoMut.mutateAsync({ id });
      toast.success("Investimento excluído!");
      refetchInvestimentos();
    } catch (error) {
      toast.error("Erro ao excluir");
    }
  };

  // Config handlers
  const handleUpdateConfig = async () => {
    setIsLoading(true);
    try {
      await updateConfigMut.mutateAsync({
        quemSomos: quemSomos || configData?.quemSomos || "",
        corPrimaria: primaryColor,
      });
      toast.success("Configurações atualizadas!");
      refetchConfig();
    } catch (error) {
      toast.error("Erro ao atualizar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSettings = async () => {
    setIsLoading(true);
    try {
      await updateSettingsMut.mutateAsync({
        whatsapp: whatsapp || settingsData?.whatsapp || "",
        facebook: facebook || settingsData?.facebook || "",
        instagram: instagram || settingsData?.instagram || "",
      });
      toast.success("Redes sociais atualizadas!");
      refetchSettings();
    } catch (error) {
      toast.error("Erro ao atualizar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Área de Gestão</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="carrossel">Slides</TabsTrigger>
            <TabsTrigger value="investimentos">Investimentos</TabsTrigger>
            <TabsTrigger value="config">Configurações</TabsTrigger>
            <TabsTrigger value="redes">Redes Sociais</TabsTrigger>
          </TabsList>

          {/* Carrossel Tab */}
          <TabsContent value="carrossel" className="space-y-4">
            <div className="space-y-4">
              <Input
                placeholder="Título do slide"
                value={carrosselTitle}
                onChange={(e) => setCarrosselTitle(e.target.value)}
              />
              <Textarea
                placeholder="Descrição"
                value={carrosselDesc}
                onChange={(e) => setCarrosselDesc(e.target.value)}
              />

              <div className="border-2 border-dashed rounded-lg p-4">
                {carrosselImagePreview ? (
                  <div className="relative">
                    <img src={carrosselImagePreview} alt="Preview" className="max-h-32 rounded" />
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
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, setCarrosselImage, setCarrosselImagePreview)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <Button onClick={handleAddCarrossel} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                {editingId ? "Atualizar Slide" : "Adicionar Slide"}
              </Button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {carrosselData.map((item) => (
                <div key={item.id} className="p-3 bg-gray-100 rounded flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.titulo}</p>
                    {item.imagemUrl && <img src={item.imagemUrl} alt={item.titulo} className="max-h-12 mt-1 rounded" />}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingId(item.id); setCarrosselTitle(item.titulo); setCarrosselDesc(item.descricao || ""); setCarrosselImagePreview(item.imagemUrl || ""); }} className="p-2 hover:bg-blue-100 rounded">
                      <Edit2 size={16} className="text-blue-600" />
                    </button>
                    <button onClick={() => handleDeleteCarrossel(item.id)} className="p-2 hover:bg-red-100 rounded">
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Investimentos Tab */}
          <TabsContent value="investimentos" className="space-y-4">
            <div className="space-y-4">
              <Input
                placeholder="Título"
                value={investTitle}
                onChange={(e) => setInvestTitle(e.target.value)}
              />
              <select
                value={investType}
                onChange={(e) => setInvestType(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="lancamentos">Lançamentos</option>
                <option value="na_planta">Na Planta</option>
                <option value="aluguel">Aluguel</option>
              </select>
              <Textarea
                placeholder="Descrição"
                value={investDesc}
                onChange={(e) => setInvestDesc(e.target.value)}
              />

              <div className="border-2 border-dashed rounded-lg p-4">
                {investImagePreview ? (
                  <div className="relative">
                    <img src={investImagePreview} alt="Preview" className="max-h-32 rounded" />
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
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, setInvestImage, setInvestImagePreview)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <Button onClick={handleAddInvestimento} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                {editingId ? "Atualizar Investimento" : "Adicionar Investimento"}
              </Button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {investimentosData.map((item) => (
                <div key={item.id} className="p-3 bg-gray-100 rounded flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.titulo}</p>
                    <p className="text-xs text-gray-500">{item.tipo}</p>
                    {item.imagemUrl && <img src={item.imagemUrl} alt={item.titulo} className="max-h-12 mt-1 rounded" />}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingId(item.id); setInvestTitle(item.titulo); setInvestDesc(item.descricao || ""); setInvestType(item.tipo || "lancamentos"); setInvestImagePreview(item.imagemUrl || ""); }} className="p-2 hover:bg-blue-100 rounded">
                      <Edit2 size={16} className="text-blue-600" />
                    </button>
                    <button onClick={() => handleDeleteInvestimento(item.id)} className="p-2 hover:bg-red-100 rounded">
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Configurações Tab */}
          <TabsContent value="config" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Quem Somos</label>
                <Textarea
                  placeholder="Descrição da empresa"
                  value={quemSomos || configData?.quemSomos || ""}
                  onChange={(e) => setQuemSomos(e.target.value)}
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
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#1E40AF"
                  />
                </div>
              </div>

              <Button onClick={handleUpdateConfig} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                Salvar Configurações
              </Button>
            </div>
          </TabsContent>

          {/* Redes Sociais Tab */}
          <TabsContent value="redes" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">WhatsApp</label>
                <Input
                  placeholder="Ex: 5511999999999"
                  value={whatsapp || settingsData?.whatsapp || ""}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Facebook</label>
                <Input
                  placeholder="Ex: https://facebook.com/seu-perfil"
                  value={facebook || settingsData?.facebook || ""}
                  onChange={(e) => setFacebook(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Instagram</label>
                <Input
                  placeholder="Ex: https://instagram.com/seu-perfil"
                  value={instagram || settingsData?.instagram || ""}
                  onChange={(e) => setInstagram(e.target.value)}
                />
              </div>

              <Button onClick={handleUpdateSettings} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                Salvar Redes Sociais
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
