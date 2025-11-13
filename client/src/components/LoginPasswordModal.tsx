import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Lock, Eye, EyeOff } from "lucide-react";

interface LoginPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function LoginPasswordModal({ isOpen, onClose, onLoginSuccess }: LoginPasswordModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Senha padrão (você pode mudar isso)
  const ADMIN_PASSWORD = "lobianco123";

  const handleLogin = () => {
    setIsLoading(true);

    // Simula delay de validação
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        toast.success("Login realizado com sucesso!");
        setPassword("");
        onLoginSuccess();
        onClose();
      } else {
        toast.error("Senha incorreta!");
        setPassword("");
      }
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock size={20} />
            Acesso à Área de Gestão
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Digite a senha para acessar a área de gestão do site.
          </p>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Digite a senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="pr-10"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleLogin}
              disabled={isLoading || !password}
              className="flex-1"
            >
              {isLoading ? "Verificando..." : "Entrar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
