import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { tmdbService, Movie, TVShow } from '@/services/tmdb';
import FeaturedCarousel from '@/components/FeaturedCarousel';
import MovieCarousel from '@/components/MovieCarousel';
import LoadingScreen from '@/components/LoadingScreen';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [newReleases, setNewReleases] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<TVShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const [
        trending,
        popular,
        newReleasesData,
        topRatedData,
        tvShows
      ] = await Promise.all([
        tmdbService.getTrending(),
        tmdbService.getPopularMovies(),
        tmdbService.getNewReleases(),
        tmdbService.getTopRated(),
        tmdbService.getPopularTVShows()
      ]);

      setFeaturedMovies(trending.slice(0, 5));
      setTrendingMovies(trending);
      setPopularMovies(popular);
      setNewReleases(newReleasesData);
      setTopRated(topRatedData);
      setPopularTVShows(tvShows);
    } catch (error) {
      console.error('Falha ao carregar conteúdo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

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
            <Text style={styles.logo}>FlixGlow</Text>
            <Text style={styles.welcomeText}>Streaming Sem Limites</Text>
          </View>

          {/* Featured Carousel */}
          <FeaturedCarousel movies={featuredMovies} />

          {/* Content Sections */}
          <View style={styles.sectionsContainer}>
            <MovieCarousel
              title="🔥 Em Alta Agora"
              movies={trendingMovies}
              type="movie"
            />
            
            <MovieCarousel
              title="🎬 Lançamentos"
              movies={newReleases}
              type="movie"
            />

            <MovieCarousel
              title="⭐ Filmes Populares"
              movies={popularMovies}
              type="movie"
            />

            <MovieCarousel
              title="📺 Séries Populares"
              movies={popularTVShows}
              type="tv"
            />

            <MovieCarousel
              title="🏆 Mais Bem Avaliados"
              movies={topRated}
              type="movie"
            />
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  logo: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#00FF88',
    textShadowColor: '#00FF88',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  welcomeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#888',
    marginTop: 4,
  },
  sectionsContainer: {
    paddingTop: 20,
  },
});