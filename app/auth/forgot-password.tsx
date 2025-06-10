import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, ArrowLeft } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const { resetPassword } = useAuth();
  const router = useRouter();

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError('Email é obrigatório');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Digite um endereço de email válido');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      const success = await resetPassword(email.trim());
      if (success) {
        setIsSuccess(true);
      } else {
        setError('Falha ao enviar email de redefinição. Tente novamente.');
      }
    } catch (error) {
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <LinearGradient
        colors={['#000000', '#0a0a0a', '#000000']}
        style={styles.container}
      >
        <View style={styles.successContainer}>
          <View style={styles.successContent}>
            <View style={styles.checkIconContainer}>
              <Text style={styles.checkIcon}>✓</Text>
            </View>
            <Text style={styles.successTitle}>Verifique Seu Email</Text>
            <Text style={styles.successMessage}>
              Enviamos um link de redefinição de senha para{'\n'}
              <Text style={styles.emailText}>{email}</Text>
            </Text>
            <Text style={styles.instructionText}>
              Clique no link no email para redefinir sua senha. Se não encontrar, verifique sua pasta de spam.
            </Text>
            
            <Link href="/auth/login" asChild>
              <TouchableOpacity style={styles.backButton}>
                <LinearGradient
                  colors={['#00FF88', '#00CC66']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.backButtonText}>Voltar ao Login</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#000000', '#0a0a0a', '#000000']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <TouchableOpacity 
            style={styles.backButtonTop}
            onPress={() => router.back()}
          >
            <ArrowLeft color="#00FF88" size={24} />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Text style={styles.logo}>FlixGlow</Text>
            <Text style={styles.tagline}>Redefinir Sua Senha</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Esqueceu a Senha?</Text>
            <Text style={styles.subtitle}>
              Digite seu endereço de email e enviaremos um link para redefinir sua senha.
            </Text>

            <View style={styles.inputContainer}>
              <View style={[styles.inputWrapper, error && styles.inputError]}>
                <Mail color="#00FF88" size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Endereço de email"
                  placeholderTextColor="#666"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (error) setError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>

            <TouchableOpacity
              style={[styles.resetButton, isLoading && styles.resetButtonDisabled]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#00FF88', '#00CC66']}
                style={styles.buttonGradient}
              >
                <Text style={styles.resetButtonText}>
                  {isLoading ? 'Enviando...' : 'Enviar Link de Redefinição'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Lembrou da senha? </Text>
              <Link href="/auth/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.loginLink}>Entrar</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  backButtonTop: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 40,
  },
  logo: {
    fontSize: 42,
    fontFamily: 'Inter-Bold',
    color: '#00FF88',
    textShadowColor: '#00FF88',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  tagline: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.1)',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 8,
    paddingHorizontal: 16,
    height: 56,
  },
  inputError: {
    borderColor: '#FF4444',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    height: '100%',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FF4444',
    marginLeft: 4,
  },
  resetButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 30,
  },
  resetButtonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#888',
  },
  loginLink: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#00FF88',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 40,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.1)',
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  checkIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#00FF88',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkIcon: {
    fontSize: 40,
    fontFamily: 'Inter-Bold',
    color: '#000000',
  },
  successTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  emailText: {
    color: '#00FF88',
    fontFamily: 'Inter-SemiBold',
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  backButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  backButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
  },
});