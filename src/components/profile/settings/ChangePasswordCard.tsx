"use client";
import { Paper } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useUpdatePassword } from "@/hooks/api";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePasswordSchema, UpdatePasswordFormData } from "@/schemas/auth.schema";

const ChangePasswordCard = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updatePassword = useUpdatePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const onSubmit = async (data: UpdatePasswordFormData) => {
    try {
      await updatePassword.mutateAsync({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      
      toast.success("Нууц үг амжилттай шинэчлэгдлээ");
      reset(); // Clear form
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Нууц үг шинэчлэхэд алдаа гарлаа";
      toast.error(errorMessage);
    }
  };

  return (
    <Paper className="flex-1">
      <h2 className="text-lg font-semibold mb-4">Нууц үг солих</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="relative">
          <Input
            type={showOldPassword ? "text" : "password"}
            placeholder="Одоогийн нууц үг"
            {...register("oldPassword")}
            className="placeholder:text-muted-foreground pr-10"
          />
          <button
            type="button"
            onClick={() => setShowOldPassword(!showOldPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          {errors.oldPassword && (
            <p className="text-sm text-red-500 mt-1">{errors.oldPassword.message}</p>
          )}
        </div>
        
        <div className="relative">
          <Input
            type={showNewPassword ? "text" : "password"}
            placeholder="Шинэ нууц үг"
            {...register("newPassword")}
            className="placeholder:text-muted-foreground pr-10"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          {errors.newPassword && (
            <p className="text-sm text-red-500 mt-1">{errors.newPassword.message}</p>
          )}
        </div>
        
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Шинэ нууц үг давтах"
            {...register("confirmPassword")}
            className="placeholder:text-muted-foreground pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        <Button 
          type="submit"
          disabled={updatePassword.isPending}
          className="w-fit bg-primary text-primary-foreground font-semibold disabled:opacity-50"
        >
          {updatePassword.isPending ? "Шинэчилж байна..." : "Нууц үг шинэчлэх"}
        </Button>
      </form>
    </Paper>
  );
};

export default ChangePasswordCard;
