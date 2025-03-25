import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthForm from "@/components/auth/AuthForm";
import { Plane } from "lucide-react";

const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Plane className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Flight Manager</h1>
          </div>
          <p className="text-muted-foreground">Admin Flight Management CRM</p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 border animate-fade-in">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "signup")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login" onClick={() => setActiveTab("login")}>Login</TabsTrigger>
              <TabsTrigger value="signup" onClick={() => setActiveTab("signup")}>Sign Up</TabsTrigger>
            </TabsList>

            {activeTab === "login" && (
              <TabsContent value="login">
                <h2 className="text-xl font-semibold mb-4">Sign In</h2>
                <AuthForm type="login" />
              </TabsContent>
            )}

            {activeTab === "signup" && (
              <TabsContent value="signup">
                <h2 className="text-xl font-semibold mb-4">Create Account</h2>
                <AuthForm type="signup" />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;