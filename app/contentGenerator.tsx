import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, I18nManager, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Configuration, OpenAIApi } from 'openai';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function ContentGeneratorScreen() {
  const [contentType, setContentType] = useState('مقالة');
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('احترافي');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);

  const contentTypes = ['مقالة', 'بريد إلكتروني', 'وصف منتج', 'منشور وسائل التواصل', 'قصة قصيرة', 'رسالة رسمية'];
  const tones = ['احترافي', 'ودود', 'إبداعي', 'تقني', 'عاطفي', 'مقنع'];

  const handleGenerate = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setGeneratedContent('');
    
    try {
      const apiKey = await AsyncStorage.getItem('OPENAI_API_KEY');
      if (!apiKey) {
        Alert.alert('خطأ', 'يرجى إدخال مفتاح OpenAI API في الإعدادات أولاً.');
        setLoading(false);
        return;
      }
      
      const configuration = new Configuration({ apiKey });
      const openai = new OpenAIApi(configuration);
      
      const prompt = `أنشئ ${contentType} عن موضوع "${topic}" باستخدام الكلمات المفتاحية التالية: "${keywords}". يجب أن يكون النبرة ${tone}. يرجى كتابة محتوى عالي الجودة ومفيد باللغة العربية.`;
      
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'أنت مساعد متخصص في إنشاء المحتوى باللغة العربية. تنشئ محتوى عالي الجودة ومناسب للهدف المطلوب.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });
      
      const content = completion.data.choices[0]?.message?.content?.trim() || 'لم أتمكن من إنشاء المحتوى.';
      setGeneratedContent(content);
    } catch (err) {
      Alert.alert('خطأ', 'حدث خطأ أثناء إنشاء المحتوى. تحقق من اتصالك أو المفتاح.');
      setGeneratedContent('حدث خطأ أثناء إنشاء المحتوى.');
    }
    
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>إنشاء المحتوى</Text>
      <Text style={styles.subHeader}>أنشئ محتوى عالي الجودة بمساعدة الذكاء الاصطناعي</Text>
      
      <Text style={styles.label}>نوع المحتوى:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {contentTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.typeButton, contentType === type && styles.selectedTypeButton]}
            onPress={() => setContentType(type)}
          >
            <Text style={[styles.typeButtonText, contentType === type && styles.selectedTypeButtonText]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <Text style={styles.label}>الموضوع الرئيسي:</Text>
      <TextInput
        style={styles.input}
        value={topic}
        onChangeText={setTopic}
        placeholder="أدخل الموضوع الذي تريد الكتابة عنه..."
        placeholderTextColor="#bdbdbd"
        textAlign="right"
        editable={!loading}
      />
      
      <Text style={styles.label}>الكلمات المفتاحية (اختيارية):</Text>
      <TextInput
        style={styles.input}
        value={keywords}
        onChangeText={setKeywords}
        placeholder="أدخل الكلمات المفتاحية مفصولة بفواصل..."
        placeholderTextColor="#bdbdbd"
        textAlign="right"
        editable={!loading}
      />
      
      <Text style={styles.label}>نبرة الكتابة:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {tones.map((toneType) => (
          <TouchableOpacity
            key={toneType}
            style={[styles.typeButton, tone === toneType && styles.selectedTypeButton]}
            onPress={() => setTone(toneType)}
          >
            <Text style={[styles.typeButtonText, tone === toneType && styles.selectedTypeButtonText]}>
              {toneType}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleGenerate} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>أنشئ المحتوى</Text>
        )}
      </TouchableOpacity>

      {generatedContent ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultHeader}>المحتوى المُنشأ:</Text>
          <Text style={styles.resultText}>{generatedContent}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Arial',
  },
  subHeader: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Arial',
    lineHeight: 24,
  },
  label: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 8,
    marginTop: 16,
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
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ececec',
    writingDirection: 'rtl',
  },
  horizontalScroll: {
    marginBottom: 8,
  },
  typeButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedTypeButton: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  typeButtonText: {
    color: '#374151',
    fontSize: 14,
    fontFamily: 'Arial',
  },
  selectedTypeButtonText: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Arial',
  },
  resultBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e0e7ef',
  },
  resultHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 10,
    fontFamily: 'Arial',
    textAlign: 'right',
  },
  resultText: {
    fontSize: 16,
    color: '#374151',
    fontFamily: 'Arial',
    lineHeight: 24,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});