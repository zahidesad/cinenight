import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={() => changeLanguage('tr')}
                className={`text-xs ${i18n.language === 'tr' ? 'font-bold text-white' : 'text-gray-400'}`}
            >
                TR
            </button>
            <span className="text-gray-600">|</span>
            <button
                onClick={() => changeLanguage('en')}
                className={`text-xs ${i18n.language === 'en' ? 'font-bold text-white' : 'text-gray-400'}`}
            >
                EN
            </button>
        </div>
    );
}