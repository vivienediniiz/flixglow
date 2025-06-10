import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Search as SearchIcon, X, Filter, Star } from 'lucide-react-native';
import { tmdbService, Movie, TVShow, Genre } from '@/services/tmdb';

const { width: screenWidth } = Dimensions.get('window');

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'movies' | 'tv'>('movies');
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadGenres();
  }, []);

  useEffect(() => {
    if (query.trim()) {
      searchContent();
    } else {
      setMovies([]);
      setTVShows([]);
    }
  }, [query, activeTab]);

  const loadGenres = async () => {
    try {
      const genresData = await tmdbService.getGenres();
      setGenres(genresData);
    } catch (error) {
      console.error('Falha ao carregar gêneros:', error);
    }
  };

  const searchContent = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      if (activeTab === 'movies') {
        const movieResults = await tmdbService.searchMovies(query.trim());
        setMovies(movieResults);
      } else {
        const tvResults = await tmdbService.searchTVShows(query.trim());
        setTVShows(tvResults);
      }
    } catch (error) {
      console.error('Busca falhou:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemPress = (item: Movie | TVShow) => {
    const route = activeTab === 'movies' ? `/movie/${item.id}` : `/tv/${item.id}`;
    router.push(route);
  };

  const clearSearch = () => {
    setQuery('');
    setMovies([]);
    setTVShows([]);
  };

  const getTitle = (item: Movie | TVShow) => {
    return activeTab === 'movies' ? (item as Movie).title : (item as TVShow).name;
  };

  const getReleaseYear = (item: Movie | TVShow) => {
    const date = activeTab === 'movies' ? (item as Movie).release_date : (item as TVShow).first_air_date;
    return date ? new Date(date).getFullYear() : '';
  };

  const results = activeTab === 'movies' ? movies : tvShows;

  return (
    <LinearGradient
      colors={['#000000', '#0a0a0a']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Buscar & Descobrir</Text>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <SearchIcon size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar filmes, séries..."
                placeholderTextColor="#666"
                value={query}
                onChangeText={setQuery}
                autoCorrect={false}
                returnKeyType="search"
                onSubmitEditing={searchContent}
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                  <X size={20} color="#666" />
                </TouchableOpacity>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} color="#00FF88" />
            </TouchableOpacity>
          </View>

          {/* Tab Selector */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'movies' && styles.activeTab]}
              onPress={() => setActiveTab('movies')}
            >
              <Text style={[styles.tabText, activeTab === 'movies' && styles.activeTabText]}>
                Filmes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'tv' && styles.activeTab]}
              onPress={() => setActiveTab('tv')}
            >
              <Text style={[styles.tabText, activeTab === 'tv' && styles.activeTabText]}>
                Séries
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Buscando...</Text>
            </View>
          ) : results.length > 0 ? (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsCount}>
                {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
              </Text>
              
              <View style={styles.grid}>
                {results.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.resultCard}
                    onPress={() => handleItemPress(item)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.cardImageContainer}>
                      <Image
                        source={{ 
                          uri: tmdbService.getImageUrl(item.poster_path, 'w342') || 'https://via.placeholder.com/342x513/1a1a1a/666666?text=Sem+Imagem'
                        }}
                        style={styles.cardImage}
                        resizeMode="cover"
                      />
                      <View style={styles.cardRatingBadge}>
                        <Star size={10} color="#FFD700" fill="#FFD700" />
                        <Text style={styles.cardRatingText}>
                          {item.vote_average.toFixed(1)}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardTitle} numberOfLines={2}>
                        {getTitle(item)}
                      </Text>
                      <Text style={styles.cardYear}>
                        {getReleaseYear(item)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : query.trim() ? (
            <View style={styles.noResultsContainer}>
              <SearchIcon size={64} color="#333" />
              <Text style={styles.noResultsTitle}>Nenhum Resultado Encontrado</Text>
              <Text style={styles.noResultsText}>
                Tente palavras-chave diferentes ou verifique a ortografia
              </Text>
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <SearchIcon size={64} color="#333" />
              <Text style={styles.emptyStateTitle}>Descubra Conteúdo Incrível</Text>
              <Text style={styles.emptyStateText}>
                Busque por seus filmes e séries favoritos
              </Text>
            </View>
          )}
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
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 20,
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    height: 50,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 136, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#00FF88',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#888',
  },
  activeTabText: {
    color: '#000000',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#888',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsCount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#888',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  resultCard: {
    width: (screenWidth - 52) / 2,
    marginBottom: 20,
  },
  cardImageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 240,
    backgroundColor: '#1a1a1a',
  },
  cardRatingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardRatingText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 2,
  },
  cardInfo: {
    paddingTop: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    lineHeight: 18,
    marginBottom: 4,
  },
  cardYear: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#888',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  noResultsTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#888',
    textAlign: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#888',
    textAlign: 'center',
  },
});