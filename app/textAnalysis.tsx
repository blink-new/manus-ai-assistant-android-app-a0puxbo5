import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, I18nManager, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Configuration, OpenAIApi } from 'openai';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function TextAnalysisScreen() {
  const [textToAnalyze, setTextToAnalyze] = useState('');
  const [analysisType, setAnalysisType] = useState('تحليل المشاعر');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const analysisTypes = [
    'تحليل المشاعر',
    'استخراج الكلمات المفتاحية',
    'تحديد الكيانات',
    'تصنيف الموضوع',
    'تحليل النبرة',
    'تلخيص النقاط الرئيسية'
  ];

  const handleAnalyze = async () => {
    if (!textToAnalyze.trim() || loading) return;
    setLoading(true);
    setResult('');
    
    try {
      const apiKey = await AsyncStorage.getItem('OPENAI_API_KEY');
      if (!apiKey) {
        Alert.alert('خطأ', 'يرجى إدخال مفتاح OpenAI API في الإعدادات أولاً.');
        setLoading(false);
        return;
      }
      
      const configuration = new Configuration({ apiKey });
      const openai = new OpenAIApi(configuration);
      
      let prompt = '';
      switch(analysisType) {
        case 'تحليل المشاعر':
          prompt = `حلل المشاعر في النص التالي وحدد ما إذا كان إيجابياً أم سلبياً أم محايداً مع تقديم تفسير مفصل:\n\n${textToAnalyze}`;
          break;
        case 'استخراج الكلمات المفتاحية':
          prompt = `استخرج أهم الكلمات المفتاحية والعبارات الأساسية من النص التالي:\n\n${textToAnalyze}`;
          break;
        case 'تحديد الكيانات':
          prompt = `حدد الكيانات المذكورة في النص التالي (أشخاص، أماكن، منظمات، تواريخ، إلخ):\n\n${textToAnalyze}`;
          break;
        case 'تصنيف الموضوع':
          prompt = `صنف موضوع النص التالي وحدد الفئة التي ينتمي إليها:\n\n${textToAnalyze}`;
          break;
        case 'تحليل النبرة':
          prompt = `حلل نبرة الكاتب في النص التالي (رسمي، ودود، عدواني، مهني، إلخ):\n\n${textToAnalyze}`;
          break;
        case 'تلخيص النقاط الرئيسية':
          prompt = `استخرج النقاط الرئيسية والأفكار الأساسية من النص التالي:\n\n${textToAnalyze}`;
          break;
      }
      
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'أنت محلل نصوص خبير. تقوم بتحليل النصوص بدقة وتقدم نتائج مفصلة ومفيدة باللغة العربية.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });
      
      const analysis = completion.data.choices[0]?.message?.content?.trim() || 'لم أتمكن من تحليل النص.';
      setResult(analysis);
    } catch (err) {
      Alert.alert('خطأ', 'حدث خطأ أثناء تحليل النص. تحقق من اتصالك أو المفتاح.');
      setResult('حدث خطأ أثناء تحليل النص.');
    }
    
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>تحليل النصوص</Text>
      <Text style={styles.subHeader}>احصل على تحليل متقدم ومفصل للنصوص والمحتوى</Text>
      
      <Text style={styles.label}>نوع التحليل:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {analysisTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.typeButton, analysisType === type && styles.selectedTypeButton]}
            onPress={() => setAnalysisType(type)}
          >
            <Text style={[styles.typeButtonText, analysisType === type && styles.selectedTypeButtonText]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <Text style={styles.label}>النص المراد تحليله:</Text>
      <TextInput
        style={styles.inputArea}
        value={textToAnalyze}
        onChangeText={setTextToAnalyze}
        placeholder="الصق النص الذي تريد تحليله هنا..."
        placeholderTextColor="#bdbdbd"
        textAlignVertical="top"
        textAlign="right"
        multiline
        editable={!loading}
      />
      
      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleAnalyze} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>حلل النص</Text>
        )}
      </TouchableOpacity>

      {result ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultHeader}>نتيجة التحليل:</Text>
          <Text style={styles.resultText}>{result}</Text>
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
  inputArea: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    color: '#222',
    fontFamily: 'Arial',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ececec',
    minHeight: 150,
    maxHeight: 300,
    writingDirection: 'rtl',
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