import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { 
  Image, 
  Pressable, 
  StyleSheet, 
  Text, 
  TextInput, 
  View, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator
} from "react-native";
import { useAuth } from "@/hooks/useAuth";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // Validasi input
    if (!fullName.trim()) {
      Alert.alert("Error", "Mohon isi nama lengkap");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Error", "Mohon isi email");
      return;
    }

    if (!password) {
      Alert.alert("Error", "Mohon isi password");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password minimal 6 karakter");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Format email tidak valid");
      return;
    }

    setLoading(true);
    try {
      const result = await signUp(email, password, fullName);
      
      if (result) {
        Alert.alert(
          "Pendaftaran Berhasil! 🎉",
          "Akun Anda telah dibuat. Silakan login untuk melanjutkan.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/(auth)/login")
            }
          ]
        );
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      
      let errorMessage = "Terjadi kesalahan saat mendaftar";
      
      if (error.message.includes("already registered")) {
        errorMessage = "Email sudah terdaftar. Silakan gunakan email lain atau login.";
      } else if (error.message.includes("Invalid email")) {
        errorMessage = "Format email tidak valid";
      } else if (error.message.includes("Password")) {
        errorMessage = "Password terlalu lemah. Gunakan minimal 6 karakter.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Pendaftaran Gagal", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      router.replace("/(tabs)/dashboard");
    } catch (error: any) {
      console.error("Google sign up error:", error);
      Alert.alert("Pendaftaran Gagal", error.message || "Terjadi kesalahan saat mendaftar dengan Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={["#2B7FFF", "#AD46FF", "#F6339A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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
              <Text style={styles.title}>Daftar Akun</Text>
              <Text style={styles.subtitle}>
                Mulai petualangan belajar tata bahasa Indonesia Anda sekarang
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>Nama Lengkap</Text>
                <TextInput
                  placeholder="Nama lengkap Anda"
                  placeholderTextColor="rgba(10,10,10,0.5)"
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  editable={!loading}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  placeholder="nama@email.com"
                  placeholderTextColor="rgba(10,10,10,0.5)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  editable={!loading}
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
                  editable={!loading}
                />
              </View>

              {/* SignUp Button */}
              <Pressable onPress={handleSignUp} disabled={loading}>
                <LinearGradient
                  colors={["#155DFC", "#9810FA"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginButton}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.loginText}>Daftar</Text>
                  )}
                </LinearGradient>
              </Pressable>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>atau daftar dengan</Text>
                <View style={styles.line} />
              </View>

              {/* Google SignUp */}
              <Pressable 
                style={styles.googleButton} 
                onPress={handleGoogleSignUp}
                disabled={loading}
              >
                <Image
                  source={require("../../assets/images/google_icon.png")}
                  style={styles.googleIcon}
                  resizeMode="contain"
                />
                <Text style={styles.googleText}>Daftar dengan Google</Text>
              </Pressable>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Sudah punya akun?</Text>
              <Pressable onPress={() => router.push("/(auth)/login")}>
                <Text style={styles.footerLink}>Masuk sekarang</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
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
  logoImage: {
    alignSelf: "center",
    width: 160,
    height: 60,
    marginBottom: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#101828",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#4A5565",
    textAlign: "center",
    lineHeight: 20,
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: "#364153",
  },
  input: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "white",
  },
  loginButton: {
    height: 50,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  loginText: {
    color: "white",
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
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
  },
  googleText: {
    fontSize: 14,
    fontWeight: '500',
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
    color: "#4A5565",
    marginRight: 6,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: "#155DFC",
  },
});