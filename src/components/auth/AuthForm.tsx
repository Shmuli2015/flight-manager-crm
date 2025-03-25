import React, { useState } from "react";
import { Mail, KeyRound, Loader2, AlertCircle, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useSupabaseAuth";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

interface AuthFormProps {
    type: "login" | "signup";
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
    const { toast } = useToast();
    const { signIn, signUp, isLoading } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const clearErrors = () => {
        setError("");
    }

    const handleLogin = async () => {
        try {
            await signIn(email.trim(), password.trim());
            navigate("/");
        } catch (error: any) {
            setError(error.message || "Invalid email or password. Please try again.");
        }
    }

    const handleSignUp = async () => {
        try {
            await signUp(email.trim(), password.trim(), fullName.trim());
            navigate("/");
        } catch (error: any) {
            setError(error.message || "Error creating account. Please try again.");
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();

        if (type === "login" && email && password) {
            await handleLogin();
        } else {
            if (password.length < 6) {
                setError("Password must be at least 6 characters");
                return;
            }
            await handleSignUp();
            toast({
                title: "Account created",
                description: "Please check your email for a verification link.",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="flex items-center gap-2 text-sm p-3 mb-4 rounded bg-destructive/10 text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            {type === "signup" && (
                <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            onInput={clearErrors}
                            required
                            className="pl-10"
                        />
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onInput={clearErrors}
                        required
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onInput={clearErrors}
                        required
                        className="pl-10 pr-10"
                    />
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {showPassword ? "Hide password" : "Show password"}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {type === "login" ? "Sign In" : "Create Account"}
            </Button>
        </form>
    );
};

export default AuthForm;