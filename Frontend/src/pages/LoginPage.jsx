import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input, Label } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) navigate('/seleccionar-usuario');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#1c3a63_0%,#2c5486_45%,#1a2b52_100%)] px-4">
      <Card className="w-full max-w-sm animate-slide-up p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <img src="/logo-recover.svg" alt="RECOVER" className="h-14 w-14 rounded-xl shadow-soft" />
          <div>
            <h1 className="text-xl font-semibold">RECOVER</h1>
            <p className="text-sm text-muted-foreground">Centro de Rehabilitacion y Readaptacion Fisica</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="username">Usuario</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-9"
                autoFocus
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Contrasena</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
