import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Upload, X, Edit2, Trash2 } from "lucide-react";

export default function Admin() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if not admin
  if (!user || user.role !== "admin") {
    setLocation("/");
    return null;
  }

  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Properties form state
  const [propTitle, setPropTitle] = useState("");
  const [propDesc, setPropDesc] = useState("");
  const [propLocation, setPropLocation] = useState("");
  const [propPrice, setPropPrice] = useState("");
  const [propArea, setPropArea] = useState("");
  const [propBeds, setPropBeds] = useState("");
  const [propBaths, setPropBaths] = useState("");
  const [propGarage, setPropGarage] = useState("");
  const [propPool, setPropPool] = useState(false);
  const [propGym, setPropGym] = useState(false);
  const [propBbq, setPropBbq] = useState(false);
  const [propCondom, setPropCondom] = useState("");
  const [propIptu, setPropIptu] = useState("");
  const [propImage, setPropImage] = useState<File | null>(null);
  const [propImagePreview, setPropImagePreview] = useState("");

  // Settings form state
  const [whatsapp, setWhatsapp] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");

  // Queries
  const { data: properties = [], refetch: refetchProperties } = trpc.properties.list.useQuery();
  const { data: settings, refetch: refetchSettings } = trpc.settings.get.useQuery();

  // Mutations
  const createProperty = trpc.properties.create.useMutation();
  const updateProperty = trpc.properties.update.useMutation();
  const deleteProperty = trpc.properties.delete.useMutation();
  const updateSettings = trpc.settings.update.useMutation();
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

  const handleAddProperty = async () => {
    if (!propTitle || !propLocation) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    setIsLoading(true);
    try {
      let imageUrl = propImagePreview;

      if (propImage) {
        const base64 = await fileToBase64(propImage);
        const result = await uploadFile.mutateAsync({
          bucket: "investimentos",
          filename: propImage.name,
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
        await updateProperty.mutateAsync({
          id: editingId,
          title: propTitle,
          description: propDesc,
          location: propLocation,
          price: parseInt(propPrice) || 0,
          areaMt2: parseInt(propArea) || 0,
          bedrooms: parseInt(propBeds) || 0,
          bathrooms: parseInt(propBaths) || 0,
          garage: parseInt(propGarage) || 0,
          pool: propPool ? 1 : 0,
          gym: propGym ? 1 : 0,
          bbq: propBbq ? 1 : 0,
          condominium: parseInt(propCondom) || 0,
          iptu: parseInt(propIptu) || 0,
          mainImage: imageUrl,
        });
        toast.success("Imóvel atualizado!");
        setEditingId(null);
      } else {
        await createProperty.mutateAsync({
          title: propTitle,
          description: propDesc,
          location: propLocation,
          price: parseInt(propPrice) || 0,
          areaMt2: parseInt(propArea) || 0,
          bedrooms: parseInt(propBeds) || 0,
          bathrooms: parseInt(propBaths) || 0,
          garage: parseInt(propGarage) || 0,
          pool: propPool ? 1 : 0,
          gym: propGym ? 1 : 0,
          bbq: propBbq ? 1 : 0,
          condominium: parseInt(propCondom) || 0,
          iptu: parseInt(propIptu) || 0,
          mainImage: imageUrl,
        });
        toast.success("Imóvel adicionado!");
      }

      setPropTitle("");
      setPropDesc("");
      setPropLocation("");
      setPropPrice("");
      setPropArea("");
      setPropBeds("");
      setPropBaths("");
      setPropGarage("");
      setPropPool(false);
      setPropGym(false);
      setPropBbq(false);
      setPropCondom("");
      setPropIptu("");
      setPropImage(null);
      setPropImagePreview("");
      refetchProperties();
    } catch (error) {
      toast.error("Erro ao salvar imóvel");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProperty = (prop: any) => {
    setEditingId(prop.id);
    setPropTitle(prop.title);
    setPropDesc(prop.description || "");
    setPropLocation(prop.location || "");
    setPropPrice(prop.price?.toString() || "");
    setPropArea(prop.areaMt2?.toString() || "");
    setPropBeds(prop.bedrooms?.toString() || "");
    setPropBaths(prop.bathrooms?.toString() || "");
    setPropGarage(prop.garage?.toString() || "");
    setPropPool(prop.pool === 1);
    setPropGym(prop.gym === 1);
    setPropBbq(prop.bbq === 1);
    setPropCondom(prop.condominium?.toString() || "");
    setPropIptu(prop.iptu?.toString() || "");
    setPropImagePreview(prop.mainImage || "");
  };

  const handleDeleteProperty = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este imóvel?")) return;

    setIsLoading(true);
    try {
      await deleteProperty.mutateAsync({ id });
      toast.success("Imóvel excluído!");
      refetchProperties();
    } catch (error) {
      toast.error("Erro ao excluir imóvel");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSettings = async () => {
    setIsLoading(true);
    try {
      await updateSettings.mutateAsync({
        whatsapp: whatsapp || settings?.whatsapp || "",
        facebook: facebook || settings?.facebook || "",
        instagram: instagram || settings?.instagram || "",
      });
      toast.success("Configurações atualizadas!");
      refetchSettings();
    } catch (error) {
      toast.error("Erro ao atualizar configurações");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Área de Administração</h1>

        <Tabs defaultValue="properties" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="properties">Imóveis</TabsTrigger>
            <TabsTrigger value="settings">Redes Sociais</TabsTrigger>
          </TabsList>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">
                {editingId ? "Editar Imóvel" : "Adicionar Novo Imóvel"}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Título"
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                />
                <Input
                  placeholder="Localização"
                  value={propLocation}
                  onChange={(e) => setPropLocation(e.target.value)}
                />
                <Input
                  placeholder="Preço"
                  type="number"
                  value={propPrice}
                  onChange={(e) => setPropPrice(e.target.value)}
                />
                <Input
                  placeholder="Área (m²)"
                  type="number"
                  value={propArea}
                  onChange={(e) => setPropArea(e.target.value)}
                />
                <Input
                  placeholder="Quartos"
                  type="number"
                  value={propBeds}
                  onChange={(e) => setPropBeds(e.target.value)}
                />
                <Input
                  placeholder="Banheiros"
                  type="number"
                  value={propBaths}
                  onChange={(e) => setPropBaths(e.target.value)}
                />
                <Input
                  placeholder="Garagem"
                  type="number"
                  value={propGarage}
                  onChange={(e) => setPropGarage(e.target.value)}
                />
                <Input
                  placeholder="Condomínio"
                  type="number"
                  value={propCondom}
                  onChange={(e) => setPropCondom(e.target.value)}
                />
                <Input
                  placeholder="IPTU"
                  type="number"
                  value={propIptu}
                  onChange={(e) => setPropIptu(e.target.value)}
                />
              </div>

              <div className="mt-4 space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={propPool}
                    onChange={(e) => setPropPool(e.target.checked)}
                  />
                  Piscina
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={propGym}
                    onChange={(e) => setPropGym(e.target.checked)}
                  />
                  Academia
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={propBbq}
                    onChange={(e) => setPropBbq(e.target.checked)}
                  />
                  Churrasqueira
                </label>
              </div>

              <Textarea
                placeholder="Descrição"
                value={propDesc}
                onChange={(e) => setPropDesc(e.target.value)}
                className="mt-4"
                rows={3}
              />

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Imagem Principal</label>
                <div className="border-2 border-dashed rounded-lg p-4">
                  {propImagePreview ? (
                    <div className="relative">
                      <img
                        src={propImagePreview}
                        alt="Preview"
                        className="max-h-48 rounded"
                      />
                      <button
                        onClick={() => {
                          setPropImage(null);
                          setPropImagePreview("");
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
                          handleImageChange(e, setPropImage, setPropImagePreview)
                        }
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <Button
                onClick={handleAddProperty}
                disabled={isLoading}
                className="w-full mt-4"
              >
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                {editingId ? "Atualizar Imóvel" : "Adicionar Imóvel"}
              </Button>

              {editingId && (
                <Button
                  onClick={() => {
                    setEditingId(null);
                    setPropTitle("");
                    setPropDesc("");
                    setPropLocation("");
                    setPropPrice("");
                    setPropArea("");
                    setPropBeds("");
                    setPropBaths("");
                    setPropGarage("");
                    setPropPool(false);
                    setPropGym(false);
                    setPropBbq(false);
                    setPropCondom("");
                    setPropIptu("");
                    setPropImage(null);
                    setPropImagePreview("");
                  }}
                  variant="outline"
                  className="w-full mt-2"
                >
                  Cancelar Edição
                </Button>
              )}
            </div>

            {/* Properties List */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">Imóveis Cadastrados</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {properties.map((prop) => (
                  <div key={prop.id} className="p-3 bg-gray-100 rounded flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">{prop.title}</p>
                      <p className="text-sm text-gray-600">{prop.location}</p>
                      <p className="text-sm text-green-600 font-bold">R$ {prop.price?.toLocaleString("pt-BR")}</p>
                      {prop.mainImage && (
                        <img src={prop.mainImage} alt={prop.title} className="max-h-16 mt-2 rounded" />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProperty(prop)}
                        className="p-2 hover:bg-blue-100 rounded"
                      >
                        <Edit2 size={16} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(prop.id)}
                        className="p-2 hover:bg-red-100 rounded"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Redes Sociais</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">WhatsApp</label>
                  <Input
                    placeholder="Ex: 5511999999999"
                    value={whatsapp || settings?.whatsapp || ""}
                    onChange={(e) => setWhatsapp(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Facebook</label>
                  <Input
                    placeholder="Ex: https://facebook.com/seu-perfil"
                    value={facebook || settings?.facebook || ""}
                    onChange={(e) => setFacebook(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Instagram</label>
                  <Input
                    placeholder="Ex: https://instagram.com/seu-perfil"
                    value={instagram || settings?.instagram || ""}
                    onChange={(e) => setInstagram(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleUpdateSettings}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                  Salvar Configurações
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
