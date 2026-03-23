import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminApi } from "../../../api/adminApi";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
export default function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError(t("AUTH.FILL_ALL_FIELDS"));
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await adminApi.register({ name, email, password });
      navigate("/login-admin");
    } catch (err) {
      setError(t("AUTH.REGISTER_ERROR"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-[#e8e6e1] px-4">
      {/* Language switcher (top right) */}
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-sm p-8 bg-[#1e1e24] rounded-2xl shadow-xl border border-white/5">
        {/* Title */}
        <h2 className="text-2xl font-bold mb-8 text-center tracking-tight">
          {t("AUTH.REGISTER_TITLE")}
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
          {/* Name input */}
          <input
            className="input-dark w-full px-4 py-3 mb-0 border border-white/100 rounded-lg focus:border-blue-500 focus:outline-none transition-all"
            placeholder={t("AUTH.NAME")}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Email input */}
          <input
            className="input-dark w-full px-4 py-3 border border-white/100 rounded-lg focus:border-blue-500 focus:outline-none transition-all"
            placeholder={t("AUTH.EMAIL")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password input */}
          <input
            className="input-dark w-full px-4 py-3 border border-white/100 rounded-lg focus:border-blue-500 focus:outline-none transition-all"
            type="password"
            placeholder={t("AUTH.PASSWORD")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Register button */}
          <button
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg shadow-blue-600/20"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner label={t("AUTH.REGISTERING")} />
            ) : (
              t("AUTH.REGISTER")
            )}
          </button>
        </div>

        {/* Login link */}
        <p className="text-center mt-8 text-sm text-gray-400">
          {t("AUTH.HAVE_ACCOUNT")}{" "}
          <Link
            to="/login-admin"
            className="text-blue-500 hover:text-blue-400 font-medium hover:underline transition-colors"
          >
            {t("AUTH.LOGIN")}
          </Link>
        </p>
      </div>
    </div>
  );
}
