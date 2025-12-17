import { Colors } from '@/constants/theme';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface WelcomeProps {
  onGetStarted: () => void;
}

export function Welcome({ onGetStarted }: WelcomeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      title: "Chào mừng đến với GameZone",
      description: "Nơi tìm kiếm những sản phẩm gaming chất lượng nhất với giá tốt",
      image: "https://cdn-icons-png.flaticon.com/512/808/808439.png",
      color: Colors.light.primary
    },
    {
      id: 2,
      title: "Mua sắm dễ dàng",
      description: "Tìm kiếm console, game, phụ kiện với giao diện thân thiện",
      image: "https://cdn-icons-png.flaticon.com/512/2331/2331966.png",
      color: Colors.light.secondary
    },
    {
      id: 3,
      title: "Bắt đầu ngay",
      description: "Đăng nhập để khám phá thế giới gaming đầy thú vị",
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      color: Colors.light.accent
    }
  ];

  const { width } = Dimensions.get('window');

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onGetStarted();
    }
  };

  const handleSkip = () => {
    onGetStarted();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />
      
      {/* Nút Skip */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Bỏ qua</Text>
      </TouchableOpacity>

      {/* Image/Content Slider */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const slide = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentSlide(slide);
        }}
        scrollEventThrottle={16}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={[styles.slide, { width }]}>
            {/* Hình ảnh */}
            <View style={styles.imageWrapper}>
              <View style={[styles.imageContainer, { backgroundColor: slide.color + '20' }]}>
                <Image 
                  source={{ uri: slide.image }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Nội dung */}
            <View style={styles.content}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Indicators */}
      <View style={styles.indicatorContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentSlide === index && styles.activeIndicator
            ]}
          />
        ))}
      </View>

      {/* Nút Next/Get Started */}
      <TouchableOpacity 
        style={[styles.nextButton, currentSlide === slides.length - 1 && styles.getStartedButton]}
        onPress={handleNext}
        activeOpacity={0.8}
      >
        <Text style={styles.nextButtonText}>
          {currentSlide === slides.length - 1 ? 'Bắt đầu' : 'Tiếp theo'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: 50,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 24,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    color: Colors.light.mutedForeground,
    fontSize: 16,
    fontWeight: '500',
  },
  slide: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  imageWrapper: {
    marginTop: 60,
    marginBottom: 40,
    alignItems: 'center',
  },
  imageContainer: {
    width: 250,
    height: 250,
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 180,
    height: 180,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    color: Colors.light.mutedForeground,
    textAlign: 'center',
    lineHeight: 24,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.border,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: Colors.light.primary,
    width: 24,
  },
  nextButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 40,
  },
  getStartedButton: {
    backgroundColor: Colors.light.accent,
  },
  nextButtonText: {
    color: Colors.light.primaryForeground,
    fontSize: 18,
    fontWeight: 'bold',
  },
});