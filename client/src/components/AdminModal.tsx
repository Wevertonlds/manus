import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Trash2, Edit2, Plus, Upload } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const [activeTab, setActiveTab] = useState("compra");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    imagemUrl: "",
    endereco: "",
    area_m2: 0,
    banheiros: 0,
    quartos: 0,
    suites: 0,
    garagem: 0,
    piscina: false,
    academia: false,
    churrasqueira: false,
    condominio: 0,
    iptu: 0,
    preco: 0,
  });

  const { data: investimentos } = trpc.investimentos.list.useQuery();
  const createMutation = trpc.investimentos.create.useMutation();
  const updateMutation = trpc.investimentos.update.useMutation();
  const deleteMutation = trpc.investimentos.delete.useMutation();
  const uploadMutation = trpc.storage.uploadFile.useMutation();

  const typeMap = {
    compra: "LANÇAMENTOS",
    "compra-planta": "NA_PLANTA",
    aluguel: "ALUGUEL",
  };

  const currentType = typeMap[activeTab as keyof typeof typeMap];
  const filteredInvestimentos = investimentos?.filter((inv) => inv.tipo === currentType) || [];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        const result = await uploadMutation.mutateAsync({
          fileName: file.name,
          fileData: base64,
          bucket: "investimentos",
        });
        setFormData({ ...formData, imagemUrl: result.url });
        toast.success("Imagem enviada com sucesso!");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Erro ao fazer upload da imagem");
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
          tipo: currentType,
        });
        toast.success("Investimento atualizado!");
      } else {
        await createMutation.mutateAsync({
          ...formData,
          tipo: currentType,
        });
        toast.success("Investimento criado!");
      }
      setFormData({
        titulo: "",
        descricao: "",
        imagemUrl: "",
        endereco: "",
        area_m2: 0,
        banheiros: 0,
        quartos: 0,
        suites: 0,
        garagem: 0,
        piscina: false,
        academia: false,
        churrasqueira: false,
        condominio: 0,
        iptu: 0,
        preco: 0,
      });
      setEditingId(null);
    } catch (error) {
      toast.error("Erro ao salvar investimento");
    }
  };

  const handleEdit = (inv: any) => {
    setFormData(inv);
    setEditingId(inv.id);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este investimento?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Investimento deletado!");
      } catch (error) {
        toast.error("Erro ao deletar investimento");
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      titulo: "",
      descricao: "",
      imagemUrl: "",
      endereco: "",
      area_m2: 0,
      banheiros: 0,
      quartos: 0,
      suites: 0,
      garagem: 0,
      piscina: false,
      academia: false,
      churrasqueira: false,
      condominio: 0,
      iptu: 0,
      preco: 0,
    });
    setEditingId(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Área de Gestão - Investimentos</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compra">Compra</TabsTrigger>
            <TabsTrigger value="compra-planta">Compra na Planta</TabsTrigger>
            <TabsTrigger value="aluguel">Aluguel</TabsTrigger>
          </TabsList>

          {/* Compra Tab */}
          <TabsContent value="compra" className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Investimentos - Compra</h3>

              {/* Form */}
              <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Título"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  />
                  <Input
                    placeholder="Preço"
                    type="number"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) })}
                  />
                </div>

                <Input
                  placeholder="Descrição"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                />

                <Input
                  placeholder="Endereço"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                />

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    placeholder="Área (m²)"
                    type="number"
                    value={formData.area_m2}
                    onChange={(e) => setFormData({ ...formData, area_m2: parseFloat(e.target.value) })}
                  />
                  <Input
                    placeholder="Quartos"
                    type="number"
                    value={formData.quartos}
                    onChange={(e) => setFormData({ ...formData, quartos: parseInt(e.target.value) })}
                  />
                  <Input
                    placeholder="Banheiros"
                    type="number"
                    value={formData.banheiros}
                    onChange={(e) => setFormData({ ...formData, banheiros: parseInt(e.target.value) })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    placeholder="Suítes"
                    type="number"
                    value={formData.suites}
                    onChange={(e) => setFormData({ ...formData, suites: parseInt(e.target.value) })}
                  />
                  <Input
                    placeholder="Garagem"
                    type="number"
                    value={formData.garagem}
                    onChange={(e) => setFormData({ ...formData, garagem: parseInt(e.target.value) })}
                  />
                  <Input
                    placeholder="Condomínio"
                    type="number"
                    value={formData.condominio}
                    onChange={(e) => setFormData({ ...formData, condominio: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="IPTU"
                    type="number"
                    value={formData.iptu}
                    onChange={(e) => setFormData({ ...formData, iptu: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="flex gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.piscina}
                      onChange={(e) => setFormData({ ...formData, piscina: e.target.checked })}
                    />
                    Piscina
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.academia}
                      onChange={(e) => setFormData({ ...formData, academia: e.target.checked })}
                    />
                    Academia
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.churrasqueira}
                      onChange={(e) => setFormData({ ...formData, churrasqueira: e.target.checked })}
                    />
                    Churrasqueira
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <Upload size={18} />
                    <span>Enviar Imagem</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploadMutation.isPending}
                    />
                  </label>
                  {formData.imagemUrl && (
                    <img src={formData.imagemUrl} alt="Preview" className="w-16 h-16 rounded object-cover" />
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex-1">
                    {editingId ? "Atualizar" : "Criar"}
                  </Button>
                  {editingId && (
                    <Button variant="outline" onClick={handleCancel} className="flex-1">
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="space-y-2">
                <h4 className="font-semibold">Investimentos Cadastrados</h4>
                {filteredInvestimentos.length > 0 ? (
                  <div className="space-y-2">
                    {filteredInvestimentos.map((inv) => (
                      <div key={inv.id} className="flex items-center gap-2 p-3 bg-gray-100 rounded">
                        {inv.imagemUrl && (
                          <img src={inv.imagemUrl} alt={inv.titulo} className="w-12 h-12 rounded object-cover" />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold">{inv.titulo}</p>
                          <p className="text-sm text-gray-600">{inv.endereco}</p>
                          <p className="text-sm font-bold text-blue-600">R$ {inv.preco?.toLocaleString("pt-BR")}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(inv)}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(inv.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Nenhum investimento cadastrado</p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Compra na Planta Tab */}
          <TabsContent value="compra-planta" className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Investimentos - Compra na Planta</h3>

              {/* Form */}
              <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Título"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  />
                  <Input
                    placeholder="Preço"
                    type="number"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) })}
                  />
                </div>

                <Input
                  placeholder="Descrição"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                />

                <Input
                  placeholder="Endereço"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                />

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    placeholder="Área (m²)"
                    type="number"
                    value={formData.area_m2}
                    onChange={(e) => setFormData({ ...formData, area_m2: parseFloat(e.target.value) })}
                  />
                  <Input
                    placeholder="Quartos"
                    type="number"
                    value={formData.quartos}
                    onChange={(e) => setFormData({ ...formData, quartos: parseInt(e.target.value) })}
                  />
                  <Input
                    placeholder="Banheiros"
                    type="number"
                    value={formData.banheiros}
                    onChange={(e) => setFormData({ ...formData, banheiros: parseInt(e.target.value) })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    placeholder="Suítes"
                    type="number"
                    value={formData.suites}
                    onChange={(e) => setFormData({ ...formData, suites: parseInt(e.target.value) })}
                  />
                  <Input
                    placeholder="Garagem"
                    type="number"
                    value={formData.garagem}
                    onChange={(e) => setFormData({ ...formData, garagem: parseInt(e.target.value) })}
                  />
                  <Input
                    placeholder="Condomínio"
                    type="number"
                    value={formData.condominio}
                    onChange={(e) => setFormData({ ...formData, condominio: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="IPTU"
                    type="number"
                    value={formData.iptu}
                    onChange={(e) => setFormData({ ...formData, iptu: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="flex gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.piscina}
                      onChange={(e) => setFormData({ ...formData, piscina: e.target.checked })}
                    />
                    Piscina
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.academia}
                      onChange={(e) => setFormData({ ...formData, academia: e.target.checked })}
                    />
                    Academia
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.churrasqueira}
                      onChange={(e) => setFormData({ ...formData, churrasqueira: e.target.checked })}
                    />
                    Churrasqueira
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <Upload size={18} />
                    <span>Enviar Imagem</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploadMutation.isPending}
                    />
                  </label>
                  {formData.imagemUrl && (
                    <img src={formData.imagemUrl} alt="Preview" className="w-16 h-16 rounded object-cover" />
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex-1">
                    {editingId ? "Atualizar" : "Criar"}
                  </Button>
                  {editingId && (
                    <Button variant="outline" onClick={handleCancel} className="flex-1">
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="space-y-2">
                <h4 className="font-semibold">Investimentos Cadastrados</h4>
                {filteredInvestimentos.length > 0 ? (
                  <div className="space-y-2">
                    {filteredInvestimentos.map((inv) => (
                      <div key={inv.id} className="flex items-center gap-2 p-3 bg-gray-100 rounded">
                        {inv.imagemUrl && (
                          <img src={inv.imagemUrl} alt={inv.titulo} className="w-12 h-12 rounded object-cover" />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold">{inv.titulo}</p>
                          <p className="text-sm text-gray-600">{inv.endereco}</p>
                          <p className="text-sm font-bold text-blue-600">R$ {inv.preco?.toLocaleString("pt-BR")}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(inv)}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(inv.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Nenhum investimento cadastrado</p>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Aluguel Tab */}
          <TabsContent value="aluguel" className="space-y-4">
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Investimentos - Aluguel</h3>

              {/* Form */}
              <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Título"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  />
                  <Input
                    placeholder="Preço"
                    type="number"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) })}
                  />
                </div>

                <Input
                  placeholder="Descrição"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                />

                <Input
                  placeholder="Endereço"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                />

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    placeholder="Área (m²)"
                    type="number"
                    value={formData.area_m2}
                    onChange={(e) => setFormData({ ...formData, area_m2: parseFloat(e.target.value) })}
                  />
                  <Input
                    placeholder="Quartos"
                    type="number"
                    value={formData.quartos}
                    onChange={(e) => setFormData({ ...formData, quartos: parseInt(e.target.value) })}
                  />
                  <Input
                    placeholder="Banheiros"
                    type="number"
                    value={formData.banheiros}
                    onChange={(e) => setFormData({ ...formData, banheiros: parseInt(e.target.value) })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    placeholder="Suítes"
                    type="number"
                    value={formData.suites}
                    onChange={(e) => setFormData({ ...formData, suites: parseInt(e.target.value) })}
                  />
                  <Input
                    placeholder="Garagem"
                    type="number"
                    value={formData.garagem}
                    onChange={(e) => setFormData({ ...formData, garagem: parseInt(e.target.value) })}
                  />
                  <Input
                    placeholder="Condomínio"
                    type="number"
                    value={formData.condominio}
                    onChange={(e) => setFormData({ ...formData, condominio: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="IPTU"
                    type="number"
                    value={formData.iptu}
                    onChange={(e) => setFormData({ ...formData, iptu: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="flex gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.piscina}
                      onChange={(e) => setFormData({ ...formData, piscina: e.target.checked })}
                    />
                    Piscina
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.academia}
                      onChange={(e) => setFormData({ ...formData, academia: e.target.checked })}
                    />
                    Academia
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.churrasqueira}
                      onChange={(e) => setFormData({ ...formData, churrasqueira: e.target.checked })}
                    />
                    Churrasqueira
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <Upload size={18} />
                    <span>Enviar Imagem</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploadMutation.isPending}
                    />
                  </label>
                  {formData.imagemUrl && (
                    <img src={formData.imagemUrl} alt="Preview" className="w-16 h-16 rounded object-cover" />
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex-1">
                    {editingId ? "Atualizar" : "Criar"}
                  </Button>
                  {editingId && (
                    <Button variant="outline" onClick={handleCancel} className="flex-1">
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>

              {/* List */}
              <div className="space-y-2">
                <h4 className="font-semibold">Investimentos Cadastrados</h4>
                {filteredInvestimentos.length > 0 ? (
                  <div className="space-y-2">
                    {filteredInvestimentos.map((inv) => (
                      <div key={inv.id} className="flex items-center gap-2 p-3 bg-gray-100 rounded">
                        {inv.imagemUrl && (
                          <img src={inv.imagemUrl} alt={inv.titulo} className="w-12 h-12 rounded object-cover" />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold">{inv.titulo}</p>
                          <p className="text-sm text-gray-600">{inv.endereco}</p>
                          <p className="text-sm font-bold text-blue-600">R$ {inv.preco?.toLocaleString("pt-BR")}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(inv)}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(inv.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Nenhum investimento cadastrado</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
