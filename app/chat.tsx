import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, I18nManager, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Configuration, OpenAIApi } from 'openai';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

interface Message {
  from: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { from: 'ai', text: 'مرحباً! أنا مساعد Manus AI المتطور. يمكنني مساعدتك في مختلف المهام من البرمجة إلى الكتابة والتحليل والترجمة وحل المشكلات. كيف يمكنني مساعدتك اليوم؟', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationMode, setConversationMode] = useState('عام');
  const scrollViewRef = useRef<ScrollView>(null);

  const conversationModes = [
    'عام', 'برمجة', 'كتابة', 'ترجمة', 'تحليل', 'حل مشكلات', 'تعليمي', 'إبداعي'
  ];

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const getSystemPrompt = (mode: string) => {
    const prompts = {
      'عام': 'أنت مساعد ذكي متعدد المهارات، تقدم إجابات مفيدة ودقيقة باللغة العربية.',
      'برمجة': 'أنت خبير برمجة متخصص، تساعد في كتابة وتحسين وشرح الأكواد بمختلف لغات البرمجة.',
      'كتابة': 'أنت كاتب محترف، تساعد في إنشاء محتوى عالي الجودة بأساليب مختلفة.',
      'ترجمة': 'أنت مترجم محترف، تترجم النصوص بدقة مع الحفاظ على المعنى والسياق.',
      'تحليل': 'أنت محلل خبير، تحلل النصوص والبيانات وتستخرج الأفكار والنتائج المهمة.',
      'حل مشكلات': 'أنت مستشار خبير في حل المشكلات، تقدم حلول عملية ومنطقية.',
      'تعليمي': 'أنت معلم خبير، تشرح المفاهيم بطريقة بسيطة وواضحة مع أمثلة عملية.',
      'إبداعي': 'أنت مبدع متخصص، تساعد في توليد أفكار إبداعية وحلول مبتكرة.'
    };
    return prompts[mode] || prompts['عام'];
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage: Message = { 
      from: 'user', 
      text: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      const apiKey = await AsyncStorage.getItem('OPENAI_API_KEY');
      if (!apiKey) {
        Alert.alert('خطأ', 'يرجى إدخال مفتاح OpenAI API في الإعدادات أولاً.');
        const errorMessage: Message = {
          from: 'ai',
          text: 'يرجى إدخال مفتاح OpenAI API في الإعدادات أولاً.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        setLoading(false);
        return;
      }
      
      const configuration = new Configuration({ apiKey });
      const openai = new OpenAIApi(configuration);
      
      // Build conversation history
      const chatHistory = messages.map(m => ({ 
        role: m.from === 'user' ? 'user' : 'assistant', 
        content: m.text 
      }));
      chatHistory.push({ role: 'user', content: input });
      
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: getSystemPrompt(conversationMode) },
          ...chatHistory
        ],
        temperature: conversationMode === 'إبداعي' ? 0.9 : 0.7,
        max_tokens: 2000,
      });
      
      const aiText = completion.data.choices[0]?.message?.content?.trim() || 'لم أتمكن من توليد رد.';
      const aiMessage: Message = {
        from: 'ai',
        text: aiText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage: Message = {
        from: 'ai',
        text: 'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. تحقق من اتصالك أو المفتاح.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setLoading(false);
  };

  const clearChat = () => {
    Alert.alert(
      'مسح المحادثة',
      'هل أنت متأكد من رغبتك في مسح جميع الرسائل؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'مسح', style: 'destructive', onPress: () => {
          setMessages([{
            from: 'ai',
            text: 'مرحباً! تم بدء محادثة جديدة. كيف يمكنني مساعدتك؟',
            timestamp: new Date()
          }]);
        }}
      ]
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#f9fafb' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.headerBox}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.clearButton} onPress={clearChat}>
            <Text style={styles.clearButtonText}>🗑️</Text>
          </TouchableOpacity>
          <Text style={styles.header}>دردشة Manus AI</Text>
          <View style={styles.placeholder} />
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modeScroll}>
          {conversationModes.map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[styles.modeButton, conversationMode === mode && styles.selectedModeButton]}
              onPress={() => setConversationMode(mode)}
            >
              <Text style={[styles.modeButtonText, conversationMode === mode && styles.selectedModeButtonText]}>
                {mode}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={{ padding: 20, paddingBottom: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, idx) => (
          <View key={idx} style={[styles.messageContainer, msg.from === 'user' ? styles.userMessageContainer : styles.aiMessageContainer]}>
            <View style={[styles.bubble, msg.from === 'user' ? styles.userBubble : styles.aiBubble]}>
              <Text style={[styles.bubbleText, msg.from === 'user' ? styles.userBubbleText : styles.aiBubbleText]}>
                {msg.text}
              </Text>
            </View>
            <Text style={[styles.timestamp, msg.from === 'user' ? styles.userTimestamp : styles.aiTimestamp]}>
              {formatTime(msg.timestamp)}
            </Text>
          </View>
        ))}
        {loading && (
          <View style={[styles.messageContainer, styles.aiMessageContainer]}>
            <View style={[styles.bubble, styles.aiBubble, styles.loadingBubble]}>
              <ActivityIndicator size="small" color="#2563eb" />
              <Text style={styles.loadingText}>يفكر...</Text>
            </View>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TouchableOpacity 
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]} 
            onPress={sendMessage} 
            disabled={!input.trim() || loading}
          >
            <Text style={styles.sendBtnText}>
              {loading ? '⏳' : '📤'}
            </Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="اكتب رسالتك..."
            placeholderTextColor="#bdbdbd"
            textAlign="right"
            multiline
            maxLength={1000}
            editable={!loading}
            onSubmitEditing={sendMessage}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerBox: {
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    fontFamily: 'Arial',
  },
  clearButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  clearButtonText: {
    fontSize: 18,
  },
  placeholder: {
    width: 36,
  },
  modeScroll: {
    paddingHorizontal: 20,
  },
  modeButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedModeButton: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  modeButtonText: {
    color: '#374151',
    fontSize: 14,
    fontFamily: 'Arial',
  },
  selectedModeButtonText: {
    color: '#fff',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '85%',
    padding: 16,
    borderRadius: 20,
    marginBottom: 4,
  },
  userBubble: {
    backgroundColor: '#2563eb',
    borderTopRightRadius: 6,
  },
  aiBubble: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  bubbleText: {
    fontSize: 16,
    fontFamily: 'Arial',
    lineHeight: 24,
  },
  userBubbleText: {
    color: '#fff',
    textAlign: 'right',
  },
  aiBubbleText: {
    color: '#111827',
    textAlign: 'right',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: 14,
    marginLeft: 8,
    fontFamily: 'Arial',
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
    fontFamily: 'Arial',
  },
  userTimestamp: {
    textAlign: 'right',
  },
  aiTimestamp: {
    textAlign: 'left',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
  },
  inputRow: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: '#f9fafb',
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Arial',
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    writingDirection: 'rtl',
  },
  sendBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#9ca3af',
  },
  sendBtnText: {
    fontSize: 18,
  },
});