import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { Crown, Check, Sparkles, Zap, Shield } from 'lucide-react-native';

interface Plan {
  id: 'basic' | 'standard' | 'premium';
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
  color: string[];
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Básico',
    price: 19.99,
    color: ['#333333', '#1a1a1a'],
    features: [
      'Streaming em qualidade HD',
      '1 dispositivo por vez',
      'Seleção limitada',
      'Suporte básico'
    ],
  },
  {
    id: 'standard',
    name: 'Padrão',
    price: 29.99,
    popular: true,
    color: ['#00FF88', '#00CC66'],
    features: [
      'Streaming em Full HD',
      '2 dispositivos simultâneos',
      'Biblioteca completa',
      'Suporte prioritário',
      'Downloads offline'
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 39.99,
    color: ['#FFD700', '#FFA500'],
    features: [
      'Streaming em 4K Ultra HD',
      '4 dispositivos simultâneos',
      'Acesso antecipado exclusivo',
      'Suporte VIP 24/7',
      'Downloads ilimitados',
      'Experiência sem anúncios'
    ],
  },
];

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'standard' | 'premium'>('standard');
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateProfile } = useAuth();

  const handleSubscribe = async (planId: 'basic' | 'standard' | 'premium') => {
    setIsLoading(true);
    
    try {
      // Simular processo de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Atualizar plano do usuário
      updateProfile({ plan: planId });
      
      Alert.alert(
        'Sucesso!',
        `Você se inscreveu com sucesso no FlixGlow ${plans.find(p => p.id === planId)?.name}!`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Falha na assinatura. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const PlanIcon = ({ planId }: { planId: string }) => {
    switch (planId) {
      case 'basic':
        return <Shield size={32} color="#FFFFFF" />;
      case 'standard':
        return <Zap size={32} color="#000000" />;
      case 'premium':
        return <Crown size={32} color="#000000" />;
      default:
        return <Sparkles size={32} color="#FFFFFF" />;
    }
  };

  return (
    <LinearGradient
      colors={['#000000', '#0a0a0a']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Crown size={40} color="#00FF88" />
              <Text style={styles.title}>Escolha Seu Plano</Text>
            </View>
            <Text style={styles.subtitle}>
              Desbloqueie a experiência completa do FlixGlow com streaming ilimitado
            </Text>
            
            {user && (
              <View style={styles.currentPlanBadge}>
                <Text style={styles.currentPlanText}>
                  Plano Atual: {plans.find(p => p.id === user.plan)?.name || 'Básico'}
                </Text>
              </View>
            )}
          </View>

          {/* Plans */}
          <View style={styles.plansContainer}>
            {plans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.selectedPlanCard,
                  plan.popular && styles.popularPlanCard,
                ]}
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.8}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Sparkles size={16} color="#000000" />
                    <Text style={styles.popularBadgeText}>Mais Popular</Text>
                  </View>
                )}

                <LinearGradient
                  colors={plan.popular ? plan.color : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                  style={styles.planGradient}
                >
                  <View style={styles.planHeader}>
                    <View style={styles.planIconContainer}>
                      <PlanIcon planId={plan.id} />
                    </View>
                    
                    <View style={styles.planTitleContainer}>
                      <Text style={[
                        styles.planName,
                        plan.popular && styles.popularPlanName
                      ]}>
                        {plan.name}
                      </Text>
                      <View style={styles.priceContainer}>
                        <Text style={[
                          styles.planPrice,
                          plan.popular && styles.popularPlanPrice
                        ]}>
                          R${plan.price}
                        </Text>
                        <Text style={[
                          styles.planPriceSubtext,
                          plan.popular && styles.popularPlanPriceSubtext
                        ]}>
                          /mês
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.planFeatures}>
                    {plan.features.map((feature, index) => (
                      <View key={index} style={styles.featureRow}>
                        <Check 
                          size={16} 
                          color={plan.popular ? '#000000' : '#00FF88'} 
                        />
                        <Text style={[
                          styles.featureText,
                          plan.popular && styles.popularFeatureText
                        ]}>
                          {feature}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {user?.plan !== plan.id && (
                    <TouchableOpacity
                      style={[
                        styles.subscribeButton,
                        plan.popular && styles.popularSubscribeButton
                      ]}
                      onPress={() => handleSubscribe(plan.id)}
                      disabled={isLoading}
                    >
                      <Text style={[
                        styles.subscribeButtonText,
                        plan.popular && styles.popularSubscribeButtonText
                      ]}>
                        {isLoading ? 'Processando...' : 
                         user?.plan ? 'Fazer Upgrade' : 'Assinar'}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {user?.plan === plan.id && (
                    <View style={styles.currentPlanIndicator}>
                      <Check size={20} color="#00FF88" />
                      <Text style={styles.currentPlanIndicatorText}>
                        Plano Atual
                      </Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Benefits */}
          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>Por que Escolher o FlixGlow?</Text>
            
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Shield size={24} color="#00FF88" />
                </View>
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>Sem Anúncios, Nunca</Text>
                  <Text style={styles.benefitDescription}>
                    Desfrute de streaming ininterrupto sem qualquer propaganda
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Zap size={24} color="#00FF88" />
                </View>
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>Streaming Ultra-Rápido</Text>
                  <Text style={styles.benefitDescription}>
                    Experimente carregamento ultrarrápido e reprodução sem travamentos
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <Crown size={24} color="#00FF88" />
                </View>
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>Conteúdo Exclusivo</Text>
                  <Text style={styles.benefitDescription}>
                    Acesso a conteúdo premium e lançamentos antecipados
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  currentPlanBadge: {
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  currentPlanText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#00FF88',
  },
  plansContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  planCard: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  selectedPlanCard: {
    borderColor: '#00FF88',
  },
  popularPlanCard: {
    borderColor: '#00FF88',
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    backgroundColor: '#00FF88',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    zIndex: 1,
  },
  popularBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    marginLeft: 4,
  },
  planGradient: {
    padding: 24,
    paddingTop: 30,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  planIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  planTitleContainer: {
    flex: 1,
  },
  planName: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  popularPlanName: {
    color: '#000000',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#00FF88',
  },
  popularPlanPrice: {
    color: '#000000',
  },
  planPriceSubtext: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#888',
    marginLeft: 4,
  },
  popularPlanPriceSubtext: {
    color: 'rgba(0, 0, 0, 0.7)',
  },
  planFeatures: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginLeft: 12,
  },
  popularFeatureText: {
    color: '#000000',
  },
  subscribeButton: {
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00FF88',
    paddingVertical: 16,
    alignItems: 'center',
  },
  popularSubscribeButton: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  subscribeButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#00FF88',
  },
  popularSubscribeButtonText: {
    color: '#FFFFFF',
  },
  currentPlanIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderRadius: 12,
  },
  currentPlanIndicatorText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#00FF88',
    marginLeft: 8,
  },
  benefitsContainer: {
    paddingHorizontal: 20,
  },
  benefitsTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  benefitsList: {
    
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#888',
    lineHeight: 20,
  },
});