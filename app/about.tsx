import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import CapabilityCard from '../components/CapabilityCard';

const capabilities = [
  {
    title: 'معالجة المعلومات',
    description: 'الإجابة على الأسئلة، البحث، التحقق من الحقائق، تلخيص المعلومات، تحليل البيانات.'
  },
  {
    title: 'إنشاء المحتوى',
    description: 'كتابة المقالات، الرسائل، الأكواد، المحتوى الإبداعي، وتنسيق المستندات.'
  },
  {
    title: 'حل المشكلات',
    description: 'تفكيك المشكلات، تقديم حلول خطوة بخطوة، تصحيح الأخطاء، اقتراح بدائل، التكيف مع المتغيرات.'
  },
  {
    title: 'التصفح والبحث',
    description: 'التنقل في المواقع، استخراج المحتوى، التفاعل مع العناصر، تنفيذ جافاسكريبت، مراقبة التحديثات.'
  },
  {
    title: 'إدارة الملفات',
    description: 'قراءة وكتابة الملفات، البحث، تنظيم المجلدات، ضغط الملفات، تحويل الصيغ.'
  },
  {
    title: 'أدوات التواصل',
    description: 'إرسال الرسائل، طرح الأسئلة، تحديثات التقدم، إرفاق الملفات، اقتراح الخطوات التالية.'
  },
  {
    title: 'النشر والتوزيع',
    description: 'فتح المنافذ، نشر المواقع والتطبيقات، توفير روابط الوصول، مراقبة الأداء.'
  }
];

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>حول مساعد Manus AI</Text>
      <Text style={styles.subHeader}>تطبيق مساعد ذكي متعدد القدرات باللغة العربية، مصمم لمساعدتك في إنجاز مهامك بكفاءة وفعالية.</Text>
      {capabilities.map((cap, index) => (
        <CapabilityCard key={index} title={cap.title} description={cap.description} />
      ))}
      <Text style={styles.footer}>تم تطوير هذا التطبيق ليكون مساعدك الذكي في مختلف المهام اليومية والمهنية.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Arial',
  },
  subHeader: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Arial',
    lineHeight: 26,
  },
  footer: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 40,
    fontFamily: 'Arial',
  },
});
