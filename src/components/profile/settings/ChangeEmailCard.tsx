"use client";
import { Paper } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useInitiateEmailUpdate, useVerifyEmailUpdate, useCurrentUser, useLogout } from "@/hooks/api";
import { Eye, EyeOff, Mail, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

// Schema for email update initiation
const initiateEmailUpdateSchema = z.object({
  newEmail: z
    .string()
    .min(1, "Имэйл хаяг оруулна уу")
    .email("Зөв имэйл хаяг оруулна уу"),
  currentPassword: z
    .string()
    .min(1, "Нууц үгээ оруулна уу"),
});

type InitiateEmailUpdateFormData = z.infer<typeof initiateEmailUpdateSchema>;

// Schema for PIN verification
const verifyEmailUpdateSchema = z.object({
  verificationPin: z
    .string()
    .length(4, "4 оронтой PIN код оруулна уу")
    .regex(/^\d{4}$/, "Зөвхөн тоо оруулна уу"),
});

type VerifyEmailUpdateFormData = z.infer<typeof verifyEmailUpdateSchema>;

const ChangeEmailCard = () => {
  const [step, setStep] = useState<"initiate" | "verify">("initiate");
  const [showPassword, setShowPassword] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string>("");

  const { data: user } = useCurrentUser();
  const initiateEmailUpdate = useInitiateEmailUpdate();
  const verifyEmailUpdate = useVerifyEmailUpdate();
  const logout = useLogout();

  // Form for email update initiation
  const initiateForm = useForm<InitiateEmailUpdateFormData>({
    resolver: zodResolver(initiateEmailUpdateSchema),
  });

  // Form for PIN verification
  const verifyForm = useForm<VerifyEmailUpdateFormData>({
    resolver: zodResolver(verifyEmailUpdateSchema),
  });

  const onInitiateSubmit = async (data: InitiateEmailUpdateFormData) => {
    try {
      await initiateEmailUpdate.mutateAsync({
        newEmail: data.newEmail,
        currentPassword: data.currentPassword,
      });
      
      setPendingEmail(data.newEmail);
      setStep("verify");
      toast.success(`Баталгаажуулах код ${data.newEmail} хаягт илгээгдлээ`);
      initiateForm.reset();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Имэйл хаяг шинэчлэхэд алдаа гарлаа";
      toast.error(errorMessage);
    }
  };

  const onVerifySubmit = async (data: VerifyEmailUpdateFormData) => {
    try {
      await verifyEmailUpdate.mutateAsync({
        verificationPin: data.verificationPin,
      });
      
      toast.success("Имэйл хаяг амжилттай шинэчлэгдлээ. Дахин нэвтэрнэ үү.");
      
      // Reset everything
      setStep("initiate");
      setPendingEmail("");
      verifyForm.reset();
      
      // Explicitly logout the user
      await logout.mutateAsync();
      
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Баталгаажуулах кодыг шалгаж байхад алдаа гарлаа";
      toast.error(errorMessage);
      verifyForm.setValue("verificationPin", ""); // Clear OTP input
    }
  };

  const handleBackToInitiate = () => {
    setStep("initiate");
    setPendingEmail("");
    verifyForm.reset();
  };

  if (step === "verify") {
    return (
      <Paper className="flex-1">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Имэйл хаяг баталгаажуулах</h2>
        </div>
        
        <div className="mb-6">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
              <Mail className="w-4 h-4" />
              <span className="font-medium">Баталгаажуулах код илгээгдлээ</span>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              <span className="font-medium">{pendingEmail}</span> хаягт илгээсэн 4 оронтой кодыг оруулна уу
            </p>
          </div>
        </div>

        <form onSubmit={verifyForm.handleSubmit(onVerifySubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-4">
            <InputOTP
              maxLength={4}
              value={verifyForm.watch("verificationPin") || ""}
              onChange={(value) => verifyForm.setValue("verificationPin", value)}
            >
              <InputOTPGroup>
                <InputOTPSlot className="h-12 w-12 text-lg font-bold" index={0} />
                <InputOTPSlot className="h-12 w-12 text-lg font-bold" index={1} />
                <InputOTPSlot className="h-12 w-12 text-lg font-bold" index={2} />
                <InputOTPSlot className="h-12 w-12 text-lg font-bold" index={3} />
              </InputOTPGroup>
            </InputOTP>
            
            {verifyForm.formState.errors.verificationPin && (
              <p className="text-sm text-red-500 text-center">
                {verifyForm.formState.errors.verificationPin.message}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleBackToInitiate}
              disabled={verifyEmailUpdate.isPending || logout.isPending}
              className="flex-1"
            >
              Буцах
            </Button>
            <Button 
              type="submit"
              disabled={verifyEmailUpdate.isPending || logout.isPending || !verifyForm.watch("verificationPin")}
              className="flex-1 bg-primary text-primary-foreground font-semibold disabled:opacity-50"
            >
              {verifyEmailUpdate.isPending || logout.isPending ? "Баталгаажуулж байна..." : "Баталгаажуулах"}
            </Button>
          </div>
        </form>
      </Paper>
    );
  }

  return (
    <Paper className="flex-1">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Имэйл хаяг солих</h2>
      </div>
      
      <form onSubmit={initiateForm.handleSubmit(onInitiateSubmit)} className="flex flex-col gap-4">
        <div>
          <Input
            type="email"
            placeholder={
              user?.email ? `Одоогийн: ${user.email}` : "Шинэ имэйл хаяг"
            }
            {...initiateForm.register("newEmail")}
            className="placeholder:text-muted-foreground"
            disabled={initiateEmailUpdate.isPending}
          />
          {initiateForm.formState.errors.newEmail && (
            <p className="text-sm text-red-500 mt-1">
              {initiateForm.formState.errors.newEmail.message}
            </p>
          )}
        </div>

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Нууц үг"
            {...initiateForm.register("currentPassword")}
            className="placeholder:text-muted-foreground pr-10"
            disabled={initiateEmailUpdate.isPending}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          {initiateForm.formState.errors.currentPassword && (
            <p className="text-sm text-red-500 mt-1">
              {initiateForm.formState.errors.currentPassword.message}
            </p>
          )}
        </div>

        <div className="text-sm text-muted-foreground bg-yellow-800/20 border border-yellow-600 rounded-lg p-3">
          <div className="font-medium text-yellow-300 mb-1">
            ⚠️ Анхааруулга
          </div>
          <p className="text-yellow-400">
            Имэйл хаяг өөрчлөхийн дараа та автоматаар гарах бөгөөд шинэ имэйлээрээ дахин нэвтэрэх шаардлагатай.
          </p>
        </div>

        <Button 
          type="submit"
          disabled={initiateEmailUpdate.isPending}
          className="w-fit bg-primary text-primary-foreground font-semibold disabled:opacity-50"
        >
          {initiateEmailUpdate.isPending ? "Илгээж байна..." : "Баталгаажуулах код илгээх"}
        </Button>
      </form>
    </Paper>
  );
};

export default ChangeEmailCard;
