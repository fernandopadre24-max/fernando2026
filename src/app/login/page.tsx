
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Banknote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const loadUsernames = (): string[] => {
    if (typeof window === 'undefined') {
        return [];
    }
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        try {
            const usersMap: Map<string, any> = new Map(JSON.parse(storedUsers));
            return Array.from(usersMap.keys());
        } catch (e) {
            return [];
        }
    }
    // If no users are stored, the auth-context will create the admin user.
    // So we can assume 'admin' will exist on first load.
    return ['admin']; 
}


export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userList, setUserList] = useState<string[]>([]);
  const { login, signup } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Load users on the client side to avoid hydration errors
    setUserList(loadUsernames());
  }, []);

  const handleModeChange = () => {
    setIsLoginMode(!isLoginMode);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    // Refresh user list in case a new user was just added or it's the first time toggling.
    setUserList(loadUsernames());
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLoginMode) {
        await login(username, password);
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
    <div className="flex min-h-screen items-center justify-center bg-login-gradient p-4">
      <Card className="w-full max-w-sm bg-background/80 backdrop-blur-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
               <div className="p-3 bg-primary/20 rounded-lg border border-primary/30">
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
              {isLoginMode && userList.length > 0 ? (
                <Select value={username} onValueChange={setUsername}>
                    <SelectTrigger id="username-select">
                        <SelectValue placeholder="Selecione um usuário" />
                    </SelectTrigger>
                    <SelectContent>
                        {userList.map(user => (
                            <SelectItem key={user} value={user}>{user}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              ) : (
                <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder={isLoginMode ? '' : 'Crie um nome de usuário'}
                />
              )}
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
            <Button type="submit" className="w-full font-bold">
              {isLoginMode ? 'Entrar' : 'Cadastrar'}
            </Button>
            <div className="text-center text-sm pt-4">
                 <Button variant="link" type="button" onClick={handleModeChange}>
                    {isLoginMode ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
