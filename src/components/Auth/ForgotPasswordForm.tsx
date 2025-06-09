import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface ForgotPasswordFormProps {
  onToggleMode: (mode: 'login' | 'register' | 'forgot') => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onToggleMode }) => {
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { sendOTP, verifyOTP, resetPassword, isLoading } = useAuth();

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email) {
      setError('يرجى إدخال البريد الإلكتروني');
      return;
    }

    const success = await sendOTP(formData.email);
    if (success) {
      setSuccess('تم إرسال رمز التحقق إلى بريدك الإلكتروني');
      setStep('otp');
    } else {
      setError('حدث خطأ أثناء إرسال رمز التحقق');
    }
  };

  const handleSubmitOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.otp || formData.otp.length !== 6) {
      setError('يرجى إدخال رمز التحقق المكون من 6 أرقام');
      return;
    }

    const success = await verifyOTP(formData.email, formData.otp);
    if (success) {
      setStep('password');
    } else {
      setError('رمز التحقق غير صحيح');
    }
  };

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.newPassword || !formData.confirmPassword) {
      setError('يرجى ملء جميع الحقول');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    const success = await resetPassword(formData.email, formData.newPassword);
    if (success) {
      setSuccess('تم تغيير كلمة المرور بنجاح');
      setTimeout(() => onToggleMode('login'), 2000);
    } else {
      setError('حدث خطأ أثناء تغيير كلمة المرور');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-emerald-600 mb-2">
            <i className="fas fa-graduation-cap ml-2"></i>
            StageFlow
          </h1>
          <p className="text-gray-600 mb-8">بساطة إدارة التدريب من الدخول إلى التصدير</p>
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 'email' && 'استعادة كلمة المرور'}
            {step === 'otp' && 'تحقق من الرمز'}
            {step === 'password' && 'كلمة مرور جديدة'}
          </h2>
          <p className="text-gray-600 mt-2">
            {step === 'email' && 'أدخل بريدك الإلكتروني لإرسال رمز التحقق'}
            {step === 'otp' && 'أدخل رمز التحقق المرسل إلى بريدك'}
            {step === 'password' && 'أدخل كلمة المرور الجديدة'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <i className="fas fa-exclamation-circle ml-2"></i>
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <i className="fas fa-check-circle ml-2"></i>
            {success}
          </div>
        )}

        {step === 'email' && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmitEmail}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input-field pr-10"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={formData.email}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-gray-400"></i>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary"
            >
              {isLoading ? (
                <>
                  <div className="spinner ml-2"></div>
                  جارٍ الإرسال...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane ml-2"></i>
                  إرسال رمز التحقق
                </>
              )}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmitOTP}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                رمز التحقق
              </label>
              <div className="relative">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  maxLength={6}
                  required
                  className="input-field pr-10 text-center ltr"
                  placeholder="123456"
                  value={formData.otp}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className="fas fa-key text-gray-400"></i>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                تم إرسال رمز مكون من 6 أرقام إلى {formData.email}
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary"
            >
              {isLoading ? (
                <>
                  <div className="spinner ml-2"></div>
                  جارٍ التحقق...
                </>
              ) : (
                <>
                  <i className="fas fa-check ml-2"></i>
                  تحقق من الرمز
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="text-emerald-600 hover:text-emerald-500 text-sm"
              >
                العودة لإدخال البريد الإلكتروني
              </button>
            </div>
          </form>
        )}

        {step === 'password' && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmitPassword}>
            <div className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    className="input-field pr-10"
                    placeholder="أدخل كلمة المرور الجديدة"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-gray-400"></i>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="input-field pr-10"
                    placeholder="أعد إدخال كلمة المرور"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-gray-400"></i>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary"
            >
              {isLoading ? (
                <>
                  <div className="spinner ml-2"></div>
                  جارٍ تغيير كلمة المرور...
                </>
              ) : (
                <>
                  <i className="fas fa-save ml-2"></i>
                  تغيير كلمة المرور
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-center">
          <button
            type="button"
            onClick={() => onToggleMode('login')}
            className="text-emerald-600 hover:text-emerald-500 text-sm"
          >
            العودة إلى تسجيل الدخول
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            للاختبار: استخدم أي رمز مكون من 6 أرقام (مثال: 123456)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;