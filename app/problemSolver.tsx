import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, I18nManager, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Configuration, OpenAIApi } from 'openai';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function ProblemSolverScreen() {
  const [problemDescription, setProblemDescription] = useState('');
  const [problemType, setProblemType] = useState('عام');
  const [urgency, setUrgency] = useState('متوسط');
  const [solution, setSolution] = useState('');
  const [loading, setLoading] = useState(false);

  const problemTypes = [
    'عام', 'تقني', 'شخصي', 'عملي', 'تعليمي', 'مالي', 'صحي', 'إبداعي'
  ];
  
  const urgencyLevels = ['منخفض', 'متوسط', 'عالي', 'عاجل'];

  const handleSolveProblem = async () => {
    if (!problemDescription.trim() || loading) return;
    setLoading(true);
    setSolution('');
    
    try {
      const apiKey = await AsyncStorage.getItem('OPENAI_API_KEY');
      if (!apiKey) {
        Alert.alert('خطأ', 'يرجى إدخال مفتاح OpenAI API في الإعدادات أولاً.');
        setLoading(false);
        return;
      }
      
      const configuration = new Configuration({ apiKey });
      const openai = new OpenAIApi(configuration);
      
      const prompt = `أحتاج مساعدة في حل المشكلة التالية:

**وصف المشكلة:** ${problemDescription}
**نوع المشكلة:** ${problemType}
**مستوى الأولوية:** ${urgency}

يرجى تقديم:

1. **تحليل المشكلة:**
   - الأسباب المحتملة
   - تفكيك المشكلة إلى أجزاء أصغر
   - النقاط الحرجة التي تحتاج انتباه

2. **الحلول المقترحة:**
   - الحل الأمثل (مع التبرير)
   - حلول بديلة
   - إيجابيات وسلبيات كل حل

3. **خطة العمل:**
   - الخطوات المطلوبة بالتسلسل
   - الموارد المطلوبة
   - الجدول الزمني المقترح

4. **التحديات المتوقعة:**
   - العقبات المحتملة
   - كيفية التعامل معها
   - خطط الطوارئ

5. **طرق القياس:**
   - كيفية معرفة نجاح الحل
   - مؤشرات الأداء
   - نقاط المراجعة

6. **نصائح إضافية:**
   - أفضل الممارسات
   - موارد مفيدة للمساعدة`;
      
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'أنت مستشار خبير في حل المشكلات والتفكير النقدي. تقدم حلول عملية ومنطقية ومبتكرة للمشاكل المختلفة.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      });
      
      const problemSolution = completion.data.choices[0]?.message?.content?.trim() || 'لم أتمكن من تحليل المشكلة وتقديم حل.';
      setSolution(problemSolution);
    } catch (err) {
      Alert.alert('خطأ', 'حدث خطأ أثناء تحليل المشكلة. تحقق من اتصالك أو المفتاح.');
      setSolution('حدث خطأ أثناء تحليل المشكلة.');
    }
    
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>حل المشكلات</Text>
      <Text style={styles.subHeader}>احصل على تحليل شامل وحلول عملية لمشاكلك</Text>
      
      <Text style={styles.label}>وصف المشكلة:</Text>
      <TextInput
        style={styles.problemInput}
        value={problemDescription}
        onChangeText={setProblemDescription}
        placeholder="اكتب وصفاً مفصلاً للمشكلة التي تواجهها، اذكر السياق والتفاصيل المهمة..."
        placeholderTextColor="#bdbdbd"
        textAlignVertical="top"
        textAlign="right"
        multiline
        editable={!loading}
      />
      
      <Text style={styles.label}>نوع المشكلة:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {problemTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.typeButton, problemType === type && styles.selectedTypeButton]}
            onPress={() => setProblemType(type)}
          >
            <Text style={[styles.typeButtonText, problemType === type && styles.selectedTypeButtonText]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <Text style={styles.label}>مستوى الأولوية:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {urgencyLevels.map((level) => (
          <TouchableOpacity
            key={level}
            style={[styles.typeButton, urgency === level && styles.selectedTypeButton]}
            onPress={() => setUrgency(level)}
          >
            <Text style={[styles.typeButtonText, urgency === level && styles.selectedTypeButtonText]}>
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSolveProblem} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>حلل المشكلة</Text>
        )}
      </TouchableOpacity>

      {solution ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultHeader}>تحليل المشكلة والحلول المقترحة:</Text>
          <Text style={styles.resultText}>{solution}</Text>
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
  problemInput: {
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
    maxHeight: 250,
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
    fontSize: 14,
    color: '#374151',
    fontFamily: 'Arial',
    lineHeight: 22,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});