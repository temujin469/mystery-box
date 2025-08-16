"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Paper, Slide } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  useOrderStore,
  SHIPPING_METHODS,
  type InventoryItem,
} from "@/stores/order.store";
import { ShippingMethod, type ShippingAddress } from "@/types/order";
import { useMyAddresses, useMyDefaultAddress } from "@/hooks/api/useAddress";
import { useCurrentUser } from "@/hooks/api/useAuth";
import { useCurrentUserInventory } from "@/hooks/api/useInventory";
import { useCreateOrder } from "@/hooks/api/useOrder";
import { Address } from "@/types/address";
import { formatCurrency } from "@/lib/currency";
import { ProgressSteps } from "./ProgressSteps";
import {
  ShoppingCart,
  Package,
  Truck,
  MapPin,
  User,
  Mail,
  Phone,
  MessageSquare,
  CreditCard,
  CheckCircle,
  Plus,
  Minus,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface OrderManagementSlideProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess?: (orderId: string) => void;
}

type OrderStep = "review" | "shipping" | "payment" | "confirmation";

export default function OrderManagementSlide({
  isOpen,
  onClose,
  onOrderSuccess,
}: OrderManagementSlideProps) {
  const router = useRouter();
  const orderStore = useOrderStore();
  const createOrderMutation = useCreateOrder();

  // Auth and address hooks
  const { data: currentUser } = useCurrentUser();
  const { data: addressesResponse, isLoading: addressesLoading } =
    useMyAddresses();
  const { data: defaultAddressResponse } = useMyDefaultAddress();

  // Inventory hook
  const { data: inventoryResponse, isLoading: inventoryLoading } =
    useCurrentUserInventory();

  // Extract the actual data from responses
  const addresses = addressesResponse?.addresses || [];
  const defaultAddress = defaultAddressResponse?.address;
  const inventory = inventoryResponse?.inventory;

  // Local state
  const [currentStep, setCurrentStep] = useState<OrderStep>("review");
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  // Use mutation loading state
  const isSubmitting = createOrderMutation.isPending;

  const {
    cartItems,
    selectedCount,
    totalSelectedQuantity,
    totalAmount,
    shippingMethod,
    shippingAddress,
    customerInfo,
    notes,
    error,
    setShippingMethod,
    setShippingAddress,
    setCustomerInfo,
    shippingFee,
    setNotes,
    createOrderDto,
    setError,
    clearCart,
    loadInventory,
    toggleItemSelection,
    updateOrderQuantity,
  } = orderStore;

  // Load inventory into cart when data is available
  useEffect(() => {
    if (inventory?.items) {
      loadInventory(inventory.items);
    }
  }, [inventory?.items, loadInventory]);

  // Auto-fill customer info from current user
  useEffect(() => {
    if (currentUser) {
      setCustomerInfo({
        name: currentUser.username || "",
        email: currentUser.email || "",
      });
    }
  }, [currentUser, setCustomerInfo]);

  // Set default address when addresses are loaded
  useEffect(() => {
    if (defaultAddress && !selectedAddressId) {
      setSelectedAddressId(defaultAddress.id.toString());
      setShippingAddress({
        full_address: defaultAddress.full_address,
        city: defaultAddress.city,
        district: defaultAddress.district,
        khoroo: defaultAddress.khoroo,
        postal_code: defaultAddress.postal_code,
        phone: defaultAddress.phone,
        recipient_name: defaultAddress.recipient_name,
        notes: defaultAddress.notes,
      });
    }
  }, [defaultAddress, selectedAddressId, setShippingAddress]);

  const selectedItems = cartItems.filter((item) => item.isSelected);

  const steps = [
    { id: "review", title: "Эд зүйл сонгох", icon: ShoppingCart },
    { id: "shipping", title: "Хүргэлт", icon: Truck },
    { id: "payment", title: "Төлбөр", icon: CreditCard },
    { id: "confirmation", title: "Баталгаажуулалт", icon: CheckCircle },
  ];

  const handleNextStep = () => {
    const stepOrder: OrderStep[] = [
      "review",
      "shipping",
      "payment",
      "confirmation",
    ];
    const currentIndex = stepOrder.indexOf(currentStep);

    // Validate current step before proceeding
    if (!canProceed()) {
      switch (currentStep) {
        case "review":
          toast.error("Захиалах зүйлээ сонгоно уу");
          break;
        case "shipping":
          if (shippingMethod === ShippingMethod.DELIVERY) {
            toast.error("Хүргэлтийн хаягаа бөглөнө үү");
          }
          break;
        default:
          toast.error("Мэдээллээ бүрэн бөглөнө үү");
      }
      return;
    }

    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
      // Clear any previous errors when moving to next step
      setError(null);
      createOrderMutation.reset();

      // Show progress toast for key steps
      const nextStep = stepOrder[currentIndex + 1];
      switch (nextStep) {
        case "confirmation":
          // toast.success("Бэлэн боллоо! Захиалгаа шалгана уу");
          break;
      }
    }
  };

  const handlePrevStep = () => {
    const stepOrder: OrderStep[] = [
      "review",
      "shipping",
      "payment",
      "confirmation",
    ];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
      // Clear any previous errors when going back
      setError(null);
      createOrderMutation.reset();
    }
  };

  const handleSubmitOrder = async () => {
    setError(null);

    try {
      const orderDto = createOrderDto();
      if (!orderDto) {
        toast.error("Захиалгын мэдээлэл бүрэн бөглөгдөөгүй байна.");
        return;
      }

      // Set user_id from current user
      orderDto.user_id = currentUser?.id || "temp-user-id";

      console.log("Creating order:", orderDto);

      // Show loading toast
      const loadingToast = toast.loading("Захиалга үүсгэж байна...");

      // Call the API to create order
      const response = await createOrderMutation.mutateAsync(orderDto);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.success) {
        // Show success toast
        toast.success("Захиалга амжилттай үүсгэгдлээ!", {
          // description: `Захиалгын дугаар: ${response.id}`,
          duration: 4000,
        });

        // Clear cart and close slide
        clearCart();
        onOrderSuccess?.(response.id?.toString() || "ORDER_SUCCESS");
        onClose();
      } else {
        toast.error("Захиалга үүсгэхэд алдаа гарлаа", {
          description: response.message,
        });
      }
    } catch (error: any) {
      console.error("Order creation error:", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Захиалга үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.";

      toast.error("Захиалга үүсгэхэд алдаа гарлаа", {
        description: errorMessage,
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "review":
        return (
          <ItemSelectionStep
            cartItems={cartItems}
            isLoading={inventoryLoading}
            onToggleSelection={toggleItemSelection}
            onQuantityChange={updateOrderQuantity}
          />
        );
      case "shipping":
        return (
          <ShippingStep
            shippingMethod={shippingMethod}
            shippingAddress={shippingAddress}
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            addressesLoading={addressesLoading}
            onMethodChange={setShippingMethod}
            onAddressChange={setShippingAddress}
            onAddressSelect={(addressId) => {
              setSelectedAddressId(addressId);
              const selectedAddr = addresses.find(
                (addr) => addr.id.toString() === addressId
              );
              if (selectedAddr) {
                setShippingAddress({
                  full_address: selectedAddr.full_address,
                  city: selectedAddr.city,
                  district: selectedAddr.district,
                  khoroo: selectedAddr.khoroo,
                  postal_code: selectedAddr.postal_code,
                  phone: selectedAddr.phone,
                  recipient_name: selectedAddr.recipient_name,
                  notes: selectedAddr.notes,
                });
                toast.success("Хаяг сонгогдлоо", {
                  description: selectedAddr.title,
                });
              }
            }}
          />
        );
      case "payment":
        return (
          <PaymentStep
            totalAmount={totalAmount}
            shippingMethod={shippingMethod}
            notes={notes}
            onNotesChange={setNotes}
          />
        );
      case "confirmation":
        return (
          <ConfirmationStep
            selectedItems={selectedItems}
            customerInfo={customerInfo}
            shippingMethod={shippingMethod}
            shippingAddress={shippingAddress}
            totalAmount={totalAmount}
            shippingFee={shippingFee}
            notes={notes}
          />
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case "review":
        return selectedItems.length > 0;
      case "shipping":
        return (
          shippingMethod === ShippingMethod.PICKUP ||
          (shippingAddress?.city &&
            shippingAddress?.district &&
            shippingAddress?.full_address)
        );
      case "payment":
        return true; // Payment validation would go here
      case "confirmation":
        return true;
      default:
        return false;
    }
  };

  return (
    <Slide
      isOpen={isOpen}
      onClose={onClose}
      title="Захиалга үүсгэх"
      footer={
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={currentStep === "review" ? onClose : handlePrevStep}
          >
            {currentStep === "review" ? "Цуцлах" : "Буцах"}
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedCount} зүйл • {formatCurrency(totalAmount)}
            </span>

            {currentStep === "confirmation" ? (
              <Button
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? "Үүсгэж байна..." : "Захиалга үүсгэх"}
              </Button>
            ) : (
              <Button onClick={handleNextStep} disabled={!canProceed()}>
                Дараах
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="flex flex-col">
        {/* Progress Steps */}
        <ProgressSteps 
          steps={steps} 
          currentStep={currentStep} 
          className="mb-8"
        />

        {/* Step Title */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            {steps.find((s) => s.id === currentStep)?.title}
          </h2>
        </div>

        {/* Step Content */}
        <div>{renderStepContent()}</div>
      </div>
    </Slide>
  );
}

// Item Selection Step Component
function ItemSelectionStep({
  cartItems,
  isLoading,
  onToggleSelection,
  onQuantityChange,
}: {
  cartItems: any[];
  isLoading: boolean;
  onToggleSelection: (itemId: number) => void;
  onQuantityChange: (itemId: number, newQuantity: number) => void;
}) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">
          Агуулах ачааллаж байна...
        </div>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Paper key={i} variant="compact" className="animate-pulse">
              <div className="flex items-center gap-3 p-4">
                <div className="w-12 h-12 bg-muted rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
                <div className="w-20 h-8 bg-muted rounded"></div>
              </div>
            </Paper>
          ))}
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Агуулах хоосон байна</h3>
        <p className="text-muted-foreground">
          Та одоогоор ямар нэгэн эд зүйлтэй байхгүй байна
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Захиалахаар хүссэн эд зүйлсээ сонгоод тоог оруулна уу
      </div>

      <div className="flex flex-col gap-3">
        {cartItems.map((cartItem, index) => {
          const item = cartItem.item;
          const quantity = cartItem.quantity || 1;
          const isSelected = cartItem.isSelected;
          const orderQuantity = cartItem.orderQuantity;

          return (
            <Paper
              key={`${item.id}-${index}`}
              variant="compact"
              className={`relative transition-all cursor-pointer overflow-hidden ${
                isSelected ? "ring-1 ring-primary bg-primary/5" : ""
              }`}
              onClick={() => onToggleSelection(item.id)}
            >
              {/* Selection Checkbox - Top Right */}
              <div className="absolute top-3 right-3 z-10">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-primary border-primary"
                      : "bg-white border-gray-300 hover:border-primary/50"
                  }`}
                >
                  {isSelected && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>

              <div>
                {/* Item Image and Details */}
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0 bg-muted rounded-md p-1">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 object-contain"
                    />
                    {/* Available quantity badge */}
                    <div className="absolute -bottom-1 -right-1 bg-muted text-muted-foreground text-xs w-5 h-5 text-center items-center rounded-full border border-background">
                      {quantity}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-base mb-1 truncate">
                      {item.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {formatCurrency(item.price)}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Агуулахад: {quantity} ширхэг
                    </div>
                  </div>
                </div>

                {/* Selection-specific content */}
                {isSelected && (
                  <div className="space-y-3 pt-3 border-t-2 border-dotted border-muted/30 mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        Захиалах тоо:
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuantityChange(
                              item.id,
                              Math.max(1, orderQuantity - 1)
                            );
                          }}
                          disabled={orderQuantity <= 1}
                          className="w-8 h-8 p-0 rounded-full"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <div className="text-center w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-foreground">
                            {orderQuantity}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuantityChange(
                              item.id,
                              Math.min(quantity, orderQuantity + 1)
                            );
                          }}
                          disabled={orderQuantity >= quantity}
                          className="w-8 h-8 p-0 rounded-full"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Нийт үнэ:
                      </span>
                      <div className="text-lg font-bold text-primary">
                        {formatCurrency(item.price * orderQuantity)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Non-selected state preview */}
                {/* {!isSelected && (
                  <div className="pt-2 border-t border-muted/20">
                    <div className="text-xs text-muted-foreground text-center">
                      Захиалахын тулд сонгоно уу
                    </div>
                  </div>
                )} */}
              </div>
            </Paper>
          );
        })}
      </div>
    </div>
  );
}

// Shipping Step Component
function ShippingStep({
  shippingMethod,
  shippingAddress,
  addresses,
  selectedAddressId,
  addressesLoading,
  onMethodChange,
  onAddressChange,
  onAddressSelect,
}: {
  shippingMethod: ShippingMethod;
  shippingAddress: ShippingAddress | null;
  addresses: Address[];
  selectedAddressId: string;
  addressesLoading: boolean;
  onMethodChange: (method: ShippingMethod) => void;
  onAddressChange: (address: ShippingAddress) => void;
  onAddressSelect: (addressId: string) => void;
}) {
  const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
    onAddressChange({
      ...shippingAddress,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Shipping Method Selection */}
      <div>
        {/* <Label className="text-base font-medium mb-3 block">
          Хүргэлтийн арга
        </Label> */}
        <div className="space-y-3">
          {SHIPPING_METHODS.map((method) => (
            <div key={method.value} className="flex items-center space-x-2">
              <input
                type="radio"
                id={method.value}
                name="shipping-method"
                value={method.value}
                checked={shippingMethod === method.value}
                onChange={() => onMethodChange(method.value)}
                className="w-4 h-4 text-blue-600"
              />
              <Label htmlFor={method.value} className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between gap-2">
                  <span>{method.label}</span>
                  <span className="text-sm text-muted-foreground">
                    {method.fee > 0 ? formatCurrency(method.fee) : "Үнэгүй"}
                  </span>
                </div>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Address (only for delivery method) */}
      {shippingMethod === ShippingMethod.DELIVERY && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Хүргэлтийн хаяг</Label>
            <Link href="/profile/shipments">
              <Button type="button" variant="secondary" className="text-sm">
                <Plus className="w-4 h-4 mr-1" />
                Шинэ хаяг нэмэх
              </Button>
            </Link>
          </div>

          {/* Saved Addresses Selection */}
          <div className="space-y-3">
            {addressesLoading ? (
              <div className="text-center text-muted-foreground py-4">
                Хаягууд ачаалагдаж байна...
              </div>
            ) : addresses.length > 0 ? (
              <RadioGroup
                value={selectedAddressId}
                onValueChange={onAddressSelect}
              >
                {addresses.map((address) => (
                  <Paper
                    key={address.id}
                    variant="compact"
                    className="flex items-start space-x-3 rounded-lg"
                  >
                    <RadioGroupItem
                      value={address.id.toString()}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium flex items-center gap-2">
                        {address.title}
                        {address.is_default && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                            Үндсэн
                          </span>
                        )}
                      </div>

                      {/* Enhanced address display */}
                      <div className="text-sm text-muted-foreground space-y-1 mt-1">
                        {/* Recipient info */}
                        {address.recipient_name && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{address.recipient_name}</span>
                          </div>
                        )}

                        {/* Phone */}
                        {address.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{address.phone}</span>
                          </div>
                        )}

                        {/* Full address */}
                        <div className="flex items-start gap-1">
                          <MapPin className="w-3 h-3 mt-0.5" />
                          <div>
                            <div>{address.full_address}</div>
                            <div className="text-xs">
                              {address.khoroo && `${address.khoroo}-р хороо, `}
                              {address.district}, {address.city}
                              {address.postal_code && ` ${address.postal_code}`}
                            </div>
                          </div>
                        </div>

                        {/* Notes */}
                        {address.notes && (
                          <div className="flex items-start gap-1">
                            <MessageSquare className="w-3 h-3 mt-0.5" />
                            <span className="text-xs">{address.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Paper>
                ))}
              </RadioGroup>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                Хадгалагдсан хаяг байхгүй байна. Шинэ хаяг нэмнэ үү.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Payment Step Component
function PaymentStep({
  totalAmount,
  shippingMethod,
  notes,
  onNotesChange,
}: {
  totalAmount: number;
  shippingMethod: ShippingMethod;
  notes?: string;
  onNotesChange: (notes: string) => void;
}) {
  const shippingFee =
    SHIPPING_METHODS.find((m) => m.value === shippingMethod)?.fee || 0;
  const itemsTotal = totalAmount - shippingFee;

  return (
    <div className="space-y-6">
      <Paper>
        <h3 className="font-medium mb-3">Төлбөрийн дэлгэрэнгүй</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Барааны үнэ:</span>
            <span>{formatCurrency(itemsTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Хүргэлтийн төлбөр:</span>
            <span>{formatCurrency(shippingFee)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-medium">
            <span>Нийт төлөх дүн:</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </Paper>

      <div className="p-4 border border-dashed rounded-lg text-center text-muted-foreground">
        <CreditCard className="w-8 h-8 mx-auto mb-2" />
        <p>Төлбөрийн арга сонгох хэсэг энд байна</p>
        <p className="text-sm mt-1">Одоогоор захиалга үүсгэх боломжтой</p>
      </div>

      {/* Order Notes */}
      <div>
        <Label htmlFor="orderNotes" className="mb-4">
          Нэмэлт тэмдэглэл
        </Label>
        <Textarea
          id="orderNotes"
          value={notes || ""}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onNotesChange(e.target.value)
          }
          placeholder="Захиалгын талаарх нэмэлт мэдээлэл..."
          rows={3}
        />
      </div>
    </div>
  );
}

// Confirmation Step Component
function ConfirmationStep({
  selectedItems,
  customerInfo,
  shippingMethod,
  shippingAddress,
  totalAmount,
  shippingFee,
  notes,
}: {
  selectedItems: any[];
  customerInfo: { name: string; email: string; phone?: string };
  shippingMethod: ShippingMethod;
  shippingAddress: ShippingAddress | null;
  totalAmount: number;
  shippingFee: number;
  notes?: string;
}) {
  const shippingMethodLabel = SHIPPING_METHODS.find(
    (m) => m.value === shippingMethod
  )?.label;

  return (
    <div className="space-y-6">
      <div className="text-center p-6 bg-green-300/10 rounded-lg">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-green-500">
          Захиалга хийхэд бэлэн
        </h3>
        <p className="text-sm text-green-600">
          Доорх мэдээллийг шалгаад захиалгаа батална уу
        </p>
      </div>

      {/* Order Items */}
      <div>
        <h4 className="font-medium mb-3">
          Захиалсан бараа ({selectedItems.length})
        </h4>
        <div className="space-y-2">
          {selectedItems.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center text-sm"
            >
              <span>
                {item.item.name} × {item.orderQuantity}
              </span>
              <span>
                {formatCurrency(item.item.price * item.orderQuantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Customer Info */}
      <div>
        <h4 className="font-medium mb-3">Хэрэглэгчийн мэдээлэл</h4>
        <div className="space-y-1 text-sm">
          <div>Нэр: {customerInfo.name}</div>
          <div>Имэйл: {customerInfo.email}</div>
          {customerInfo.phone && <div>Утас: {customerInfo.phone}</div>}
        </div>
      </div>

      <Separator />

      {/* Shipping Info */}
      <div>
        <h4 className="font-medium mb-3">Хүргэлтийн мэдээлэл</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Арга: {shippingMethodLabel}
            </span>
          </div>

          {shippingMethod === ShippingMethod.DELIVERY && shippingAddress && (
            <div className="space-y-2">
              {/* Recipient info */}
              {shippingAddress.recipient_name && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {shippingAddress.recipient_name}
                  </span>
                </div>
              )}

              {/* Phone */}
              {shippingAddress.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {shippingAddress.phone}
                  </span>
                </div>
              )}

              {/* Address */}
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-muted-foreground">
                    {shippingAddress.full_address}
                  </div>
                  <div className="text-muted-foreground">
                    {shippingAddress.khoroo &&
                      `${shippingAddress.khoroo}-р хороо, `}
                    {shippingAddress.district}, {shippingAddress.city}
                    {shippingAddress.postal_code &&
                      ` ${shippingAddress.postal_code}`}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {shippingAddress.notes && (
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground italic">
                    {shippingAddress.notes}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {notes && (
        <>
          <Separator />
          <div>
            <h4 className="font-medium mb-3">Тэмдэглэл</h4>
            <p className="text-sm text-muted-foreground">{notes}</p>
          </div>
        </>
      )}

      <Separator />

      {/* Cost Breakdown */}
      <div className="mb-30">
        <h4 className="font-medium mb-3">Төлбөрийн дэлгэрэнгүй</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span>Барааны үнэ:</span>
            <span>{formatCurrency(totalAmount - shippingFee)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Хүргэлтийн төлбөр:</span>
            <span>{formatCurrency(shippingFee)}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center font-semibold text-base">
            <span>Нийт дүн:</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
