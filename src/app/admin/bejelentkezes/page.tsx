import { FcGoogle } from "react-icons/fc";
import { signIn } from "@/auth";
import BackgroundBlur from "@/components/BackgroundBlur";
import { Button } from "@/components/Button";
import Image from "next/image";

const LoginPage = async () => {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <BackgroundBlur className="!max-w-md">
        <Image
          src="/logo-only-head.svg"
          alt="Logo"
          width={71}
          height={80}
          className="mb-4 mx-auto"
        />
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/admin" });
          }}
          className="flex flex-col justify-center items-center space-y-4"
        >
          <h1 className="mb-4">Botanic Beauty Booking</h1>
          <Button type="submit">
            <FcGoogle className="mr-2" /> Bejelentkezés
          </Button>
        </form>
      </BackgroundBlur>
    </div>
  );
};

export default LoginPage;
