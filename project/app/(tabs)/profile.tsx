import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Crown, History, Settings, LogOut, CreditCard as Edit3, Save, X } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: logout 
        }
      ]
    );
  };

  const handleSaveProfile = () => {
    if (!editName.trim() || !editEmail.trim()) {
      Alert.alert('Erro', 'Nome e email são obrigatórios');
      return;
    }

    updateProfile({
      name: editName.trim(),
      email: editEmail.trim(),
    });

    setIsEditing(false);
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso');
  };

  const handleCancelEdit = () => {
    setEditName(user?.name || '');
    setEditEmail(user?.email || '');
    setIsEditing(false);
  };

  const getPlanDisplayName = (plan: string) => {
    switch (plan) {
      case 'basic': return 'Básico';
      case 'standard': return 'Padrão';
      case 'premium': return 'Premium';
      default: return 'Básico';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basic': return '#666666';
      case 'standard': return '#00FF88';
      case 'premium': return '#FFD700';
      default: return '#666666';
    }
  };

  if (!user) return null;

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
            <View style={styles.profileImageContainer}>
              <LinearGradient
                colors={['#00FF88', '#00CC66']}
                style={styles.profileImage}
              >
                <User size={40} color="#000000" />
              </LinearGradient>
            </View>
            
            <Text style={styles.welcomeText}>Bem-vindo de volta,</Text>
            <Text style={styles.userName}>{user.name}</Text>
            
            <View style={styles.planBadge}>
              <Crown size={16} color={getPlanColor(user.plan)} />
              <Text style={[styles.planText, { color: getPlanColor(user.plan) }]}>
                Plano {getPlanDisplayName(user.plan)}
              </Text>
            </View>
          </View>

          {/* Profile Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Informações do Perfil</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(!isEditing)}
              >
                {isEditing ? (
                  <X size={20} color="#FF4444" />
                ) : (
                  <Edit3 size={20} color="#00FF88" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <User size={20} color="#00FF88" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Nome</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.editInput}
                      value={editName}
                      onChangeText={setEditName}
                      placeholder="Digite seu nome"
                      placeholderTextColor="#666"
                    />
                  ) : (
                    <Text style={styles.infoValue}>{user.name}</Text>
                  )}
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Mail size={20} color="#00FF88" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.editInput}
                      value={editEmail}
                      onChangeText={setEditEmail}
                      placeholder="Digite seu email"
                      placeholderTextColor="#666"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  ) : (
                    <Text style={styles.infoValue}>{user.email}</Text>
                  )}
                </View>
              </View>

              {isEditing && (
                <View style={styles.editActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancelEdit}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveProfile}
                  >
                    <LinearGradient
                      colors={['#00FF88', '#00CC66']}
                      style={styles.saveButtonGradient}
                    >
                      <Save size={16} color="#000000" />
                      <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Watch History */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Histórico de Visualização</Text>
            
            <View style={styles.watchHistoryContainer}>
              {user.watchHistory.length > 0 ? (
                <View style={styles.historyStats}>
                  <History size={24} color="#00FF88" />
                  <Text style={styles.historyText}>
                    {user.watchHistory.length} item{user.watchHistory.length !== 1 ? 's' : ''} assistido{user.watchHistory.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              ) : (
                <View style={styles.emptyHistory}>
                  <History size={32} color="#333" />
                  <Text style={styles.emptyHistoryText}>Nenhum histórico ainda</Text>
                  <Text style={styles.emptyHistorySubtext}>
                    Comece a assistir para criar seu histórico
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configurações da Conta</Text>
            
            <View style={styles.settingsContainer}>
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingIcon}>
                  <Settings size={20} color="#00FF88" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Preferências</Text>
                  <Text style={styles.settingDescription}>
                    Gerencie suas preferências de visualização
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingIcon}>
                  <Crown size={20} color="#FFD700" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Assinatura</Text>
                  <Text style={styles.settingDescription}>
                    Gerencie seu plano {getPlanDisplayName(user.plan)}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Out */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleLogout}
            >
              <LogOut size={20} color="#FF4444" />
              <Text style={styles.signOutText}>Sair</Text>
            </TouchableOpacity>
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
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#888',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  planText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 6,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  editButton: {
    padding: 8,
  },
  profileInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#888',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  editInput: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#888',
  },
  saveButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginLeft: 6,
  },
  watchHistoryContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  historyStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyHistoryText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyHistorySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#888',
  },
  settingsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#888',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 68, 68, 0.3)',
    paddingVertical: 16,
  },
  signOutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FF4444',
    marginLeft: 8,
  },
});