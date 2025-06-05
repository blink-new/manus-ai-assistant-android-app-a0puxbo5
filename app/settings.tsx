import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function SettingsScreen() {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('OPENAI_API_KEY').then(key => {
      if (key) setApiKey(key);
    });
  }, []);

  const saveKey = async () => {
    if (!apiKey.trim().startsWith('sk-')) {
      Alert.alert('خطأ', 'يرجى إدخال مفتاح OpenAI API صحيح يبدأ بـ sk-');
      return;
    }
    await AsyncStorage.setItem('OPENAI_API_KEY', apiKey.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>إعدادات الذكاء الاصطناعي</Text>
      <Text style={styles.label}>مفتاح OpenAI API</Text>
      <TextInput
        style={styles.input}
        value={apiKey}
        onChangeText={setApiKey}
        placeholder="أدخل مفتاح OpenAI API هنا..."
        placeholderTextColor="#bdbdbd"
        textAlign="right"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity style={styles.saveBtn} onPress={saveKey}>
        <Text style={styles.saveBtnText}>حفظ</Text>
      </TouchableOpacity>
      {saved && <Text style={styles.savedMsg}>تم الحفظ بنجاح!</Text>}
      <Text style={styles.hint}>
        يمكنك الحصول على مفتاح OpenAI API من https://platform.openai.com/account/api-keys
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Arial',
  },
  label: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 8,
    fontFamily: 'Arial',
    textAlign: 'right',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#222',
    fontFamily: 'Arial',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ececec',
    writingDirection: 'rtl',
  },
  saveBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Arial',
  },
  savedMsg: {
    color: '#059669',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Arial',
  },
  hint: {
    color: '#6b7280',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 24,
    fontFamily: 'Arial',
  },
});
