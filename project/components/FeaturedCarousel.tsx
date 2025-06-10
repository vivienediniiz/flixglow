import { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Movie } from '@/services/tmdb';
import { tmdbService } from '@/services/tmdb';
import { Play, Info, Star } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface FeaturedCarouselProps {
  movies: Movie[];
}

export default function FeaturedCarousel({ movies }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();
  const fadeAnim = useSharedValue(1);

  useEffect(() => {
    if (movies.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % movies.length;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * screenWidth,
          animated: true,
        });
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [movies.length]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
    };
  });

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / screenWidth);
    if (index !== currentIndex) {
      fadeAnim.value = withTiming(0, { duration: 200 }, () => {
        fadeAnim.value = withTiming(1, { duration: 200 });
      });
      setCurrentIndex(index);
    }
  };

  const handleWatchNow = (movie: Movie) => {
    router.push(`/movie/${movie.id}`);
  };

  const handleMoreInfo = (movie: Movie) => {
    router.push(`/movie/${movie.id}`);
  };

  if (movies.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {movies.map((movie, index) => (
          <View key={movie.id} style={styles.slide}>
            <ImageBackground
              source={{ uri: tmdbService.getBackdropUrl(movie.backdrop_path, 'w1280') }}
              style={styles.backgroundImage}
              imageStyle={styles.backgroundImageStyle}
            >
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)', '#000000']}
                locations={[0, 0.3, 0.7, 1]}
                style={styles.gradient}
              >
                <Animated.View style={[styles.content, animatedStyle]}>
                  <View style={styles.movieInfo}>
                    <Text style={styles.title} numberOfLines={2}>
                      {movie.title}
                    </Text>
                    
                    <View style={styles.metaInfo}>
                      <View style={styles.ratingContainer}>
                        <Star size={16} color="#FFD700" fill="#FFD700" />
                        <Text style={styles.rating}>
                          {movie.vote_average.toFixed(1)}
                        </Text>
                      </View>
                      <Text style={styles.year}>
                        {new Date(movie.release_date).getFullYear()}
                      </Text>
                    </View>

                    <Text style={styles.overview} numberOfLines={3}>
                      {movie.overview}
                    </Text>

                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={styles.watchButton}
                        onPress={() => handleWatchNow(movie)}
                      >
                        <LinearGradient
                          colors={['#00FF88', '#00CC66']}
                          style={styles.watchButtonGradient}
                        >
                          <Play size={20} color="#000" fill="#000" />
                          <Text style={styles.watchButtonText}>Assistir Agora</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.infoButton}
                        onPress={() => handleMoreInfo(movie)}
                      >
                        <View style={styles.infoButtonContent}>
                          <Info size={20} color="#FFFFFF" />
                          <Text style={styles.infoButtonText}>Mais Informações</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              </LinearGradient>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {movies.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: screenHeight * 0.6,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: screenWidth,
    height: '100%',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backgroundImageStyle: {
    resizeMode: 'cover',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  movieInfo: {
    maxWidth: '85%',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  year: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#CCCCCC',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  overview: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    lineHeight: 22,
    marginBottom: 24,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  watchButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
    elevation: 4,
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  watchButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  watchButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000000',
    marginLeft: 8,
  },
  infoButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  infoButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  infoButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#00FF88',
    width: 24,
  },
});