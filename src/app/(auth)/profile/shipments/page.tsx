"use client";
import {
  useMyAddresses,
  useCreateAddress,
  useUpdateAddress,
  useCurrentUser,
  useSetDefaultAddress,
  useDeleteAddress,
} from "@/hooks/api";
import { createAddressSchema, CreateAddressFormData } from "@/schemas";
import { Address } from "@/types/address";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import { HeaderWithIcon, ResponsiveDialog } from "@/components/common";
import { AddressForm, AddressList } from "@/components/profile";

export default function Shipment() {
  const { data: user } = useCurrentUser();
  const {
    data: addressesResponse,
    isLoading,
    error,
  } = useMyAddresses({
    page: 1,
    limit: 50,
  });
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const setDefaultAddress = useSetDefaultAddress();
  const deleteAddress = useDeleteAddress();

  // Extract addresses array from the paginated response
  const addresses = addressesResponse?.addresses || [];

  // Address limit constants
  const MAX_ADDRESSES = 3;
  const hasReachedLimit = addresses.length >= MAX_ADDRESSES;

  // Form visibility and editing state
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingAddressId, setDeletingAddressId] = useState<number | null>(
    null
  );
  const [settingDefaultId, setSettingDefaultId] = useState<number | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Track initial loading state
  useEffect(() => {
    if (!isLoading && (addressesResponse || error)) {
      setIsInitialLoad(false);
    }
  }, [isLoading, addressesResponse, error]);

  const form = useForm<CreateAddressFormData>({
    resolver: zodResolver(createAddressSchema),
    defaultValues: {
      recipient_name: "",
      full_address: "",
      city: "",
      district: "",
      postal_code: "",
      phone: "",
      title: "Үндсэн хаяг",
      is_default: false,
      notes: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = form;

  // Function to show form for creating new address
  const handleShowNewAddressForm = () => {
    setEditingAddress(null);
    reset();
    setShowForm(true);
    // Scroll to form after a short delay to allow for rendering
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // Function to show form for editing existing address
  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    // Populate form with existing address data
    setValue("title", address.title || "");
    setValue("recipient_name", address.recipient_name || "");
    setValue("full_address", address.full_address || "");
    setValue("city", address.city || "");
    setValue("district", address.district || "");
    setValue("postal_code", address.postal_code || "");
    setValue("phone", address.phone || "");
    setValue("notes", address.notes || "");
    setValue("is_default", address.is_default || false);
    setShowForm(true);
    // Scroll to form after a short delay to allow for rendering
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // Function to handle address deletion
  const handleDeleteAddress = async (address: Address) => {
    if (address.is_default) {
      toast.error(
        "Үндсэн хаягийг устгах боломжгүй. Өөр хаягийг үндсэн болгосны дараа устгана уу."
      );
      return;
    }

    setAddressToDelete(address);
    setShowDeleteDialog(true);
  };

  // Function to confirm address deletion
  const handleConfirmDelete = async () => {
    if (!addressToDelete) return;

    setDeletingAddressId(addressToDelete.id);
    try {
      await deleteAddress.mutateAsync(addressToDelete.id);
      toast.success("Хаяг амжилттай устгагдлаа");
      setShowDeleteDialog(false);
      setAddressToDelete(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Хаяг устгахад алдаа гарлаа"
      );
    } finally {
      setDeletingAddressId(null);
    }
  };

  // Function to cancel address deletion
  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setAddressToDelete(null);
  };

  // Function to handle setting default address
  const handleSetDefaultAddress = async (address: Address) => {
    if (address.is_default) {
      toast.info("Энэ хаяг аль хэдийн үндсэн хаяг байна");
      return;
    }

    setSettingDefaultId(address.id);
    try {
      await setDefaultAddress.mutateAsync(address.id);
      toast.success(`"${address.title}" хаяг үндсэн хаяг болгогдлоо`);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Үндсэн хаяг тохируулахад алдаа гарлаа"
      );
    } finally {
      setSettingDefaultId(null);
    }
  };

  const onSubmit = async (data: CreateAddressFormData) => {
    if (!user?.id) {
      toast.error("Нэвтрэх шаардлагатай");
      return;
    }

    try {
      if (editingAddress) {
        // Update existing address
        await updateAddress.mutateAsync({
          id: editingAddress.id,
          data: {
            ...data,
            title: data.title || "Үндсэн хаяг",
            is_default: data.is_default || false,
          },
        });
        toast.success("Хаяг амжилттай шинэчлэгдлээ");
      } else {
        // Create new address
        await createAddress.mutateAsync({
          ...data,
          title: data.title || "Үндсэн хаяг",
          is_default: data.is_default || false,
          user_id: user.id,
        });
        toast.success("Хаяг амжилттай нэмэгдлээ");
      }
      reset();
      setShowForm(false);
      setEditingAddress(null);
    } catch (error: any) {
      const message = editingAddress
        ? "Хаяг шинэчлэхэд алдаа гарлаа"
        : "Хаяг нэмэхэд алдаа гарлаа";
      toast.error(error?.response?.data?.message || message);
    }
  };

  const onCancel = () => {
    reset();
    setShowForm(false);
    setEditingAddress(null);
  };
  return (
    <div>
      <div>
        <HeaderWithIcon
          icon="📬"
          title="Хүргэлтийн хаяг"
          actionButton={
            hasReachedLimit
              ? {
                  label: "Дээд хязгаар (3/3)",
                  onClick: () => {
                    toast.error("Дээд хязгаар хүрсэн", {
                      description: "Дээд тал нь 3 хаяг хадгалах боломжтой.",
                    });
                  },
                  variant: "secondary" as const,
                  icon: "🚫",
                }
              : {
                  label: "Шинэ хаяг нэмэх",
                  onClick: handleShowNewAddressForm,
                  variant: "secondary" as const,
                  icon: "＋",
                }
          }
        />

        <AddressList
          addresses={addresses}
          isLoading={isLoading}
          error={error}
          onShowNewForm={handleShowNewAddressForm}
          onEditAddress={handleEditAddress}
          onSetDefaultAddress={handleSetDefaultAddress}
          onDeleteAddress={handleDeleteAddress}
          settingDefaultId={settingDefaultId}
          deletingAddressId={deletingAddressId}
          isInitialLoading={isInitialLoad}
        />

        <AddressForm
          isVisible={showForm}
          editingAddress={editingAddress}
          onSubmit={onSubmit}
          onCancel={onCancel}
          formRef={formRef}
          form={form}
          isSubmitting={isSubmitting}
          createPending={createAddress.isPending}
          updatePending={updateAddress.isPending}
          isSubmitSuccessful={isSubmitSuccessful}
        />

        <ResponsiveDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="Хаяг устгах"
          description={
            addressToDelete
              ? `"${addressToDelete.title}" хаягийг устгахдаа итгэлтэй байна уу?`
              : ""
          }
          confirmText="Устгах"
          cancelText="Цуцлах"
          confirmVariant="destructive"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isLoading={deletingAddressId === addressToDelete?.id}
        />
      </div>
    </div>
  );
}
