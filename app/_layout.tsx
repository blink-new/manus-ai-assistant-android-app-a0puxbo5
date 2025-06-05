import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Tabs } from 'expo-router';
import { I18nManager } from 'react-native';

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#2563eb',
          tabBarInactiveTintColor: '#6b7280',
          tabBarLabelStyle: { fontFamily: 'Arial', fontSize: 12, paddingBottom: 4 },
          tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#ececec', height: 65, paddingTop: 5 },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: 'الأدوات',
            title: 'الأدوات',
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            tabBarLabel: 'الدردشة',
            title: 'الدردشة',
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            tabBarLabel: 'حول التطبيق',
            title: 'حول التطبيق',
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarLabel: 'الإعدادات',
            title: 'الإعدادات',
          }}
        />
        
        {/* Hidden screens - accessed via tools screen */}
        <Tabs.Screen
          name="summarize"
          options={{
            href: null,
            title: 'تلخيص النصوص',
          }}
        />
        <Tabs.Screen
          name="contentGenerator"
          options={{
            href: null,
            title: 'إنشاء المحتوى',
          }}
        />
        <Tabs.Screen
          name="codeAssistant"
          options={{
            href: null,
            title: 'مساعد الأكواد',
          }}
        />
        <Tabs.Screen
          name="textAnalysis"
          options={{
            href: null,
            title: 'تحليل النصوص',
          }}
        />
        <Tabs.Screen
          name="translator"
          options={{
            href: null,
            title: 'الترجمة الذكية',
          }}
        />
        <Tabs.Screen
          name="appIdeas"
          options={{
            href: null,
            title: 'مولد أفكار التطبيقات',
          }}
        />
        <Tabs.Screen
          name="appStructure"
          options={{
            href: null,
            title: 'مخطط هيكل التطبيق',
          }}
        />
        <Tabs.Screen
          name="problemSolver"
          options={{
            href: null,
            title: 'حل المشكلات',
          }}
        />
        <Tabs.Screen
          name="tools"
          options={{
            href: null,
            title: 'الأدوات',
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}