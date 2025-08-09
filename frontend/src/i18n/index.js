import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.transactions': 'Transactions',
      'nav.analytics': 'Analytics',
      'nav.notifications': 'Notifications',
      'nav.profile': 'Profile',
      
      // Dashboard
      'dashboard.title': 'Dashboard',
      'dashboard.subtitle': 'Real-time insights into UPI payment failures and AI-powered diagnostics',
      'dashboard.totalTransactions': 'Total Transactions',
      'dashboard.failedTransactions': 'Failed Transactions',
      'dashboard.successRate': 'Success Rate',
      'dashboard.avgResolutionTime': 'Avg Resolution Time',
      
      // Transactions
      'transactions.title': 'Transactions',
      'transactions.search': 'Search transactions...',
      'transactions.noResults': 'No transactions found',
      'transactions.export': 'Export',
      'transactions.refresh': 'Refresh',
      
      // Diagnosis
      'diagnosis.title': 'AI Diagnosis',
      'diagnosis.analyzing': 'Analyzing Transaction...',
      'diagnosis.confidence': 'Confidence',
      'diagnosis.userGuidance': 'What You Should Do',
      'diagnosis.technicalDetails': 'Technical Details',
      'diagnosis.resolutionSteps': 'Step-by-Step Solution',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.warning': 'Warning',
      'common.info': 'Information',
      'common.close': 'Close',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.edit': 'Edit',
      'common.delete': 'Delete',
    }
  },
  hi: {
    translation: {
      // Navigation
      'nav.dashboard': 'डैशबोर्ड',
      'nav.transactions': 'लेन-देन',
      'nav.analytics': 'विश्लेषण',
      'nav.notifications': 'सूचनाएं',
      'nav.profile': 'प्रोफ़ाइल',
      
      // Dashboard
      'dashboard.title': 'डैशबोर्ड',
      'dashboard.subtitle': 'UPI भुगतान विफलताओं और AI-संचालित निदान में वास्तविक समय की अंतर्दृष्टि',
      'dashboard.totalTransactions': 'कुल लेन-देन',
      'dashboard.failedTransactions': 'असफल लेन-देन',
      'dashboard.successRate': 'सफलता दर',
      'dashboard.avgResolutionTime': 'औसत समाधान समय',
      
      // Transactions
      'transactions.title': 'लेन-देन',
      'transactions.search': 'लेन-देन खोजें...',
      'transactions.noResults': 'कोई लेन-देन नहीं मिला',
      'transactions.export': 'निर्यात',
      'transactions.refresh': 'रीफ्रेश',
      
      // Diagnosis
      'diagnosis.title': 'AI निदान',
      'diagnosis.analyzing': 'लेन-देन का विश्लेषण...',
      'diagnosis.confidence': 'विश्वास',
      'diagnosis.userGuidance': 'आपको क्या करना चाहिए',
      'diagnosis.technicalDetails': 'तकनीकी विवरण',
      'diagnosis.resolutionSteps': 'चरणबद्ध समाधान',
      
      // Common
      'common.loading': 'लोड हो रहा है...',
      'common.error': 'त्रुटि',
      'common.success': 'सफलता',
      'common.warning': 'चेतावनी',
      'common.info': 'जानकारी',
      'common.close': 'बंद करें',
      'common.save': 'सहेजें',
      'common.cancel': 'रद्द करें',
      'common.edit': 'संपादित करें',
      'common.delete': 'हटाएं',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;