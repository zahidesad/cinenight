import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "@/api/auth";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ResetPasswordPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const tokenRef = useRef<string | null>(null);

    const [newPassword, setNewPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tkn = params.get("token");
        if (tkn && tkn.trim().length > 0) {
            tokenRef.current = tkn.trim();
            window.history.replaceState({}, "", location.pathname);
        } else {
            setError(t('auth.pages.reset_password.error_token'));
        }
    }, [location, t]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        const token = tokenRef.current;
        if (!token) {
            setError(t('auth.pages.reset_password.error_missing_token'));
            return;
        }
        if (newPassword.length < 6) {
            setError(t('auth.validation.password_min'));
            return;
        }

        try {
            setSubmitting(true);
            const res = await resetPassword(token, newPassword);
            if (res.ok) {
                setMessage(t('auth.pages.reset_password.success'));
                setNewPassword("");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                setError(res.error || t('auth.pages.reset_password.error_generic'));
            }
        } catch (err) {
            setError(t('errors.unexpected'));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-200">{t('auth.pages.reset_password.title')}</h2>
                <p className="mt-1 text-sm text-gray-400">
                    {t('auth.pages.reset_password.subtitle')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-sm text-gray-300">
                    {t('auth.fields.new_password')}
                    <div className="mt-1 flex items-center rounded-lg border border-gray-600 bg-gray-700 px-3">
                        <Lock className="mr-2 h-4 w-4 text-gray-300" />
                        <input
                            className="w-full bg-transparent py-3 text-white placeholder-gray-400 focus:outline-none"
                            type={showPwd ? "text" : "password"}
                            placeholder={t('auth.fields.password_placeholder')}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={6}
                            autoFocus
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            aria-label={showPwd ? t('auth.aria.hide_password') : t('auth.aria.show_password')}
                            className="ml-2 p-1 text-gray-300 hover:text-gray-100"
                            onClick={() => setShowPwd((s) => !s)}
                        >
                            {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">{t('auth.fields.password_hint')}</p>
                </label>

                {error && (
                    <div className="rounded-md bg-red-900/40 p-3 text-center text-sm text-red-200">
                        {error}{" "}
                        {tokenRef.current === null && (
                            <>
                                <br />
                                <Link to="/forgot-password" className="underline hover:text-red-100">
                                    {t('auth.pages.reset_password.new_link')}
                                </Link>
                            </>
                        )}
                    </div>
                )}
                {message && (
                    <div className="rounded-md bg-emerald-900/30 p-3 text-center text-sm text-emerald-200">
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                >
                    {submitting ? t('auth.pages.reset_password.submitting') : t('auth.pages.reset_password.submit')}
                </button>
            </form>

            {!message && (
                <div className="text-center text-sm">
                    <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
                        {t('auth.pages.forgot_password.back_to_login')}
                    </Link>
                </div>
            )}
        </div>
    );
}