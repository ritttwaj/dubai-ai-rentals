import { Slot, useRouter, useSegments, SplashScreen } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuthenticated, isLoading, checkSession } = useAuth();
  const [appIsReady, setAppIsReady] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  // Check auth session on mount
  useEffect(() => {
    async function prepare() {
      try {
        console.log('Checking authentication...');
        await checkSession();
      } catch (e) {
        console.warn('Auth check failed:', e);
      } finally {
        setAppIsReady(true);
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    if (!appIsReady || isLoading) {
      return;
    }

    const inTabsGroup = segments[0] === '(tabs)';
    const onLoginPage = segments[0] === 'login' || segments.length === 0;
    
    console.log('Navigation check:', { 
      isAuthenticated, 
      segments, 
      inTabsGroup,
      onLoginPage 
    });

    // Use setTimeout to avoid navigation during render
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        // Not logged in - force to login
        console.log('Not authenticated, going to login');
        router.replace('/login');
      } else if (isAuthenticated && onLoginPage) {
        // Logged in but on login page - go to home
        console.log('Authenticated, going to home');
        router.replace('/(tabs)');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, segments, appIsReady, isLoading]);

  if (!appIsReady || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});