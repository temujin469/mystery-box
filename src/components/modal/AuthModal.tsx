"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

function GoogleIcon() {
  return <span className="text-xl">🌐</span>;
}
function DiscordIcon() {
  return <span className="text-xl">🕹️</span>;
}
function FacebookIcon() {
  return <span className="text-xl">📘</span>;
}
function XIcon() {
  return <span className="text-xl">✖️</span>;
}
function SteamIcon() {
  return <span className="text-xl mr-2">🎮</span>;
}

const loginSchema = z.object({
  email: z.string().email("Имэйл буруу байна"),
  password: z.string().min(6, "Нууц үг дор хаяж 6 тэмдэгт байх ёстой"),
});

const signupSchema = z
  .object({
    email: z.string().email("Имэйл буруу байна"),
    password: z.string().min(6, "Нууц үг дор хаяж 6 тэмдэгт байх ёстой"),
    confirm: z.string(),
    country: z.string().min(1, "Улс сонгоно уу"),
    agree: z.literal(true, {
      errorMap: () => ({
        message: "Үйлчилгээний нөхцөл зөвшөөрсөн байх ёстой",
      }),
    }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Нууц үг таарахгүй байна",
    path: ["confirm"],
  });

async function apiLogin(data: { email: string; password: string }) {
  await new Promise((r) => setTimeout(r, 800));
  if (data.email !== "test@example.com" || data.password !== "password123") {
    throw new Error("Имэйл эсвэл нууц үг буруу байна");
  }
  return { token: "mock-token" };
}

async function apiSignup(data: {
  email: string;
  password: string;
  country: string;
}) {
  await new Promise((r) => setTimeout(r, 800));
  if (data.email === "used@example.com") {
    throw new Error("Энэ имэйл бүртгэлтэй байна");
  }
  return { token: "mock-token" };
}

export function AuthModal({
  open,
  onOpenChange,
  variant ="signup"
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant:"signin" | "signup"
}) {
  const [tab, setTab] = React.useState<"signin" | "signup">(variant);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: signupRegister,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
    reset: resetSignup,
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { country: "Монгол", agree: false },
  });

  React.useEffect(() => {
    setSubmitError(null);
    resetLogin();
    resetSignup();
  }, [tab, open, resetLogin, resetSignup]);

  async function onLogin(data: z.infer<typeof loginSchema>) {
    setLoading(true);
    setSubmitError(null);
    try {
      await apiLogin(data);
      onOpenChange(false);
    } catch (e: any) {
      setSubmitError(e.message || "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  }

  async function onSignup(data: z.infer<typeof signupSchema>) {
    setLoading(true);
    setSubmitError(null);
    try {
      await apiSignup(data);
      onOpenChange(false);
    } catch (e: any) {
      setSubmitError(e.message || "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg w-full h-full sm:h-fit rounded-none border-none sm:rounded-xl p-6 bg-background text-foreground shadow-xl"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2">
            {tab === "signin" ? "Нэвтрэх" : "Бүртгүүлэх"}
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 text-xl opacity-80 hover:opacity-100" />
        </DialogHeader>
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as "signin" | "signup")}
        >
          <TabsList className="grid w-full grid-cols-2 mb-4 h-12">
            <TabsTrigger value="signin">Нэвтрэх</TabsTrigger>
            <TabsTrigger value="signup">Бүртгүүлэх</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="block mb-2 text-sm font-medium"
                >
                  Имэйл хаяг
                </label>
                <Input
                  id="login-email"
                  placeholder="Имэйл"
                  {...loginRegister("email")}
                  className={cn({ "border-red-500": loginErrors.email })}
                  autoComplete="email"
                />
                {loginErrors.email && (
                  <p className="text-sm text-red-500">
                    {loginErrors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block mb-2 text-sm font-medium"
                >
                  Нууц үг
                </label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Нууц үг"
                    {...loginRegister("password")}
                    className={cn({ "border-red-500": loginErrors.password })}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
               className="absolute right-3 top-0 text-muted-foreground h-full flex items-center"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {loginErrors.password && (
                  <p className="text-sm text-red-500">
                    {loginErrors.password.message}
                  </p>
                )}
              </div>

              {submitError && (
                <p className="text-sm text-red-500">{submitError}</p>
              )}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                Нэвтрэх
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignupSubmit(onSignup)} className="space-y-4">
              <div>
                <label
                  htmlFor="signup-email"
                  className="block mb-2 text-sm font-medium"
                >
                  Имэйл хаяг
                </label>
                <Input
                  id="signup-email"
                  placeholder="Имэйл"
                  {...signupRegister("email")}
                  className={cn({ "border-red-500": signupErrors.email })}
                  autoComplete="email"
                />
                {signupErrors.email && (
                  <p className="text-sm text-red-500">
                    {signupErrors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="signup-password"
                  className="block mb-2 text-sm font-medium"
                >
                  Нууц үг
                </label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Нууц үг"
                    {...signupRegister("password")}
                    className={cn({ "border-red-500": signupErrors.password })}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
            className="absolute right-3 top-0 text-muted-foreground h-full flex items-center"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {signupErrors.password && (
                  <p className="text-sm text-red-500">
                    {signupErrors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="signup-confirm"
                  className="block mb-2 text-sm font-medium"
                >
                  Нууц үг давтах
                </label>
                <div className="relative">
                  <Input
                    id="signup-confirm"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Нууц үг давтах"
                    {...signupRegister("confirm")}
                    className={cn({ "border-red-500": signupErrors.confirm })}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-0 text-muted-foreground h-full flex items-center"
                    onClick={() => setShowConfirm((s) => !s)}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {signupErrors.confirm && (
                  <p className="text-sm text-red-500">
                    {signupErrors.confirm.message}
                  </p>
                )}
              </div>

              {/* <div>
                <label htmlFor="signup-country" className="block mb-2 text-sm font-medium">Улс</label>
                <Input id="signup-country" placeholder="Улс" {...signupRegister("country")} className={cn({ "border-red-500": signupErrors.country })} />
                {signupErrors.country && <p className="text-sm text-red-500">{signupErrors.country.message}</p>}
              </div> */}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...signupRegister("agree")}
                  id="agree"
                />
                <label
                  htmlFor="agree"
                  className="text-sm text-muted-foreground"
                >
                  Би{" "}
                  <a href="#" className="underline">
                    үйлчилгээний нөхцөлийг
                  </a>{" "}
                  зөвшөөрч байна
                </label>
              </div>
              {signupErrors.agree && (
                <p className="text-sm text-red-500">
                  {signupErrors.agree.message}
                </p>
              )}

              {submitError && (
                <p className="text-sm text-red-500">{submitError}</p>
              )}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                Бүртгүүлэх
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        <div className="text-center text-sm text-muted-foreground mt-2">
          эсвэл
        </div>
        <div className="gap-2 mt-2 flex">
          <Button type="button" variant="outline" className="flex-1">
            <Image
              src="/img/icon/facebook.png"
              alt="google"
              width={17}
              height={17}
            />
            <p>Facebook</p>
          </Button>
          <Button type="button" variant="outline" className="flex-1">
            <Image
              src="/img/icon/google.png"
              alt="google"
              width={17}
              height={17}
            />
            <p>Facebook</p>

          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
