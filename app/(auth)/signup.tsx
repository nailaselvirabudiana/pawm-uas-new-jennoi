import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, TextInput, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";

export default function SignUpScreen() {
  const router = useRouter();

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
                // PERBAIKAN PATH: ../../ karena berada di app/(auth)/
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
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor="rgba(10,10,10,0.5)"
                  secureTextEntry
                  style={styles.input}
                />
              </View>

              {/* SignUp Button */}
              <Pressable onPress={() => router.replace("/(auth)/login")}>
                <LinearGradient
                  colors={["#155DFC", "#9810FA"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginButton}
                >
                  <Text style={styles.loginText}>Daftar</Text>
                </LinearGradient>
              </Pressable>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>atau daftar dengan</Text>
                <View style={styles.line} />
              </View>

              {/* Google Login */}
              <Pressable style={styles.googleButton}>
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