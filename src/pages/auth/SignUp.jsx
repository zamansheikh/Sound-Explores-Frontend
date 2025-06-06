// src\pages\auth\SignUp.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EyeIcon, EyeOffIcon, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

// Simplified validation schema - only email, password, and terms
const signUpSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .transform((val) => val.replace(/\s+/g, "").toLowerCase()),
  password: z.string().min(6, "Password must be at least 6 characters"),
  agreeToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms" }),
  }),
});

const SignUp = () => {
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      agreeToTerms: false,
    },
  });

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const submitData = {
        ...data,
        email: data.email.replace(/\s+/g, "").toLowerCase(),
      };
      await signUp(submitData);
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => {
          if (err.path && err.path.includes("email")) {
            setError("email", {
              type: "manual",
              message: err.message || "Invalid email format",
            });
          }
          if (err.path && err.path.includes("password")) {
            setError("password", {
              type: "manual",
              message: err.message || "Invalid password format",
            });
          }
        });
      }
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-background flex flex-row justify-center w-full min-h-screen">
      <div className="bg-card w-full max-w-md relative">
        <Helmet>
          <title>Sign Up - Poop Alert</title>
          <meta
            name="description"
            content="Create a new Sound Explores account"
          />
          <meta property="og:title" content="Sign Up - Poop Alert" />
          <meta
            property="og:description"
            content="Create a new Sound Explores account"
          />
          <meta
            property="og:image"
            content="https://i.postimg.cc/HkHXj7zF/logo.png"
          />
          <meta property="og:url" content="https://poopalert.fun/signup" />
          <meta property="og:type" content="website" />
        </Helmet>

        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`flex items-center justify-between p-4 border-b bg-card sticky top-0 z-10 transition-shadow ${
            scrolled ? "shadow-md" : ""
          }`}
        >
          <div className="flex items-center">
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.0 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-background hover:rounded-full border-gray-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.div>
            </Link>
            <h1 className="text-xl font-bold">Sign Up</h1>
          </div>
        </motion.div>

        {/* Logo */}
        <div className="mr-0.5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center p-6 border-b bg-background"
          >
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-36 h-36 object-cover"
              alt="Logo"
              src="/logo.png"
            />
            <h2 className="text-2xl text-black dark:text-white font-bold mb-1">
              Create Account
            </h2>
            <p className="text-xs text-muted-foreground">
              Enter your email and password to register
            </p>
          </motion.div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-base">
                Email<span className="text-red-400">*</span>
              </label>
              <Card className="p-0 w-full border border-solid border-gray-200 shadow-none">
                <CardContent className="p-0">
                  <Input
                    {...register("email")}
                    type="email"
                    className={`border-none px-4 py-3 h-auto text-foreground text-sm ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    placeholder="Enter your email address..."
                    onChange={(e) => {
                      e.target.value = e.target.value
                        .replace(/\s+/g, "")
                        .toLowerCase();
                      register("email").onChange(e);
                    }}
                  />
                </CardContent>
              </Card>
              {errors.email && (
                <span className="text-destructive text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-base">
                Password<span className="text-red-400">*</span>
              </label>
              <Card className="p-0 w-full border border-solid border-gray-200 shadow-none">
                <CardContent className="p-0 flex items-center relative">
                  <Input
                    {...register("password")}
                    className={`border-none px-4 py-3 h-auto text-foreground text-sm pr-12 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    placeholder="Enter your Password..."
                    type={showPassword ? "text" : "password"}
                  />
                  <div
                    className="absolute right-4 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <EyeIcon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </CardContent>
              </Card>
              {errors.password && (
                <span className="text-destructive text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2">
              <Controller
                name="agreeToTerms"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="terms"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className={`mt-1 w-4 h-4 rounded border-2 ${
                      errors.agreeToTerms ? "border-red-500" : "border-blue-500"
                    }`}
                  />
                )}
              />
              <label
                htmlFor="terms"
                className="cursor-pointer text-sm text-foreground"
              >
                I agree and accept the Poop Alert{" "}
                <Link
                  to="/privacy-policy"
                  className="text-primary hover:underline"
                >
                  Terms of Service & Privacy Policy
                </Link>
              </label>
            </div>
            {errors.agreeToTerms && (
              <span className="text-destructive text-sm block mt-1">
                {errors.agreeToTerms.message}
              </span>
            )}

            {/* Sign Up Button */}
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                type="submit"
                className="w-full py-3 bg-primary rounded-full text-white font-medium hover:bg-blue-600 transition-colors"
              >
                Sign Up
              </Button>
            </motion.div>

            {/* Already have an account */}
            <div className="flex items-center justify-center gap-1 mt-2">
              <p className="text-foreground text-sm">
                Already have an account?
              </p>
              <Link to="/" className="font-medium text-blue-500 text-sm">
                Sign In
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
