import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { resetPassword } from "@/api/auth";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const tokenRef = useRef<string | null>(null);

    const [newPassword, setNewPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const t = params.get("token");
        if (t && t.trim().length > 0) {
            tokenRef.current = t.trim();
            // Query string'i temizle (örn. /reset-password)
            window.history.replaceState({}, "", location.pathname);
        } else {
            setError("Bu bağlantı geçersiz veya süresi dolmuş görünüyor.");
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        const token = tokenRef.current;
        if (!token) {
            setError("Geçersiz veya eksik token. Lütfen yeni bir şifre sıfırlama bağlantısı isteyin.");
            return;
        }
        if (newPassword.length < 6) {
            setError("Şifre en az 6 karakter olmalı.");
            return;
        }

        try {
            setSubmitting(true);
            const res = await resetPassword(token, newPassword);
            if (res.ok) {
                setMessage("Şifren başarıyla güncellendi. Giriş ekranına yönlendiriliyorsun…");
                setNewPassword("");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                setError(res.error || "Şifre sıfırlama başarısız oldu.");
            }
        } catch (err) {
            setError("Beklenmeyen bir hata oluştu.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-200">Yeni Şifre Oluştur</h2>
                <p className="mt-1 text-sm text-gray-400">
                    Güçlü bir şifre belirle, hemen giriş yap.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-sm text-gray-300">
                    Yeni şifre
                    <div className="mt-1 flex items-center rounded-lg border border-gray-600 bg-gray-700 px-3">
                        <Lock className="mr-2 h-4 w-4 text-gray-300" />
                        <input
                            className="w-full bg-transparent py-3 text-white placeholder-gray-400 focus:outline-none"
                            type={showPwd ? "text" : "password"}
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={6}
                            autoFocus
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            aria-label={showPwd ? "Şifreyi gizle" : "Şifreyi göster"}
                            className="ml-2 p-1 text-gray-300 hover:text-gray-100"
                            onClick={() => setShowPwd((s) => !s)}
                        >
                            {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">En az 6 karakter önerilir.</p>
                </label>

                {error && (
                    <div className="rounded-md bg-red-900/40 p-3 text-center text-sm text-red-200">
                        {error}{" "}
                        {tokenRef.current === null && (
                            <>
                                <br />
                                <Link to="/forgot" className="underline hover:text-red-100">
                                    Yeni bağlantı iste
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
                    {submitting ? "Güncelleniyor…" : "Şifreyi Güncelle"}
                </button>
            </form>

            {!message && (
                <div className="text-center text-sm">
                    <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
                        Giriş ekranına dön
                    </Link>
                </div>
            )}
        </div>
    );
}
