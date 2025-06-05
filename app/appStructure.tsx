import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, I18nManager, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Configuration, OpenAIApi } from 'openai';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function AppStructureScreen() {
  const [appIdea, setAppIdea] = useState('');
  const [appType, setAppType] = useState('تطبيق موبايل');
  const [targetPlatform, setTargetPlatform] = useState('متعدد المنصات');
  const [complexity, setComplexity] = useState('متوسط');
  const [structurePlan, setStructurePlan] = useState('');
  const [loading, setLoading] = useState(false);

  const appTypes = ['تطبيق موبايل', 'موقع ويب', 'تطبيق سطح المكتب', 'لعبة', 'أداة ويب'];
  const platforms = ['iOS', 'Android', 'متعدد المنصات', 'الويب', 'سطح المكتب'];
  const complexityLevels = ['بسيط', 'متوسط', 'معقد', 'متقدم'];

  const handleGenerateStructure = async () => {
    if (!appIdea.trim() || loading) return;
    setLoading(true);
    setStructurePlan('');
    
    try {
      const apiKey = await AsyncStorage.getItem('OPENAI_API_KEY');
      if (!apiKey) {
        Alert.alert('خطأ', 'يرجى إدخال مفتاح OpenAI API في الإعدادات أولاً.');
        setLoading(false);
        return;
      }
      
      const configuration = new Configuration({ apiKey });
      const openai = new OpenAIApi(configuration);
      
      const prompt = `قم بإنشاء مخطط تفصيلي لهيكل ${appType} بناءً على الفكرة التالية:

الفكرة: ${appIdea}
النوع: ${appType}
المنصة المستهدفة: ${targetPlatform}
مستوى التعقيد: ${complexity}

يرجى تقديم:

1. **الهيكل العام للتطبيق:**
   - الشاشات الرئيسية
   - التنقل بين الشاشات
   - تدفق المستخدم (User Flow)

2. **الميزات الأساسية:**
   - الوظائف الرئيسية
   - الوظائف الثانوية
   - ميزات إضافية مقترحة

3. **التقنيات المقترحة:**
   - لغات البرمجة
   - أطر العمل (Frameworks)
   - قواعد البيانات
   - خدمات السحابة

4. **خطة التطوير:**
   - المراحل الأساسية
   - الأولويات
   - التقدير الزمني التقريبي

5. **اعتبارات التصميم:**
   - واجهة المستخدم
   - تجربة المستخدم
   - الألوان والخطوط المقترحة

6. **التحديات المحتملة:**
   - الصعوبات التقنية
   - الحلول المقترحة`;
      
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'أنت مهندس برمجيات خبير ومصمم تطبيقات محترف. تقوم بإنشاء مخططات تفصيلية وعملية لتطوير التطبيقات.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      });
      
      const structure = completion.data.choices[0]?.message?.content?.trim() || 'لم أتمكن من إنشاء مخطط الهيكل.';
      setStructurePlan(structure);
    } catch (err) {
      Alert.alert('خطأ', 'حدث خطأ أثناء إنشاء مخطط الهيكل. تحقق من اتصالك أو المفتاح.');
      setStructurePlan('حدث خطأ أثناء إنشاء مخطط الهيكل.');
    }
    
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>مخطط هيكل التطبيق</Text>
      <Text style={styles.subHeader}>احصل على مخطط تفصيلي لتطوير تطبيقك من الفكرة إلى التنفيذ</Text>
      
      <Text style={styles.label}>وصف فكرة التطبيق:</Text>
      <TextInput
        style={styles.ideaInput}
        value={appIdea}
        onChangeText={setAppIdea}
        placeholder="اكتب وصفاً مفصلاً لفكرة التطبيق والهدف منه والمشكلة التي يحلها..."
        placeholderTextColor="#bdbdbd"
        textAlignVertical="top"
        textAlign="right"
        multiline
        editable={!loading}
      />
      
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
      
      <Text style={styles.label}>المنصة المستهدفة:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {platforms.map((platform) => (
          <TouchableOpacity
            key={platform}
            style={[styles.typeButton, targetPlatform === platform && styles.selectedTypeButton]}
            onPress={() => setTargetPlatform(platform)}
          >
            <Text style={[styles.typeButtonText, targetPlatform === platform && styles.selectedTypeButtonText]}>
              {platform}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <Text style={styles.label}>مستوى التعقيد:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {complexityLevels.map((level) => (
          <TouchableOpacity
            key={level}
            style={[styles.typeButton, complexity === level && styles.selectedTypeButton]}
            onPress={() => setComplexity(level)}
          >
            <Text style={[styles.typeButtonText, complexity === level && styles.selectedTypeButtonText]}>
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleGenerateStructure} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>أنشئ مخطط الهيكل</Text>
        )}
      </TouchableOpacity>

      {structurePlan ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultHeader}>مخطط هيكل التطبيق:</Text>
          <Text style={styles.resultText}>{structurePlan}</Text>
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
  ideaInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    color: '#222',
    fontFamily: 'Arial',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ececec',
    minHeight: 120,
    maxHeight: 200,
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