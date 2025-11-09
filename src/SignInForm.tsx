"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { LogIn, UserPlus, Ghost } from "lucide-react"; // Added for icons

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  return (
    // Added a wrapper to center the card on the page
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-100 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl dark:bg-gray-800"
      >
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          {flow === "signIn" ? "Welcome Back" : "Create Account"}
        </h2>

        <form
          className="space-y-6" // Replaced flex-col and gap
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitting(true);
            const formData = new FormData(e.target as HTMLFormElement);
            formData.set("flow", flow);
            void signIn("password", formData).catch((error) => {
              let toastTitle = "";
              if (error.message.includes("Invalid password")) {
                toastTitle = "Invalid password. Please try again.";
              } else {
                toastTitle =
                  flow === "signIn"
                    ? "Could not sign in. Check your email or sign up."
                    : "Could not sign up. Do you already have an account?";
              }
              toast.error(toastTitle);
              setSubmitting(false);
            });
          }}
        >
          {/* Enhanced Input Field */}
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              className="w-full px-4 py-3 text-gray-900 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:bg-gray-700 dark:text-white dark:focus:bg-gray-600"
              type="email"
              name="email"
              placeholder="Email"
              required
              disabled={submitting}
            />
          </div>

          {/* Enhanced Input Field */}
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              className="w-full px-4 py-3 text-gray-900 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:bg-gray-700 dark:text-white dark:focus:bg-gray-600"
              type="password"
              name="password"
              placeholder="Password"
              required
              disabled={submitting}
            />
          </div>

          {/* Enhanced Submit Button */}
          <button
            className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={submitting}
          >
            {flow === "signIn" ? (
              <LogIn size={18} />
            ) : (
              <UserPlus size={18} />
            )}
            {flow === "signIn" ? "Sign in" : "Sign up"}
          </button>

          {/* Enhanced Toggle Text/Button */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <span>
              {flow === "signIn"
                ? "Don't have an account? "
                : "Already have an account? "}
            </span>
            <button
              type="button"
              className="font-medium text-blue-600 hover:underline focus:outline-none dark:text-blue-400"
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
            >
              {flow === "signIn" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </form>

        {/* Enhanced "or" Divider */}
        <div className="flex items-center justify-center">
          <hr className="w-full border-t border-gray-300 dark:border-gray-600" />
          <span className="px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            OR
          </span>
          <hr className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>

        {/* Enhanced Anonymous Button (secondary style) */}
        <button
          className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          onClick={() => void signIn("anonymous")}
          disabled={submitting}
        >
          <Ghost size={18} />
          Sign in anonymously
        </button>
      </motion.div>
    </div>
  );
}