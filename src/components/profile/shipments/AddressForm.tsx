"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paper } from "@/components/common";
import { Address } from "@/types/address";
import { CreateAddressFormData } from "@/schemas/address.schema";
import { useForm } from "react-hook-form";
import { RefObject } from "react";

interface AddressFormProps {
  isVisible: boolean;
  editingAddress: Address | null;
  onSubmit: (data: CreateAddressFormData) => Promise<void>;
  onCancel: () => void;
  formRef: RefObject<HTMLDivElement | null>;
  form: ReturnType<typeof useForm<CreateAddressFormData>>;
  isSubmitting: boolean;
  createPending: boolean;
  updatePending: boolean;
  isSubmitSuccessful: boolean;
}

export default function AddressForm({
  isVisible,
  editingAddress,
  onSubmit,
  onCancel,
  formRef,
  form,
  isSubmitting,
  createPending,
  updatePending,
  isSubmitSuccessful,
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  if (!isVisible) return null;

  return (
    <Paper ref={formRef} animated>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <span className="text-xl">📝</span>
          </div>
          <h2 className="text-2xl font-bold">
            {editingAddress ? "Хаяг засах" : "Шинэ хаяг нэмэх"}
          </h2>
        </div>
        <button
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-lg"
          aria-label="Хаалах"
        >
          <span className="text-xl">✕</span>
        </button>
      </div>

      {/* Success Message */}
      {isSubmitSuccessful && (
        <Paper variant="compact" className="mb-6 bg-green-50 border-green-200">
          <p className="text-green-800 font-medium flex items-center gap-2">
            <span>✅</span>
            Хаяг амжилттай нэмэгдлээ!
          </p>
          <p className="text-green-600 text-sm mt-1">
            Таны шинэ хаяг хадгалагдлаа. Захиалга хийхдээ энэ хаягийг ашиглаж болно.
          </p>
        </Paper>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Title */}
        <div className="group">
          <label className="block mb-2 font-semibold text-base text-foreground" htmlFor="title">
            Хаягийн нэр
          </label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Хаягийн нэр"
            className="bg-background border-2 border-border focus:border-primary text-base h-12 rounded-lg transition-all duration-200 group-hover:border-primary/50"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <span>⚠️</span>
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Recipient Name */}
        <div className="group">
          <label
            className="block mb-2 font-semibold text-base text-foreground"
            htmlFor="recipient_name"
          >
            Хүлээн авагчийн нэр
          </label>
          <Input
            id="recipient_name"
            {...register("recipient_name")}
            placeholder="Хүлээн авагчийн нэр"
            className="bg-background border-2 border-border focus:border-primary text-base h-12 rounded-lg transition-all duration-200 group-hover:border-primary/50"
          />
          {errors.recipient_name && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <span>⚠️</span>
              {errors.recipient_name.message}
            </p>
          )}
        </div>

        {/* Full Address */}
        <div className="group">
          <label
            className="block mb-2 font-semibold text-base text-foreground"
            htmlFor="full_address"
          >
            Хаяг
          </label>
          <Input
            id="full_address"
            {...register("full_address")}
            placeholder="Гудамж, байрны дугаар"
            className="bg-background border-2 border-border focus:border-primary text-base h-12 rounded-lg transition-all duration-200 group-hover:border-primary/50"
          />
          {errors.full_address && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <span>⚠️</span>
              {errors.full_address.message}
            </p>
          )}
        </div>

        {/* City */}
        <div className="group">
          <label className="block mb-2 font-semibold text-base text-foreground" htmlFor="city">
            Хот/Сум
          </label>
          <Input
            id="city"
            {...register("city")}
            placeholder="Хот эсвэл сум"
            className="bg-background border-2 border-border focus:border-primary text-base h-12 rounded-lg transition-all duration-200 group-hover:border-primary/50"
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <span>⚠️</span>
              {errors.city.message}
            </p>
          )}
        </div>

        {/* District */}
        <div className="group">
          <label
            className="block mb-2 font-semibold text-base text-foreground"
            htmlFor="district"
          >
            Аймаг/Дүүрэг
          </label>
          <Input
            id="district"
            {...register("district")}
            placeholder="Аймаг эсвэл дүүрэг"
            className="bg-background border-2 border-border focus:border-primary text-base h-12 rounded-lg transition-all duration-200 group-hover:border-primary/50"
          />
          {errors.district && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <span>⚠️</span>
              {errors.district.message}
            </p>
          )}
        </div>

        {/* Postal Code */}
        <div className="group">
          <label
            className="block mb-2 font-semibold text-base text-foreground"
            htmlFor="postal_code"
          >
            Шуудангийн код
          </label>
          <Input
            id="postal_code"
            {...register("postal_code")}
            placeholder="Шуудангийн код эсвэл zip"
            className="bg-background border-2 border-border focus:border-primary text-base h-12 rounded-lg transition-all duration-200 group-hover:border-primary/50"
          />
          {errors.postal_code && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <span>⚠️</span>
              {errors.postal_code.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="group">
          <label className="block mb-2 font-semibold text-base text-foreground" htmlFor="phone">
            Утас
          </label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="Утасны дугаар"
            className="bg-background border-2 border-border focus:border-primary text-base h-12 rounded-lg transition-all duration-200 group-hover:border-primary/50"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <span>⚠️</span>
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Notes */}
        <div className="md:col-span-2 group">
          <label className="block mb-2 font-semibold text-base text-foreground" htmlFor="notes">
            Тэмдэглэл
          </label>
          <Input
            id="notes"
            {...register("notes")}
            placeholder="Нэмэлт мэдээлэл (заавал биш)"
            className="bg-background border-2 border-border focus:border-primary text-base h-12 rounded-lg transition-all duration-200 group-hover:border-primary/50"
          />
          {errors.notes && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <span>⚠️</span>
              {errors.notes.message}
            </p>
          )}
        </div>

        {/* Default Address Checkbox */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-3 font-semibold text-base cursor-pointer p-4 bg-muted/50 rounded-lg border-2 border-transparent hover:border-primary/20 transition-colors">
            <input
              type="checkbox"
              {...register("is_default")}
              className="w-5 h-5 text-primary bg-background border-2 border-border rounded focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <span>Үүнийг үндсэн хаяг болгох</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 items-center md:col-span-2 pt-4">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || createPending || updatePending}
            className="text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg transition-colors"
          >
            {isSubmitting || createPending || updatePending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {editingAddress ? "Шинэчилж байна..." : "Хадгалж байна..."}
              </div>
            ) : (
              editingAddress ? "Хаяг шинэчлэх" : "Хаяг нэмэх"
            )}
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={onCancel}
            className="text-lg font-semibold border-2 px-8 py-3 rounded-lg transition-colors"
          >
            Цуцлах
          </Button>
        </div>
      </form>
    </Paper>
  );
}
