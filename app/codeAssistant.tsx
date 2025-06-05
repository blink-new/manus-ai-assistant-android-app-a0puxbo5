import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, I18nManager, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Configuration, OpenAIApi } from 'openai';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function CodeAssistantScreen() {
  const [codeInput, setCodeInput] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [taskType, setTaskType] = useState('شرح الكود');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const languages = ['JavaScript', 'Python', 'Java', 'C++', 'PHP', 'Swift', 'Kotlin', 'React', 'Vue.js', 'Angular'];
  const taskTypes = ['شرح الكود', 'إصلاح الأخطاء', 'تحسين الكود', 'إضافة تعليقات', 'كتابة كود جديد', 'تحويل لغة أخرى'];

  const handleAnalyze = async () => {
    if (!codeInput.trim() || loading) return;
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
      switch(taskType) {
        case 'شرح الكود':
          prompt = `اشرح الكود التالي المكتوب بلغة ${language} بشكل مفصل وواضح باللغة العربية:\n\n${codeInput}`;
          break;
        case 'إصلاح الأخطاء':
          prompt = `ابحث عن الأخطاء في الكود التالي المكتوب بلغة ${language} واقترح الإصلاحات:\n\n${codeInput}`;
          break;
        case 'تحسين الكود':
          prompt = `حسّن الكود التالي المكتوب بلغة ${language} واقترح تحسينات للأداء والقراءة:\n\n${codeInput}`;
          break;
        case 'إضافة تعليقات':
          prompt = `أضف تعليقات مفيدة وواضحة للكود التالي المكتوب بلغة ${language}:\n\n${codeInput}`;
          break;
        case 'كتابة كود جديد':
          prompt = `اكتب كود بلغة ${language} للمهمة التالية:\n\n${codeInput}`;
          break;
        case 'تحويل لغة أخرى':
          prompt = `حوّل الكود التالي إلى لغة ${language}:\n\n${codeInput}`;
          break;
      }
      
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'أنت مساعد برمجة خبير، تقدم مساعدة احترافية في البرمجة والتطوير باللغة العربية. تكتب كود نظيف ومفهوم وتشرح الحلول بوضوح.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      });
      
      const response = completion.data.choices[0]?.message?.content?.trim() || 'لم أتمكن من تحليل الكود.';
      setResult(response);
    } catch (err) {
      Alert.alert('خطأ', 'حدث خطأ أثناء تحليل الكود. تحقق من اتصالك أو المفتاح.');
      setResult('حدث خطأ أثناء تحليل الكود.');
    }
    
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>مساعد الأكواد</Text>
      <Text style={styles.subHeader}>احصل على مساعدة احترافية في البرمجة والتطوير</Text>
      
      <Text style={styles.label}>نوع المهمة:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {taskTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.typeButton, taskType === type && styles.selectedTypeButton]}
            onPress={() => setTaskType(type)}
          >
            <Text style={[styles.typeButtonText, taskType === type && styles.selectedTypeButtonText]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <Text style={styles.label}>لغة البرمجة:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang}
            style={[styles.typeButton, language === lang && styles.selectedTypeButton]}
            onPress={() => setLanguage(lang)}
          >
            <Text style={[styles.typeButtonText, language === lang && styles.selectedTypeButtonText]}>
              {lang}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <Text style={styles.label}>الكود أو الوصف:</Text>
      <TextInput
        style={styles.codeInput}
        value={codeInput}
        onChangeText={setCodeInput}
        placeholder={taskType === 'كتابة كود جديد' ? 'اكتب وصف المهمة التي تريد كتابة كود لها...' : 'الصق الكود هنا...'}
        placeholderTextColor="#bdbdbd"
        textAlignVertical="top"
        textAlign="left"
        multiline
        editable={!loading}
      />
      
      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleAnalyze} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>تحليل الكود</Text>
        )}
      </TouchableOpacity>

      {result ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultHeader}>النتيجة:</Text>
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
  codeInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    fontSize: 14,
    color: '#222',
    fontFamily: 'Courier',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ececec',
    minHeight: 200,
    maxHeight: 300,
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
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Courier',
    lineHeight: 20,
    textAlign: 'left',
  },
});