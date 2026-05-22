import { useSelector } from 'react-redux';
import { translations } from './translations';

export const useTranslation = () => {
  const language = useSelector((state) => state.user.currentUser?.preferredLanguage) || 'vi';
  
  const t = (key) => {
    return translations[language]?.[key] || translations['vi'][key] || key;
  };

  return { t, language };
};
