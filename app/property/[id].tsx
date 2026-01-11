// app/property/[id].tsx - WITH VIDEO PLAYER

import React, { useState, useRef } from 'react';
import { View, ScrollView, Image, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
import { useProperties } from '../../hooks/useProperties';
import { ChatPanel } from '../../components/chat/ChatPanel';
import { formatPrice, formatBedrooms } from '../../utils/formatters';
import { COLORS, SPACING, FONT_SIZES } from '../../utils/constants';

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getPropertyById, favorites, toggleFavorite } = useProperties();
  const property = getPropertyById(Number(id));
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<Video>(null);

  if (!property) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.error}>
          <Text style={styles.errorText}>Property not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isFavorite = favorites.includes(property.id);

  const handlePlayVideo = async () => {
    setIsVideoPlaying(true);
    if (videoRef.current) {
      await videoRef.current.playAsync();
    }
  };

  const handlePauseVideo = async () => {
    setIsVideoPlaying(false);
    if (videoRef.current) {
      await videoRef.current.pauseAsync();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{property.area}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Video Player */}
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: property.videoUrl }}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            shouldPlay={false}
            isLooping
            useNativeControls
          />

          {!isVideoPlaying && (
            <View style={styles.videoOverlay}>
              <TouchableOpacity
                style={styles.bigPlayButton}
                onPress={handlePlayVideo}
                activeOpacity={0.9}
              >
                <View style={styles.playButtonCircle}>
                  <Text style={styles.bigPlayIcon}>▶</Text>
                </View>
                <Text style={styles.videoLabel}>📹 Watch Property Tour</Text>
              </TouchableOpacity>

              {/* Featured Badge on Video */}
              {property.featured && (
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredText}>⭐ Featured</Text>
                </View>
              )}

              {/* Favorite Button on Video */}
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(property.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={styles.content}>
          {/* Title and Price */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{property.title}</Text>
            <Text style={styles.price}>{formatPrice(property.price)}/year</Text>
          </View>

          {/* Location */}
          <Text style={styles.location}>📍 {property.area} • {property.building}</Text>

          {/* Quick Stats */}
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statIcon}>🛏️</Text>
              <Text style={styles.statLabel}>Bedrooms</Text>
              <Text style={styles.statValue}>{formatBedrooms(property.bedrooms)}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statIcon}>🚿</Text>
              <Text style={styles.statLabel}>Bathrooms</Text>
              <Text style={styles.statValue}>{property.bathrooms}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statIcon}>📐</Text>
              <Text style={styles.statLabel}>Size</Text>
              <Text style={styles.statValue}>{property.sqft} sqft</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Property</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          {/* Property Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Property Type</Text>
              <Text style={styles.detailValue}>{property.propertyType}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Furnishing</Text>
              <Text style={styles.detailValue}>{property.furnishing}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Floor</Text>
              <Text style={styles.detailValue}>
                {property.floor === 0 ? 'Ground Floor' : `Floor ${property.floor}`}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>View</Text>
              <Text style={styles.detailValue}>{property.viewType}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Parking</Text>
              <Text style={styles.detailValue}>{property.parking} space(s)</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Maintenance</Text>
              <Text style={styles.detailValue}>{property.maintenance}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment</Text>
              <Text style={styles.detailValue}>{property.cheques} cheque(s)</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Available From</Text>
              <Text style={styles.detailValue}>{property.moveInDate}</Text>
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenities}>
              {property.amenities.map((amenity, idx) => (
                <View key={idx} style={styles.amenityTag}>
                  <Text style={styles.amenityText}>✓ {amenity}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Floating AI Chat Button */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setIsChatOpen(true)}
          activeOpacity={0.9}
        >
          <Text style={styles.floatingButtonIcon}>✨</Text>
          <Text style={styles.floatingButtonText}>Ask AI Assistant</Text>
        </TouchableOpacity>
      </View>

      {/* Chat Modal */}
      <Modal
        visible={isChatOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsChatOpen(false)}
      >
        <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom']}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderContent}>
              <Text style={styles.modalTitle}>✨ AI Property Assistant</Text>
              <Text style={styles.modalSubtitle}>{property.title}</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsChatOpen(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ChatPanel property={property} />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  videoContainer: {
    position: 'relative',
    height: 300,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigPlayButton: {
    alignItems: 'center',
  },
  playButtonCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  bigPlayIcon: {
    fontSize: 32,
    color: COLORS.primary,
    marginLeft: 6,
  },
  videoLabel: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
  },
  featuredBadge: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  featuredText: {
    color: '#fff',
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  content: {
    padding: SPACING.md,
  },
  titleSection: {
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  price: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  location: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  stat: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  amenityTag: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  amenityText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.md,
    backgroundColor: 'transparent',
  },
  floatingButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalHeaderContent: {
    flex: 1,
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: '#fff',
  },
  modalSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.md,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.error,
  },
});