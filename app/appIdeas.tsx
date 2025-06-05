import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, I18nManager, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Configuration, OpenAIApi } from 'openai';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function AppIdeasScreen() {
  const [interests, setInterests] = useState('');
  const [problemToSolve, setProblemToSolve] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [appType, setAppType] = useState('تطبيق موبايل');
  const [generatedIdeas, setGeneratedIdeas] = useState('');
  const [loading, setLoading] = useState(false);

  const appTypes = ['تطبيق موبايل', 'موقع ويب', 'تطبيق سطح المكتب', 'لعبة', 'أداة ويب', 'تطبيق ذكي'];

  const handleGenerateIdeas = async () => {
    if ((!interests.trim() && !problemToSolve.trim()) || loading) return;
    setLoading(true);
    setGeneratedIdeas('');
    
    try {
      const apiKey = await AsyncStorage.getItem('OPENAI_API_KEY');
      if (!apiKey) {
        Alert.alert('خطأ', 'يرجى إدخال مفتاح OpenAI API في الإعدادات أولاً.');
        setLoading(false);
        return;
      }
      
      const configuration = new Configuration({ apiKey });
      const openai = new OpenAIApi(configuration);
      
      let prompt = `أنشئ 5 أفكار إبداعية ومبتكرة لـ ${appType} بناءً على المعلومات التالية:\n\n`;
      
      if (interests.trim()) {
        prompt += `الاهتمامات والمجالات: ${interests}\n`;
      }
      
      if (problemToSolve.trim()) {
        prompt += `المشكلة المراد حلها: ${problemToSolve}\n`;
      }
      
      if (targetAudience.trim()) {
        prompt += `الجمهور المستهدف: ${targetAudience}\n`;
      }
      
      prompt += `\nلكل فكرة، قدم:\n1. اسم التطبيق\n2. وصف موجز للفكرة\n3. الميزات الرئيسية\n4. الفائدة للمستخدمين\n5. تقدير مستوى الصعوبة في التطوير`;
      
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'أنت خبير في تطوير التطبيقات ورائد أعمال مبدع. تولد أفكار تطبيقات مبتكرة وعملية وقابلة للتنفيذ.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 2500,
      });
      
      const ideas = completion.data.choices[0]?.message?.content?.trim() || 'لم أتمكن من توليد أفكار التطبيقات.';
      setGeneratedIdeas(ideas);
    } catch (err) {
      Alert.alert('خطأ', 'حدث خطأ أثناء توليد الأفكار. تحقق من اتصالك أو المفتاح.');
      setGeneratedIdeas('حدث خطأ أثناء توليد الأفكار.');
    }
    
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>مولد أفكار التطبيقات</Text>
      <Text style={styles.subHeader}>احصل على أفكار إبداعية ومبتكرة لتطبيقات جديدة</Text>
      
      <Text style={styles.label}>نوع التطبيق:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {appTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.typeButton, appType === type && styles.selectedTypeButton]}
            onPress={() => setAppType(type)}
          >
            <Text style={[styles.typeButtonText, appType === type && styles.selectedTypeButtonText]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <Text style={styles.label}>اهتماماتك ومجالاتك المفضلة:</Text>
      <TextInput
        style={styles.input}
        value={interests}
        onChangeText={setInterests}
        placeholder="مثال: التكنولوجيا، الصحة، التعليم، الألعاب، المالية..."
        placeholderTextColor="#bdbdbd"
        textAlign="right"
        editable={!loading}
      />
      
      <Text style={styles.label}>مشكلة تريد حلها (اختيارية):</Text>
      <TextInput
        style={styles.input}
        value={problemToSolve}
        onChangeText={setProblemToSolve}
        placeholder="وصف المشكلة التي تواجهها أو تراها في حياتك اليومية..."
        placeholderTextColor="#bdbdbd"
        textAlign="right"
        multiline
        editable={!loading}
      />
      
      <Text style={styles.label}>الجمهور المستهدف (اختيارية):</Text>
      <TextInput
        style={styles.input}
        value={targetAudience}
        onChangeText={setTargetAudience}
        placeholder="مثال: الطلاب، العاملين، كبار السن، الأطفال..."
        placeholderTextColor="#bdbdbd"
        textAlign="right"
        editable={!loading}
      />
      
      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleGenerateIdeas} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>ولّد أفكار التطبيقات</Text>
        )}
      </TouchableOpacity>

      {generatedIdeas ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultHeader}>أفكار التطبيقات المقترحة:</Text>
          <Text style={styles.resultText}>{generatedIdeas}</Text>
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
    minHeight: 44,
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