import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator } from "react-native";
import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
  const router = useRouter();
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Mohon isi email dan password");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email, password);
      router.replace("/(tabs)/dashboard");
    } catch (error: any) {
      Alert.alert("Login Gagal", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      router.replace("/(tabs)/dashboard");
    } catch (error: any) {
      Alert.alert("Login Gagal", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#2B7FFF", "#AD46FF", "#F6339A"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.card}>
        {/* Logo */}
        <View style={styles.logo}>
          <Image
            source={require("../../assets/images/logo_taba1.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Selamat Datang!</Text>
          <Text style={styles.subtitle}>
            Belajar Tata Bahasa Indonesia dengan mudah dan menyenangkan
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="nama@email.com"
              placeholderTextColor="rgba(10,10,10,0.5)"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor="rgba(10,10,10,0.5)"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Login Button */}
          <Pressable onPress={handleEmailLogin} disabled={loading}>
            <LinearGradient
              colors={["#155DFC", "#9810FA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginButton}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.loginText}>Login</Text>
              )}
            </LinearGradient>
          </Pressable>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>atau masuk dengan</Text>
            <View style={styles.line} />
          </View>

          {/* Google Login */}
          <Pressable style={styles.googleButton} onPress={handleGoogleLogin} disabled={loading}>
            <Image
              source={require("../../assets/images/google_icon.png")}
              style={styles.googleIcon}
              resizeMode="contain"
            />
            <Text style={styles.googleText}>Login dengan Google</Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Belum punya akun?</Text>
          <Pressable onPress={() => router.push("/(auth)/signup")}>
            <Text style={styles.footerLink}>Daftar sekarang</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: 346,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingVertical: 32,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },

  logo: {
    alignItems: "center",
    marginBottom: 4,
  },

  logoText: {
    color: "white",
    fontSize: 30,
    lineHeight: 36,
  },

  logoImage: {
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: 160,
    height: 60,
    marginBottom: 24,
    },

  header: {
    alignItems: "center",
    marginBottom: 32,
  },

  title: {
    fontSize: 20,
    lineHeight: 30,
    color: "#101828",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4A5565",
    textAlign: "center",
  },

  form: {
    gap: 16,
  },

  field: {
    gap: 8,
  },

  label: {
    fontSize: 14,
    lineHeight: 20,
    color: "#364153",
  },

  input: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    fontSize: 16,
  },

  loginButton: {
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  loginText: {
    color: "white",
    fontSize: 16,
    lineHeight: 24,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    lineHeight: 20,
    color: "#6A7282",
  },

  googleButton: {
    flexDirection: "row", 
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingHorizontal: 16, 
  },

  googleText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#364153",
  },

  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },

  footerText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4A5565",
    marginRight: 6,
  },

  footerLink: {
    fontSize: 16,
    lineHeight: 24,
    color: "#155DFC",
  },
});
