import { LoginForm } from "@/presentation/login/LoginForm";
import { loginAction } from "./actions";

export default function LoginPage() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center py-16 px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-2xl font-semibold text-center">MedBridge</h1>
        <LoginForm action={loginAction} />
      </div>
    </main>
  );
}
