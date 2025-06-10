import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Movie, TVShow } from '@/services/tmdb';
import { tmdbService } from '@/services/tmdb';
import { Star } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = 140;
const CARD_HEIGHT = 210;

interface MovieCarouselProps {
  title: string;
  movies: (Movie | TVShow)[];
  type: 'movie' | 'tv';
}

export default function MovieCarousel({ title, movies, type }: MovieCarouselProps) {
  const router = useRouter();

  const handleMoviePress = (item: Movie | TVShow) => {
    const route = type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;
    router.push(route);
  };

  const getTitle = (item: Movie | TVShow) => {
    return type === 'movie' ? (item as Movie).title : (item as TVShow).name;
  };

  const getReleaseYear = (item: Movie | TVShow) => {
    const date = type === 'movie' ? (item as Movie).release_date : (item as TVShow).first_air_date;
    return date ? new Date(date).getFullYear() : '';
  };

  if (movies.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + 12}
        snapToAlignment="start"
      >
        {movies.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.movieCard,
              index === 0 && styles.firstCard,
              index === movies.length - 1 && styles.lastCard,
            ]}
            onPress={() => handleMoviePress(item)}
            activeOpacity={0.8}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ 
                  uri: tmdbService.getImageUrl(item.poster_path, 'w342') || 'https://via.placeholder.com/342x513/1a1a1a/666666?text=No+Image'
                }}
                style={styles.poster}
                resizeMode="cover"
              />
              <View style={styles.ratingBadge}>
                <Star size={12} color="#FFD700" fill="#FFD700" />
                <Text style={styles.ratingText}>
                  {item.vote_average.toFixed(1)}
                </Text>
              </View>
              <View style={styles.overlay} />
            </View>
            
            <View style={styles.movieInfo}>
              <Text style={styles.movieTitle} numberOfLines={2}>
                {getTitle(item)}
              </Text>
              <Text style={styles.movieYear}>
                {getReleaseYear(item)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  movieCard: {
    width: CARD_WIDTH,
    marginHorizontal: 6,
  },
  firstCard: {
    marginLeft: 20,
  },
  lastCard: {
    marginRight: 20,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  poster: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#1a1a1a',
  },
  ratingBadge: {
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
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 2,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'transparent',
  },
  movieInfo: {
    paddingTop: 12,
    paddingHorizontal: 4,
  },
  movieTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    lineHeight: 18,
    marginBottom: 4,
  },
  movieYear: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#888888',
  },
});