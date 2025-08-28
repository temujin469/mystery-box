"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForgotPassword, useVerifyResetPin, useResetPassword } from "@/hooks/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, ArrowLeft, RefreshCw, Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

// Loading component for Suspense fallback
function LoadingResetPassword() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-gray-400">Нууц үг сэргээж байна...</p>
      </div>
    </div>
  );
}

// Main reset password component
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'email' | 'pin' | 'password' | 'success' | 'error'>('email');
  const [message, setMessage] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const email = searchParams.get('email');

  // Use the password reset hooks
  const forgotPasswordMutation = useForgotPassword();
  const verifyPinMutation = useVerifyResetPin();
  const resetPasswordMutation = useResetPassword();

  // Initialize email from URL params
  useEffect(() => {
    if (email) {
      setUserEmail(email);
    }
  }, [email]);

  // Handle forgot password response
  useEffect(() => {
    if (forgotPasswordMutation.isSuccess) {
      setCurrentStep('pin');
      setMessage(forgotPasswordMutation.data?.message || 'Сэргээх код таны и-мэйл хаяг руу илгээгдлээ');
      setIsLoading(false);
    } else if (forgotPasswordMutation.isError) {
      const error = forgotPasswordMutation.error as any;
      const errorMessage = error?.response?.data?.message || error?.message;
      setCurrentStep('error');
      setMessage(errorMessage || 'И-мэйл илгээхэд алдаа гарлаа');
      setIsLoading(false);
    }
  }, [forgotPasswordMutation.isSuccess, forgotPasswordMutation.isError, forgotPasswordMutation.data, forgotPasswordMutation.error]);

  // Handle verify PIN response
  useEffect(() => {
    if (verifyPinMutation.isSuccess) {
      setCurrentStep('password');
      setMessage('');
      setIsLoading(false);
    } else if (verifyPinMutation.isError) {
      const error = verifyPinMutation.error as any;
      const errorMessage = error?.response?.data?.message || error?.message;
      setMessage(errorMessage || 'Код баталгаажуулахад алдаа гарлаа');
      setIsLoading(false);
    }
  }, [verifyPinMutation.isSuccess, verifyPinMutation.isError, verifyPinMutation.data, verifyPinMutation.error]);

  // Handle reset password response
  useEffect(() => {
    if (resetPasswordMutation.isSuccess) {
      setCurrentStep('success');
      setMessage(resetPasswordMutation.data?.message || 'Нууц үг амжилттай шинэчлэгдлээ');
      setIsLoading(false);
    } else if (resetPasswordMutation.isError) {
      const error = resetPasswordMutation.error as any;
      const errorMessage = error?.response?.data?.message || error?.message;
      setMessage(errorMessage || 'Нууц үг шинэчлэхэд алдаа гарлаа');
      setIsLoading(false);
    }
  }, [resetPasswordMutation.isSuccess, resetPasswordMutation.isError, resetPasswordMutation.data, resetPasswordMutation.error]);

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newPin = [...pin];
    newPin[index] = value.slice(-1); // Take only the last character
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Clear error message when typing
    if (message) {
      setMessage('');
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'Enter' && pin.every(digit => digit !== '')) {
      handleVerifyPin();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pastedData.length === 4) {
      setPin(pastedData.split(''));
      inputRefs.current[3]?.focus();
    }
  };

  const handleSendResetCode = () => {
    if (!userEmail) {
      setMessage('И-мэйл хаягаа оруулна уу');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      setMessage('Зөв и-мэйл хаяг оруулна уу');
      return;
    }

    setIsLoading(true);
    setMessage('');
    forgotPasswordMutation.mutate(userEmail);
  };

  const handleVerifyPin = () => {
    const pinString = pin.join('');
    if (pinString.length !== 4) {
      setMessage('4 оронтой код оруулна уу');
      return;
    }

    setIsLoading(true);
    setMessage('');
    verifyPinMutation.mutate({ email: userEmail, pin: pinString });
  };

  const handleResetPassword = () => {
    if (!newPassword) {
      setMessage('Шинэ нууц үгээ оруулна уу');
      return;
    }

    if (newPassword.length < 8) {
      setMessage('Нууц үг дор хаяж 8 тэмдэгт байх ёстой');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Нууц үг таарахгүй байна');
      return;
    }

    const pinString = pin.join('');
    setIsLoading(true);
    setMessage('');
    resetPasswordMutation.mutate({ 
      email: userEmail, 
      pin: pinString, 
      newPassword: newPassword 
    });
  };

  const handleGoToLogin = () => {
    router.push('/?auth=signin');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleBackToEmail = () => {
    setCurrentStep('email');
    setMessage('');
    setPin(['', '', '', '']);
  };

  const handleBackToPin = () => {
    setCurrentStep('pin');
    setMessage('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Render different steps
  const renderContent = () => {
    switch (currentStep) {
      case 'email':
        return (
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto mb-6 p-4 rounded-full bg-gray-800 w-fit">
                <Lock className="h-8 w-8 text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Нууц үг сэргээх
              </h1>
              <p className="text-gray-400 text-sm">
                Нууц үг сэргээхийн тулд и-мэйл хаягаа оруулна уу
              </p>
            </div>

            {/* Email Input */}
            <div className="mb-6">
              <Input
                type="email"
                placeholder="И-мэйл хаягаа оруулна уу"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 h-12"
                onKeyDown={(e) => e.key === 'Enter' && handleSendResetCode()}
              />
            </div>

            {/* Error Message */}
            {message && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
                <div className="flex items-center text-red-400">
                  <XCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm">{message}</span>
                </div>
              </div>
            )}

            {/* Send Code Button */}
            <Button
              onClick={handleSendResetCode}
              disabled={!userEmail || isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-lg transition-colors duration-200 mb-6"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Илгээж байна...
                </>
              ) : (
                'Сэргээх код илгээх'
              )}
            </Button>

            {/* Go Back */}
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Нууц үгээ санаж байна уу?{' '}
                <Button
                  variant="ghost"
                  onClick={handleGoToLogin}
                  className="text-blue-400 hover:text-blue-300 p-0 h-auto font-normal"
                >
                  Нэвтрэх
                </Button>
              </p>
            </div>
          </div>
        );

      case 'pin':
        return (
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto mb-6 p-4 rounded-full bg-gray-800 w-fit">
                <Lock className="h-8 w-8 text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Код оруулна уу
              </h1>
              <p className="text-gray-400 text-sm">
                <span className="text-blue-400">{userEmail}</span> хаяг руу илгээсэн 4 оронтой кодыг оруулна уу
              </p>
            </div>

            {/* Success Message */}
            {message && !message.includes('буруу') && (
              <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-lg">
                <div className="flex items-center text-green-400">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm">{message}</span>
                </div>
              </div>
            )}

            {/* PIN Input */}
            <div className="flex justify-center space-x-3 mb-8">
              {pin.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={cn(
                    "w-16 h-16 text-center text-2xl font-bold bg-gray-800 border-2 transition-all duration-200",
                    digit 
                      ? "border-blue-500 text-white" 
                      : "border-gray-600 text-gray-400",
                    "focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  )}
                />
              ))}
            </div>

            {/* Error Message */}
            {message && message.includes('буруу') && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
                <div className="flex items-center text-red-400">
                  <XCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm">{message}</span>
                </div>
              </div>
            )}

            {/* Verify Button */}
            <Button
              onClick={handleVerifyPin}
              disabled={pin.some(digit => !digit) || isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-lg transition-colors duration-200 mb-6"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Баталгаажуулж байна...
                </>
              ) : (
                'Баталгаажуулах'
              )}
            </Button>

            {/* Resend Code */}
            <div className="text-center mb-6">
              <p className="text-gray-500 text-sm mb-2">
                Код ирсэнгүй юу?
              </p>
              <Button
                variant="ghost"
                onClick={handleSendResetCode}
                disabled={isLoading}
                className="text-blue-400 hover:text-blue-300 hover:bg-gray-800 font-medium"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Илгээж байна...
                  </>
                ) : (
                  'Дахин илгээх'
                )}
              </Button>
            </div>

            {/* Go Back */}
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={handleBackToEmail}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Буцах
              </Button>
            </div>
          </div>
        );

      case 'password':
        return (
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto mb-6 p-4 rounded-full bg-gray-800 w-fit">
                <Lock className="h-8 w-8 text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Шинэ нууц үг
              </h1>
              <p className="text-gray-400 text-sm">
                Шинэ нууц үгээ оруулна уу
              </p>
            </div>

            {/* New Password Input */}
            <div className="mb-4">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Шинэ нууц үг"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 h-12 pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="mb-6">
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Нууц үгээ давтана уу"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 h-12 pr-12"
                  onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {message && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
                <div className="flex items-center text-red-400">
                  <XCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm">{message}</span>
                </div>
              </div>
            )}

            {/* Password Requirements */}
            <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <p className="text-gray-400 text-xs mb-2">Нууц үгийн шаардлага:</p>
              <ul className="text-gray-500 text-xs space-y-1">
                <li className={newPassword.length >= 8 ? "text-green-400" : ""}>
                  • Дор хаяж 8 тэмдэгт
                </li>
                <li className={newPassword === confirmPassword && newPassword ? "text-green-400" : ""}>
                  • Нууц үг таарах ёстой
                </li>
              </ul>
            </div>

            {/* Reset Password Button */}
            <Button
              onClick={handleResetPassword}
              disabled={!newPassword || !confirmPassword || isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-lg transition-colors duration-200 mb-6"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Шинэчилж байна...
                </>
              ) : (
                'Нууц үг шинэчлэх'
              )}
            </Button>

            {/* Go Back */}
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={handleBackToPin}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Буцах
              </Button>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="w-full max-w-md text-center">
            <div className="mx-auto mb-6 p-4 rounded-full bg-green-900/20 w-fit">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Амжилттай шинэчлэгдлээ!
            </h1>
            <p className="text-gray-400 mb-8">
              {message}
            </p>
            <div className="space-y-3">
              <Button
                onClick={handleGoToLogin}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
              >
                Нэвтрэх хуудас руу очих
              </Button>
              <Button
                variant="ghost"
                onClick={handleGoHome}
                className="w-full text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Нүүр хуудас руу очих
              </Button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="w-full max-w-md text-center">
            <div className="mx-auto mb-6 p-4 rounded-full bg-red-900/20 w-fit">
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Алдаа гарлаа
            </h1>
            <p className="text-gray-400 mb-8">
              {message}
            </p>
            <div className="space-y-3">
              <Button
                onClick={handleBackToEmail}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
              >
                Дахин оролдох
              </Button>
              <Button
                variant="ghost"
                onClick={handleGoHome}
                className="w-full text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Нүүр хуудас руу очих
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {renderContent()}
    </div>
  );
}

// Main page component with Suspense wrapper
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingResetPassword />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
