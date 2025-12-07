import { AlertCircle, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ErrorBlock({
                                       onRetry,
                                       message,
                                   }: {
    onRetry: () => void;
    message?: string;
}) {
    const { t } = useTranslation();
    const finalMessage = message || t('errors.generic');

    return (
        <div className="card p-6 flex items-center justify-between">
            <div className="flex items-center gap-3 text-red-300">
                <AlertCircle className="h-5 w-5" />
                <span>{finalMessage}</span>
            </div>
            <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600/90 px-4 py-2 text-white hover:bg-indigo-600 transition"
            >
                <RefreshCw className="h-4 w-4" /> {t('common.retry')}
            </button>
        </div>
    );
}