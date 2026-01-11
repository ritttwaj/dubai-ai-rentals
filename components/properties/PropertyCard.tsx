import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Property } from '../../types';
import { useProperties } from '../../hooks/useProperties';
import { formatPriceShort, formatBedrooms } from '../../utils/formatters';
import { COLORS, SPACING, FONT_SIZES } from '../../utils/constants';

const { width } = Dimensions.get('window');

interface PropertyCardProps {
  property: Property;
  onPress: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onPress }) => {
  const { favorites, toggleFavorite } = useProperties();
  const isFavorite = favorites.includes(property.id);
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<Video>(null);

  const handlePlayPress = async () => {
    setShowVideo(true);
    setIsPlaying(true);
    if (videoRef.current) {
      await videoRef.current.playAsync();
    }
  };

  const handleVideoPress = async () => {
    if (isPlaying) {
      await videoRef.current?.pauseAsync();
      setIsPlaying(false);
    } else {
      await videoRef.current?.playAsync();
      setIsPlaying(true);
    }
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.9}>
      <View style={styles.mediaContainer}>
        {showVideo ? (
          <TouchableOpacity onPress={handleVideoPress} activeOpacity={1}>
            <Video
              ref={videoRef}
              source={{ uri: property.videoUrl }}
              style={styles.video}
              resizeMode={ResizeMode.COVER}
              shouldPlay={isPlaying}
              isLooping
              useNativeControls={false}
            />
            {!isPlaying && (
              <View style={styles.pausedOverlay}>
                <View style={styles.playButtonOverlay}>
                  <Text style={styles.playIcon}>▶</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <View>
            <Image source={{ uri: property.thumbnail }} style={styles.image} />
            <TouchableOpacity
              style={styles.playButton}
              onPress={(e) => {
                e.stopPropagation();
                handlePlayPress();
              }}
              activeOpacity={0.9}
            >
              <View style={styles.playButtonInner}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
              <Text style={styles.playText}>Watch Tour</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {property.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>⭐ Featured</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleFavorite(property.id);
          }}
        >
          <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>

        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>📹 Video Tour</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {property.title}
            </Text>
            <Text style={styles.location} numberOfLines={1}>
              📍 {property.area}
            </Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPriceShort(property.price)}</Text>
            <Text style={styles.priceLabel}>per year</Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailText}>🛏️ {formatBedrooms(property.bedrooms)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailText}>🚿 {property.bathrooms}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailText}>📐 {property.sqft} sqft</Text>
          </View>
        </View>

        <View style={styles.amenities}>
          {property.amenities.slice(0, 3).map((amenity, idx) => (
            <View key={idx} style={styles.amenityTag}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
          {property.amenities.length > 3 && (
            <View style={[styles.amenityTag, styles.moreTag]}>
              <Text style={styles.moreText}>+{property.amenities.length - 3}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  mediaContainer: {
    position: 'relative',
    height: 220,
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  video: {
    width: '100%',
    height: 220,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#000',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -40 }],
    alignItems: 'center',
  },
  playButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playIcon: {
    fontSize: 24,
    color: COLORS.primary,
    marginLeft: 4,
  },
  playText: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  pausedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonOverlay: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredBadge: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
  },
  featuredText: {
    color: '#fff',
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: SPACING.xs,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  typeBadge: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
  },
  typeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.text,
  },
  content: {
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  titleContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  location: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  priceLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  details: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  detailItem: {
    marginRight: SPACING.md,
  },
  detailText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  amenityTag: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  amenityText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
  },
  moreTag: {
    backgroundColor: '#e0e7ff',
  },
  moreText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: '600',
  },
});