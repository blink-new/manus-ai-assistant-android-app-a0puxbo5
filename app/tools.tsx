import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

interface ToolCardProps {
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
  color?: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ title, description, icon, onPress, color = '#2563eb' }) => {
  return (
    <TouchableOpacity style={[styles.toolCard, { borderLeftColor: color }]} onPress={onPress}>
      <Text style={styles.toolIcon}>{icon}</Text>
      <Text style={styles.toolTitle}>{title}</Text>
      <Text style={styles.toolDescription}>{description}</Text>
    </TouchableOpacity>
  );
};

export default function ToolsScreen() {
  const router = useRouter();

  const tools = [
    {
      title: 'تلخيص النصوص',
      description: 'لخّص المقالات والمستندات الطويلة بسرعة ودقة عالية.',
      icon: '📄',
      action: () => router.push('/summarize'),
      color: '#2563eb',
    },
    {
      title: 'إنشاء المحتوى',
      description: 'اكتب مقالات، رسائل، ومحتوى إبداعي بمساعدة الذكاء الاصطناعي.',
      icon: '✍️',
      action: () => router.push('/contentGenerator'),
      color: '#059669',
    },
    {
      title: 'مساعد الأكواد',
      description: 'احصل على مساعدة في البرمجة، إصلاح الأخطاء، وتحسين الكود.',
      icon: '💻',
      action: () => router.push('/codeAssistant'),
      color: '#7c3aed',
    },
    {
      title: 'تحليل النصوص',
      description: 'حلل المشاعر، استخرج الكلمات المفتاحية، وحدد الكيانات.',
      icon: '📊',
      action: () => router.push('/textAnalysis'),
      color: '#dc2626',
    },
    {
      title: 'الترجمة الذكية',
      description: 'ترجم النصوص بدقة عالية بين اللغات المختلفة.',
      icon: '🌐',
      action: () => router.push('/translator'),
      color: '#0891b2',
    },
    {
      title: 'مولد أفكار التطبيقات',
      description: 'احصل على أفكار إبداعية ومبتكرة لتطبيقات جديدة.',
      icon: '💡',
      action: () => router.push('/appIdeas'),
      color: '#ea580c',
    },
    {
      title: 'مخطط هيكل التطبيق',
      description: 'أنشئ مخططاً تفصيلياً لتطوير التطبيقات من الفكرة إلى التنفيذ.',
      icon: '🏗️',
      action: () => router.push('/appStructure'),
      color: '#16a34a',
    },
    {
      title: 'حل المشكلات',
      description: 'احصل على تحليل شامل وحلول عملية للمشاكل المختلفة.',
      icon: '🧠',
      action: () => router.push('/problemSolver'),
      color: '#9333ea',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>أدوات Manus AI</Text>
      <Text style={styles.subHeader}>مجموعة شاملة من الأدوات الذكية لمساعدتك في مهامك المختلفة</Text>
      
      <View style={styles.toolsGrid}>
        {tools.map((tool, index) => (
          <ToolCard
            key={index}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            onPress={tool.action}
            color={tool.color}
          />
        ))}
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡 نصيحة: تأكد من إدخال مفتاح OpenAI API في الإعدادات للحصول على أفضل النتائج
        </Text>
      </View>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
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
  toolsGrid: {
    gap: 16,
  },
  toolCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  toolIcon: {
    fontSize: 36,
    marginBottom: 12,
    textAlign: 'center',
  },
  toolTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    fontFamily: 'Arial',
    textAlign: 'center',
  },
  toolDescription: {
    fontSize: 15,
    color: '#4b5563',
    fontFamily: 'Arial',
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#0369a1',
    fontFamily: 'Arial',
    textAlign: 'center',
    lineHeight: 20,
  },
});