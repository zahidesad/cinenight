import { AlertTriangle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'primary';
    loading?: boolean;
};

export default function ConfirmModal({
                                         isOpen,
                                         onClose,
                                         onConfirm,
                                         title,
                                         description,
                                         confirmText,
                                         cancelText,
                                         variant = 'primary',
                                         loading = false
                                     }: Props) {
    const { t } = useTranslation();

    if (!isOpen) return null;

    const txtConfirm = confirmText || t('common.confirm');
    const txtCancel = cancelText || t('common.cancel');

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
                className="w-full max-w-sm rounded-2xl border border-white/10 bg-gray-900 p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col items-center text-center gap-4">
                    <div className={`p-3 rounded-full ${variant === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                        <AlertTriangle className="h-8 w-8" />
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-white">{title}</h3>
                        <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <div className="flex gap-3 w-full mt-2">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition disabled:opacity-50"
                        >
                            {txtCancel}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className={`flex-1 py-2.5 rounded-xl text-white font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 ${
                                variant === 'danger'
                                    ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/20'
                                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-900/20'
                            }`}
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {txtConfirm}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}