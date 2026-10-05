import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { StorageService } from '../services/storage';

export default function NameScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadName();
  }, []);

  const loadName = async () => {
    const settings = await StorageService.loadUserSettings();
    if (settings && settings.name) {
      setName(settings.name);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const settings = await StorageService.loadUserSettings();
    await StorageService.saveUserSettings({ ...settings, name: name.trim() });
    setIsSaving(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.header}>
              <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Feather name="arrow-left" size={24} color={theme.text} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Your Name</Text>
              <View style={styles.headerRight} />
            </View>

            <View style={styles.content}>
              <Text style={styles.instruction}>
                How would you like Clover to call you?
              </Text>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor={theme.subtext}
                  autoCapitalize="words"
                  autoCorrect={false}
                  maxLength={30}
                  selectionColor={theme.accent}
                />
              </View>

              <Text style={styles.description}>
                This name is kept locally on your device, just for you.
              </Text>

              <TouchableOpacity 
                style={[styles.saveButton, !name.trim() && styles.saveButtonDisabled]} 
                onPress={handleSave}
                disabled={!name.trim() || isSaving}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>Save Name</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  keyboardView: {
    flex: 1,
  },
  inner: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontFamily: 'Amarna',
    fontSize: 24,
    color: theme.text,
  },
  headerRight: {
    width: 36,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 40,
    alignItems: 'center',
  },
  instruction: {
    fontFamily: 'Amarna',
    fontSize: 20,
    color: theme.text,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    width: '100%',
    backgroundColor: theme.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 16,
  },
  input: {
    fontFamily: 'Amarna',
    fontSize: 18,
    color: theme.text,
  },
  description: {
    fontFamily: 'Amarna',
    fontSize: 14,
    color: theme.subtext,
    textAlign: 'center',
    marginBottom: 40,
  },
  saveButton: {
    backgroundColor: theme.accent,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontFamily: 'Amarna',
    fontSize: 16,
    color: theme.background,
  },
});
