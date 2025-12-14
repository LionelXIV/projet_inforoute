import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, clearError } from '../store/slices/authSlice';
import { LogIn, Database, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <>
      <Navbar />
      <main className="container" style={{ marginTop: '2rem', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="row w-100" style={{ width: '100%' }}>
          <div className="col-md-6 offset-md-3">
            <div className="card" style={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: '0',
              wordWrap: 'break-word',
              backgroundColor: '#fff',
              backgroundClip: 'border-box',
              border: '1px solid rgba(0,0,0,0.125)',
              borderRadius: '0.25rem',
              boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,0.075)'
            }}>
              <div className="card-header text-center" style={{
                padding: '1rem 1.25rem',
                marginBottom: '0',
                backgroundColor: '#0d6efd',
                color: 'white',
                borderBottom: '1px solid rgba(0,0,0,0.125)',
                borderRadius: 'calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0'
              }}>
                <div className="d-flex justify-content-center align-items-center mb-2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <Database size={40} style={{ marginRight: '0.5rem' }} />
                  <h3 className="mb-0" style={{ marginBottom: 0, fontSize: '1.75rem', fontWeight: '500' }}>DataQC</h3>
                </div>
                <p className="mb-0" style={{ marginBottom: 0, opacity: 0.9 }}>Connexion à la plateforme</p>
              </div>
              <div className="card-body" style={{ flex: '1 1 auto', padding: '1.5rem' }}>
                <form onSubmit={handleSubmit}>
                  {error && (
                    <Alert variant="destructive" className="mb-4" style={{
                      padding: '0.75rem 1.25rem',
                      marginBottom: '1rem',
                      border: '1px solid #f5c6cb',
                      borderRadius: '0.25rem',
                      backgroundColor: '#f8d7da',
                      color: '#721c24'
                    }}>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="mb-3" style={{ marginBottom: '1rem' }}>
                    <Label htmlFor="username" style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '500',
                      color: '#212529'
                    }}>
                      Nom d'utilisateur
                    </Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Entrez votre nom d'utilisateur"
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '0.375rem 0.75rem',
                        fontSize: '1rem',
                        fontWeight: '400',
                        lineHeight: '1.5',
                        color: '#212529',
                        backgroundColor: '#fff',
                        border: '1px solid #ced4da',
                        borderRadius: '0.25rem',
                        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                      }}
                    />
                  </div>

                  <div className="mb-4" style={{ marginBottom: '1.5rem' }}>
                    <Label htmlFor="password" style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '500',
                      color: '#212529'
                    }}>
                      Mot de passe
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Entrez votre mot de passe"
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '0.375rem 0.75rem',
                        fontSize: '1rem',
                        fontWeight: '400',
                        lineHeight: '1.5',
                        color: '#212529',
                        backgroundColor: '#fff',
                        border: '1px solid #ced4da',
                        borderRadius: '0.25rem',
                        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                      }}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-100"
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '0.5rem 1rem',
                      fontSize: '1rem',
                      fontWeight: '400',
                      lineHeight: '1.5',
                      color: '#fff',
                      backgroundColor: loading ? '#6c757d' : '#0d6efd',
                      border: '1px solid transparent',
                      borderRadius: '0.25rem',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.15s ease-in-out, border-color 0.15s ease-in-out'
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" style={{ display: 'inline-block', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                        Connexion en cours...
                      </>
                    ) : (
                      <>
                        <LogIn size={18} style={{ display: 'inline-block', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                        Se connecter
                      </>
                    )}
                  </Button>
                </form>
              </div>
              <div className="card-footer text-center text-muted" style={{
                padding: '0.75rem 1.25rem',
                backgroundColor: 'rgba(0,0,0,0.03)',
                borderTop: '1px solid rgba(0,0,0,0.125)',
                borderRadius: '0 0 calc(0.25rem - 1px) calc(0.25rem - 1px)',
                fontSize: '0.875rem',
                color: '#6c757d'
              }}>
                  Plateforme de données ouvertes du Québec
                </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Login;
