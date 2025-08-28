"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useVerifyEmail, useResendVerification } from "@/hooks/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, ArrowLeft, RefreshCw, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/stores/modal.store";

// Loading component for Suspense fallback
function LoadingVerification() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-gray-400">И-мэйл баталгаажуулж байна...</p>
      </div>
    </div>
  );
}

// Main verification component
function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openAuth } = useModalStore();
  const [verificationStatus, setVerificationStatus] = useState<'input' | 'success' | 'error'>('input');
  const [message, setMessage] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const email = searchParams.get('email');

  // Use existing hooks
  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendVerification();

  // Initialize email from URL params
  useEffect(() => {
    if (email) {
      setUserEmail(email);
    } else {
      // If no email is provided, redirect back to login page
      // This ensures the verification flow is properly initiated
      setTimeout(() => {
        router.push('/');
        openAuth('signin');
      }, 1000);
      setMessage('И-мэйл хаяг олдсонгүй. Нэвтрэх хуудас руу шилжүүлж байна...');
    }
  }, [email, router, openAuth]);

  // Configure mutation callbacks
  useEffect(() => {
    if (verifyMutation.isSuccess) {
      setVerificationStatus('success');
      setMessage(verifyMutation.data?.message || 'И-мэйл амжилттай баталгаажлаа!');
      setIsVerifying(false);
    } else if (verifyMutation.isError) {
      const error = verifyMutation.error as any;
      const errorMessage = error?.response?.data?.message || error?.message;
      setVerificationStatus('error');
      setMessage(errorMessage || 'И-мэйл баталгаажуулахад алдаа гарлаа.');
      setIsVerifying(false);
    }
  }, [verifyMutation.isSuccess, verifyMutation.isError, verifyMutation.data, verifyMutation.error]);

  useEffect(() => {
    if (resendMutation.isSuccess) {
      setMessage(resendMutation.data?.message || 'Шинэ баталгаажуулалтын и-мэйл илгээгдлээ!');
      setVerificationStatus('input');
    } else if (resendMutation.isError) {
      const error = resendMutation.error as any;
      const errorMessage = error?.response?.data?.message || error?.message;
      setMessage(errorMessage || 'И-мэйл илгээхэд алдаа гарлаа.');
      setVerificationStatus('error');
    }
  }, [resendMutation.isSuccess, resendMutation.isError, resendMutation.data, resendMutation.error]);

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
    if (message && verificationStatus === 'error') {
      setMessage('');
      setVerificationStatus('input');
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

  const handleVerifyPin = () => {
    const pinString = pin.join('');
    if (pinString.length !== 4) {
      setMessage('4 оронтой код оруулна уу');
      setVerificationStatus('error');
      return;
    }

    setIsVerifying(true);
    setVerificationStatus('input');
    verifyMutation.mutate(pinString);
  };

  const handleResendEmail = () => {
    if (userEmail) {
      resendMutation.mutate(userEmail);
    } else {
      setMessage('И-мэйл хаяг олдсонгүй. Хуудсыг дахин ачааллана уу.');
      setVerificationStatus('error');
    }
  };

  const handleGoToLogin = () => {
    router.push('/');
    openAuth('signin');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const resetForm = () => {
    setPin(['', '', '', '']);
    setMessage('');
    setVerificationStatus('input');
    inputRefs.current[0]?.focus();
  };

  // Render different states
  const renderContent = () => {
    // Show loading/redirect message if no email
    if (!userEmail && !email) {
      return (
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 p-4 rounded-full bg-amber-900/20 w-fit">
            <RefreshCw className="h-8 w-8 text-amber-400 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Шилжүүлж байна...
          </h1>
          <p className="text-gray-400 mb-8">
            {message || 'И-мэйл хаяг олдсонгүй. Нэвтрэх хуудас руу шилжүүлж байна...'}
          </p>
        </div>
      );
    }

    switch (verificationStatus) {
      case 'input':
        return (
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto mb-6 p-4 rounded-full bg-gray-800 w-fit">
                <Lock className="h-8 w-8 text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                И-мэйл баталгаажуулалт
              </h1>
              <p className="text-gray-400 text-sm">
                {userEmail ? `${userEmail} хаяг руу илгээсэн 4 оронтой кодыг оруулна уу.` : 'И-мэйл хаяг руу илгээсэн 4 оронтой кодыг оруулна уу.'}
              </p>
            </div>

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
            {message && message.includes('алдаа') && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
                <div className="flex items-center text-red-400">
                  <XCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm">{message}</span>
                </div>
              </div>
            )}

            {/* Success Message */}
            {message && resendMutation.isSuccess && (
              <div className="mb-6 p-4 bg-green-900/20 border border-green-800 rounded-lg">
                <div className="flex items-center text-green-400">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm">{message}</span>
                </div>
              </div>
            )}

            {/* Verify Button */}
            <Button
              onClick={handleVerifyPin}
              disabled={pin.some(digit => !digit) || isVerifying}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-lg transition-colors duration-200 mb-6"
            >
              {isVerifying ? (
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
                Код авахад асуудал тулгарч байна уу?
              </p>
              <Button
                variant="ghost"
                onClick={handleResendEmail}
                disabled={!userEmail || resendMutation.isPending}
                className="text-blue-400 hover:text-blue-300 hover:bg-gray-800 font-medium"
              >
                {resendMutation.isPending ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Илгээж байна...
                  </>
                ) : (
                  'Код дахин илгээх'
                )}
              </Button>
            </div>

            {/* Go Back */}
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Нууц үгээ санаж байна уу?{' '}
                <Button
                  variant="ghost"
                  onClick={handleGoToLogin}
                  className="text-blue-400 hover:text-blue-300 p-0 h-auto font-normal"
                >
                  Буцах
                </Button>
              </p>
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
              И-мэйл амжилттай баталгаажлаа!
            </h1>
            <p className="text-gray-400 mb-8">
              {message}
            </p>
            <div className="space-y-3">
              <Button
                onClick={handleGoToLogin}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
              >
                Нэвтрэх хуудас руу үргэлжлүүлэх
              </Button>
              <Button
                variant="ghost"
                onClick={handleGoHome}
                className="w-full text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Нүүр хуудас руу буцах
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
              Баталгаажуулалт амжилтгүй
            </h1>
            <p className="text-gray-400 mb-8">
              {message}
            </p>
            <div className="space-y-3">
              <Button
                onClick={resetForm}
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
                Нүүр хуудас руу буцах
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {renderContent()}
    </div>
  );
}

// Main page component with Suspense wrapper
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingVerification />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
