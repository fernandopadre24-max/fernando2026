
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Banknote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { login, signup } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLoginMode) {
        login(username, password);
        router.push('/');
      } else {
        await signup(username, password, confirmPassword);
        toast({
            title: "Cadastro realizado com sucesso!",
            description: "Você foi logado automaticamente.",
        });
        router.push('/');
      }
    } catch (error: any) {
        toast({
            title: `Erro de ${isLoginMode ? 'Login' : 'Cadastro'}`,
            description: error.message,
            variant: "destructive",
        })
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
               <div className="p-3 bg-primary/10 rounded-lg">
                    <Banknote className="h-8 w-8 text-primary" />
                </div>
            </div>
          <CardTitle className="text-2xl">{isLoginMode ? 'Bem-vindo de volta!' : 'Crie sua Conta'}</CardTitle>
          <CardDescription>
            {isLoginMode ? 'Faça login para acessar seu painel financeiro.' : 'Preencha os dados para se cadastrar.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {!isLoginMode && (
                 <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
            )}
            <Button type="submit" className="w-full">
              {isLoginMode ? 'Entrar' : 'Cadastrar'}
            </Button>
            <div className="text-center text-sm pt-4">
                 <Button variant="link" type="button" onClick={() => setIsLoginMode(!isLoginMode)}>
                    {isLoginMode ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
                </Button>
            </div>
            {isLoginMode && (
                 <div className="text-center text-xs text-muted-foreground pt-4">
                    <p>Usuários de teste:</p>
                    <p>1. user: <strong>produtor1</strong>, pass: <strong>senha1</strong></p>
                    <p>2. user: <strong>produtor2</strong>, pass: <strong>senha2</strong></p>
                </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
