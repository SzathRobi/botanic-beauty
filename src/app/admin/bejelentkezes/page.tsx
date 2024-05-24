import { FcGoogle } from "react-icons/fc";
import { signIn } from "@/auth";
import BackgroundBlur from "@/components/BackgroundBlur";
import Button from "@/components/Button";

const LoginPage = async () => {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <BackgroundBlur>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/admin" });
          }}
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
