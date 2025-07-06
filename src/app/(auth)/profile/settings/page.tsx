"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser, useUpdateUser } from "@/hooks/api";
import { useState } from "react";
import { toast } from "sonner";
import { Paper, HeaderWithIcon } from "@/components/common";

export default function ProfileSettings() {
  const { data: user, isLoading } = useCurrentUser();
  const updateUser = useUpdateUser();
  
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Имэйл хаяг оруулна уу");
      return;
    }
    if (!user?.id) {
      toast.error("Хэрэглэгчийн мэдээлэл олдсонгүй");
      return;
    }

    try {
      await updateUser.mutateAsync({ id: user.id, data: { email } });
      toast.success("Имэйл хаяг амжилттай шинэчлэгдлээ");
      setEmail("");
    } catch (error) {
      toast.error("Имэйл хаяг шинэчлэхэд алдаа гарлаа");
    }
  };

  const handleUsernameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Хэрэглэгчийн нэр оруулна уу");
      return;
    }
    if (username.length < 3 || username.length > 50) {
      toast.error("Хэрэглэгчийн нэр 3-50 тэмдэгт байх ёстой");
      return;
    }
    if (!user?.id) {
      toast.error("Хэрэглэгчийн мэдээлэл олдсонгүй");
      return;
    }

    try {
      await updateUser.mutateAsync({ id: user.id, data: { username } });
      toast.success("Хэрэглэгчийн нэр амжилттай шинэчлэгдлээ");
      setUsername("");
    } catch (error) {
      toast.error("Хэрэглэгчийн нэр шинэчлэхэд алдаа гарлаа");
    }
  };

  const handleFirstNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      toast.error("Нэр оруулна уу");
      return;
    }
    if (!user?.id) {
      toast.error("Хэрэглэгчийн мэдээлэл олдсонгүй");
      return;
    }

    try {
      await updateUser.mutateAsync({ id: user.id, data: { firstname: firstName } });
      toast.success("Нэр амжилттай шинэчлэгдлээ");
      setFirstName("");
    } catch (error) {
      toast.error("Нэр шинэчлэхэд алдаа гарлаа");
    }
  };

  const handleLastNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastName.trim()) {
      toast.error("Овог оруулна уу");
      return;
    }
    if (!user?.id) {
      toast.error("Хэрэглэгчийн мэдээлэл олдсонгүй");
      return;
    }

    try {
      await updateUser.mutateAsync({ id: user.id, data: { lastname: lastName } });
      toast.success("Овог амжилттай шинэчлэгдлээ");
      setLastName("");
    } catch (error) {
      toast.error("Овог шинэчлэхэд алдаа гарлаа");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground py-8">
        <div className="space-y-8">
          {/* Page Title Skeleton */}
          <HeaderWithIcon
            icon="⚙️"
            title="Тохиргоо"
          />
          
          {/* Settings Sections Skeleton */}
          <div className="flex flex-col xl:flex-row gap-10">
            {/* Email Section */}
            <section className="mb-10 flex-1">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="flex flex-col gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-10 w-32" />
              </div>
            </section>

            {/* Username Section */}
            <section className="mb-10 flex-1">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="flex flex-col gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-10 w-48" />
              </div>
            </section>
          </div>

          {/* Password Section */}
          <div className="flex flex-col xl:flex-row gap-10">
            <section className="mb-10 flex-1">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="flex flex-col gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-10 w-36" />
              </div>
            </section>
          </div>

          {/* Personal Information Section */}
          <div className="flex flex-col xl:flex-row gap-10 mb-10">
            {/* First Name */}
            <section className="mb-10 flex-1">
              <Skeleton className="h-6 w-16 mb-4" />
              <div className="flex flex-col gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-10 w-28" />
              </div>
            </section>

            {/* Last Name */}
            <section className="mb-10 flex-1">
              <Skeleton className="h-6 w-16 mb-4" />
              <div className="flex flex-col gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-10 w-28" />
              </div>
            </section>
          </div>

          {/* Sessions Section */}
          <section>
            <Skeleton className="h-6 w-20 mb-4" />
            <div className="bg-secondary p-6 rounded">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-56" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
                <div className="border-t border-border pt-4 flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
            <Skeleton className="h-4 w-80 mt-2" />
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <HeaderWithIcon
        icon="⚙️"
        title="Тохиргоо"
      />

      <div className="flex flex-col xl:flex-row gap-5 mb-5">
        {/* Email change */}
        <Paper className="flex-1">
          <h2 className="text-lg font-semibold mb-4">Имэйл хаяг солих</h2>
          <form onSubmit={handleEmailUpdate} className="flex flex-col gap-4">
            <Input
              type="email"
              placeholder={user?.email ? `Одоогийн: ${user.email}` : "Шинэ имэйл хаяг"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-lg placeholder:text-muted-foreground"
              disabled={updateUser.isPending}
            />
            <Button 
              type="submit"
              className="w-fit bg-primary text-primary-foreground font-semibold"
              disabled={updateUser.isPending || !email.trim()}
            >
              {updateUser.isPending ? "Шинэчилж байна..." : "Имэйл шинэчлэх"}
            </Button>
          </form>
        </Paper>

        {/* Username change */}
        <Paper className="flex-1">
          <h2 className="text-lg font-semibold mb-4">Хэрэглэгчийн нэр солих</h2>
          <form onSubmit={handleUsernameUpdate} className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder={user?.username ? `Одоогийн: ${user.username}` : "Шинэ хэрэглэгчийн нэр"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-lg placeholder:text-muted-foreground"
              minLength={3}
              maxLength={50}
              disabled={updateUser.isPending}
            />
            <div className="text-sm text-muted-foreground">
              Хэрэглэгчийн нэр 3-50 тэмдэгт байх ёстой
            </div>
            <Button 
              type="submit"
              className="w-fit bg-primary text-primary-foreground font-semibold"
              disabled={updateUser.isPending || !username.trim() || username.length < 3}
            >
              {updateUser.isPending ? "Шинэчилж байна..." : "Хэрэглэгчийн нэр шинэчлэх"}
            </Button>
          </form>
        </Paper>
      </div>

      <div className="flex flex-col xl:flex-row gap-5 mb-5">
        {/* Password change */}
        <Paper className="flex-1">
          <h2 className="text-lg font-semibold mb-4">Нууц үг солих</h2>
          <form className="flex flex-col gap-4">
            <Input
              type="password"
              placeholder="Одоогийн нууц үг"
              className="text-lg placeholder:text-muted-foreground"
            />
            <Input
              type="password"
              placeholder="Шинэ нууц үг"
              className="text-lg placeholder:text-muted-foreground"
            />
            <Input
              type="password"
              placeholder="Шинэ нууц үг давтах"
              className="text-lg placeholder:text-muted-foreground"
            />
            <Button className="w-fit bg-primary text-primary-foreground font-semibold">
              Нууц үг шинэчлэх
            </Button>
          </form>
        </Paper>
      </div>

      {/* Personal Information */}
      <div className="flex flex-col xl:flex-row gap-5 mb-5">
        {/* First Name */}
        <Paper className="flex-1">
          <h2 className="text-lg font-semibold mb-4">Нэр</h2>
          <form onSubmit={handleFirstNameUpdate} className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder={user?.firstname ? `Одоогийн: ${user.firstname}` : "Нэр"}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="text-lg placeholder:text-muted-foreground"
              maxLength={50}
              disabled={updateUser.isPending}
            />
            <Button 
              type="submit"
              className="w-fit bg-primary text-primary-foreground font-semibold"
              disabled={updateUser.isPending || !firstName.trim()}
            >
              {updateUser.isPending ? "Шинэчилж байна..." : "Нэр шинэчлэх"}
            </Button>
          </form>
        </Paper>

        {/* Last Name */}
        <Paper className="flex-1">
          <h2 className="text-lg font-semibold mb-4">Овог</h2>
          <form onSubmit={handleLastNameUpdate} className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder={user?.lastname ? `Одоогийн: ${user.lastname}` : "Овог"}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="text-lg placeholder:text-muted-foreground"
              maxLength={50}
              disabled={updateUser.isPending}
            />
            <Button 
              type="submit"
              className="w-fit bg-primary text-primary-foreground font-semibold"
              disabled={updateUser.isPending || !lastName.trim()}
            >
              {updateUser.isPending ? "Шинэчилж байна..." : "Овог шинэчлэх"}
            </Button>
          </form>
        </Paper>
      </div>

      {/* Sessions */}
      <Paper className="">
        <h2 className="text-lg font-semibold mb-4">Сессүүд</h2>
        <div className="bg-secondary p-6 rounded-lg">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Windows 10 • Chrome</div>
                <div className="text-sm text-muted-foreground">
                  Улаанбаатар, Монгол • 2025-06-20 21:35
                </div>
                <div className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs mt-1 rounded">
                  Энэ төхөөрөмж
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="px-4 border-white text-white border"
              >
                Гарах
              </Button>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <div className="font-medium">iPhone • Safari</div>
                <div className="text-sm text-muted-foreground">
                  Улаанбаатар, Монгол • 2025-06-16 09:12
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="px-4 border-white text-white border"
              >
                Гарах
              </Button>
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          Бүх төхөөрөмжүүд дээрх идэвхтэй сессүүд энд харагдана.
        </div>
      </Paper>
    </div>
  );
}
