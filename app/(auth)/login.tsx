import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen } from 'lucide-react-native';
import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface LoginProps {
  onLogin: () => void;
}

function Login({ onLogin }: LoginProps) {
  return (
    // KeyboardAvoidingView memastikan input tidak tertutup keyboard HP
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <LinearGradient
        colors={['#3B82F6', '#8B5CF6', '#EC4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 justify-center px-6"
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          
          <View className="bg-white/95 rounded-[40px] shadow-2xl p-8">
            
            {/* Logo Section */}
            <View className="items-center mb-8">
              <View className="relative">
                {/* Efek Blur Glow (diakali dengan View opacity di mobile) */}
                <View className="absolute inset-0 bg-blue-400 opacity-20 rounded-full scale-150" />
                <LinearGradient
                  colors={['#2563EB', '#7C3AED']}
                  className="flex-row items-center px-6 py-3 rounded-2xl gap-3"
                >
                  <BookOpen size={28} color="white" />
                  <Text className="text-3xl font-bold text-white">TaBa</Text>
                </LinearGradient>
              </View>
            </View>

            {/* Title Section */}
            <View className="items-center mb-8">
              <Text className="text-2xl font-bold text-gray-900 mb-2">Selamat Datang!</Text>
              <Text className="text-center text-gray-600 leading-5">
                Belajar Tata Bahasa Indonesia dengan mudah dan menyenangkan
              </Text>
            </View>

            {/* Login Form */}
            <View className="gap-y-4">
              <View>
                <Text className="text-sm text-gray-700 mb-2 ml-1">Email</Text>
                <TextInput
                  placeholder="nama@email.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 text-gray-900"
                />
              </View>

              <View>
                <Text className="text-sm text-gray-700 mb-2 ml-1">Password</Text>
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 text-gray-900"
                />
              </View>

              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={onLogin}
                className="overflow-hidden rounded-2xl shadow-lg mt-2"
              >
                <LinearGradient
                  colors={['#2563EB', '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="py-4 items-center"
                >
                  <Text className="text-white font-bold text-lg">Login</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-4">
                <View className="flex-1 h-[1px] bg-gray-200" />
                <Text className="px-3 text-gray-500 text-xs">atau masuk dengan</Text>
                <View className="flex-1 h-[1px] bg-gray-200" />
              </View>

              {/* OAuth Google */}
              <TouchableOpacity
                onPress={onLogin}
                activeOpacity={0.7}
                className="w-full bg-white border-2 border-gray-100 flex-row items-center justify-center py-3 rounded-2xl shadow-sm gap-x-3"
              >
                <Svg width={20} height={20} viewBox="0 0 24 24">
                  <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </Svg>
                <Text className="text-gray-700 font-semibold">Login dengan Google</Text>
              </TouchableOpacity>
            </View>

            {/* Register Link */}
            <View className="flex-row justify-center mt-8">
              <Text className="text-gray-600 text-sm">Belum punya akun? </Text>
              <TouchableOpacity>
                <Text className="text-blue-600 font-bold text-sm">Daftar sekarang</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

export default function LoginScreen() {
  const handleLogin = () => {
    // Logika login akan ditambahkan di sini
    console.log('Login pressed');
  };

  return <Login onLogin={handleLogin} />;
}