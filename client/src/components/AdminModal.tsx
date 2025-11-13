import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { uploadFile } from "@/lib/supabase";
import { Loader2, Upload, X } from "lucide-react";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const [activeTab, setActiveTab] = useState("carrossel");
  const [isLoading, setIsLoading] = useState(false);

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
  const [siteTitle, setSiteTitle] = useState("");
  const [quemSomos, setQuemSomos] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#1E40AF");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState("");

  // Queries
  const { data: configData } = trpc.config.get.useQuery();
  const { data: carrosselData = [] } = trpc.carrossel.list.useQuery();
  const { data: investimentosData = [] } = trpc.investimentos.list.useQuery();

  // Mutations
  const createCarrossel = trpc.carrossel.create.useMutation();
  const createInvestimento = trpc.investimentos.create.useMutation();
  const updateConfig = trpc.config.update.useMutation();

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

  const handleAddCarrossel = async () => {
    if (!carrosselTitle || !carrosselDesc) {
      toast.error("Preencha todos os campos");
      return;
    }

    setIsLoading(true);
    try {
      let imageUrl = carrosselImagePreview;

      if (carrosselImage) {
        const result = await uploadFile(
          "carrossel",
          `${Date.now()}-${carrosselImage.name}`,
          carrosselImage
        );
        if (!result) {
          toast.error("Erro ao fazer upload da imagem");
          setIsLoading(false);
          return;
        }
        imageUrl = result.url;
      }

      await createCarrossel.mutateAsync({
        titulo: carrosselTitle,
        descricao: carrosselDesc,
        imagemUrl: imageUrl,
      });

      toast.success("Slide adicionado com sucesso!");
      setCarrosselTitle("");
      setCarrosselDesc("");
      setCarrosselImage(null);
      setCarrosselImagePreview("");
    } catch (error) {
      toast.error("Erro ao adicionar slide");
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
        const result = await uploadFile(
          "investimentos",
          `${Date.now()}-${investImage.name}`,
          investImage
        );
        if (!result) {
          toast.error("Erro ao fazer upload da imagem");
          setIsLoading(false);
          return;
        }
        imageUrl = result.url;
      }

      await createInvestimento.mutateAsync({
        tipo: investType as "lancamentos" | "na_planta" | "aluguel",
        titulo: investTitle,
        descricao: investDesc,
        imagemUrl: imageUrl,
      });

      toast.success("Investimento adicionado com sucesso!");
      setInvestTitle("");
      setInvestDesc("");
      setInvestImage(null);
      setInvestImagePreview("");
    } catch (error) {
      toast.error("Erro ao adicionar investimento");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateConfig = async () => {
    setIsLoading(true);
    try {
      let logoUrl = logoPreview;
      let bannerUrl = bannerPreview;

      if (logoFile) {
        const result = await uploadFile(
          "config",
          `logo-${Date.now()}.${logoFile.name.split(".").pop()}`,
          logoFile
        );
        if (result) {
          logoUrl = result.url;
        }
      }

      if (bannerFile) {
        const result = await uploadFile(
          "config",
          `banner-${Date.now()}.${bannerFile.name.split(".").pop()}`,
          bannerFile
        );
        if (result) {
          bannerUrl = result.url;
        }
      }

      await updateConfig.mutateAsync({
        quemSomos: quemSomos || configData?.quemSomos || "",
        corPrimaria: primaryColor,
        tamanho: 16,
        ...(logoUrl && { logo: logoUrl }),
        ...(bannerUrl && { banner: bannerUrl }),
      } as any);

      toast.success("Configurações atualizadas com sucesso!");
      setLogoFile(null);
      setBannerFile(null);
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
                Adicionar Slide
              </Button>

              <div className="mt-6">
                <h3 className="font-semibold mb-3">Slides Atuais</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {carrosselData.map((slide) => (
                    <div key={slide.id} className="p-3 bg-gray-100 rounded">
                      <p className="font-medium">{slide.titulo}</p>
                      <p className="text-sm text-gray-600">{slide.descricao}</p>
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
                Adicionar Investimento
              </Button>

              <div className="mt-6">
                <h3 className="font-semibold mb-3">Investimentos Atuais</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {investimentosData.map((invest) => (
                    <div key={invest.id} className="p-3 bg-gray-100 rounded">
                      <p className="font-medium">{invest.titulo}</p>
                      <p className="text-xs text-blue-600">{invest.tipo.toUpperCase()}</p>
                      <p className="text-sm text-gray-600">{invest.descricao}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Configurações Tab */}
          <TabsContent value="config" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Logo</label>
                <div className="border-2 border-dashed rounded-lg p-4">
                  {logoPreview || (configData?.logo || "") ? (
                    <div className="relative">
                      <img
                        src={logoPreview || configData?.logo || ""}
                        alt="Logo"
                        className="max-h-32 rounded"
                      />
                      {logoFile && (
                        <button
                          onClick={() => {
                            setLogoFile(null);
                            setLogoPreview("");
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload size={24} />
                      <span className="text-sm">Clique para fazer upload do logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, setLogoFile, setLogoPreview)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Banner</label>
                <div className="border-2 border-dashed rounded-lg p-4">
                  {bannerPreview || (configData?.banner || "") ? (
                    <div className="relative">
                      <img
                        src={bannerPreview || configData?.banner || ""}
                        alt="Banner"
                        className="max-h-32 rounded w-full object-cover"
                      />
                      {bannerFile && (
                        <button
                          onClick={() => {
                            setBannerFile(null);
                            setBannerPreview("");
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload size={24} />
                      <span className="text-sm">Clique para fazer upload do banner</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, setBannerFile, setBannerPreview)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cor Primária</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#1E40AF"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Quem Somos</label>
                <Textarea
                  value={quemSomos || configData?.quemSomos || ""}
                  onChange={(e) => setQuemSomos(e.target.value)}
                  placeholder="Descrição da empresa"
                  rows={4}
                />
              </div>

              <Button
                onClick={handleUpdateConfig}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                Salvar Configurações
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
