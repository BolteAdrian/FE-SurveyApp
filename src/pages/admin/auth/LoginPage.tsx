import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { adminApi } from "../../../api/adminApi";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import { LoadingSpinner } from "../../../components/LoadingSpinner";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError(t("AUTH.FILL_ALL_FIELDS"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.login({ email, password });
      login(data.token, data.user);
      navigate("/admin");
    } catch (err) {
      setError(t("AUTH.INVALID_CREDENTIALS"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#111114] text-[#e8e6e1] px-4 md:px-0">
      {/* Language switcher (top right) */}
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-sm p-8 bg-[#1e1e24] rounded-2xl shadow-xl border border-white/5">
        {/* Title */}
        <h2 className="text-2xl font-bold mb-8 text-center tracking-tight">
          {t("AUTH.LOGIN_TITLE")}
        </h2>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm text-center font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Form container */}
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <input
              className="input-dark w-full px-4 py-3 bg-[#111114] border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none transition-all"
              placeholder={t("AUTH.EMAIL")}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <input
              className="input-dark w-full px-4 py-3 bg-[#111114] border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none transition-all"
              type="password"
              placeholder={t("AUTH.PASSWORD")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login button */}
          <button
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg shadow-blue-600/20"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner label={t("AUTH.LOGGING_IN")} />
            ) : (
              t("AUTH.LOGIN")
            )}
          </button>
        </div>

        {/* Register link */}
        <p className="text-center mt-8 text-sm text-gray-400">
          {t("AUTH.NO_ACCOUNT")}{" "}
          <Link
            to="/register-admin"
            className="text-blue-500 hover:text-blue-400 font-medium hover:underline transition-colors"
          >
            {t("AUTH.REGISTER")}
          </Link>
        </p>
      </div>
    </div>
  );
}
