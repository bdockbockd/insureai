"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, User, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWizardStore } from "@/store/wizard-store";

const leadSchema = z.object({
  fullName: z.string().min(2, "Please enter your name"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().min(9, "Invalid phone number").optional().or(z.literal("")),
  lineId: z.string().min(3, "Invalid LINE ID").optional().or(z.literal("")),
  preferredContact: z.enum(["email", "phone", "line"]),
}).refine(
  (data) => data.email || data.phone || data.lineId,
  { message: "Please provide at least one contact method", path: ["email"] }
);

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadCaptureFormProps {
  onSuccess?: () => void;
  compact?: boolean;
}

export function LeadCaptureForm({ onSuccess, compact = false }: LeadCaptureFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { setContactInfo } = useWizardStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      preferredContact: "line",
    },
  });

  const preferredContact = watch("preferredContact");

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setContactInfo(data);
        setIsSuccess(true);
        onSuccess?.();
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-600">
          Our insurance advisor will contact you within 24 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register("fullName")}
        placeholder="Your name"
        icon={<User className="w-5 h-5" />}
        error={errors.fullName?.message}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          How would you like us to contact you?
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "line", icon: MessageCircle, label: "LINE" },
            { value: "phone", icon: Phone, label: "Phone" },
            { value: "email", icon: Mail, label: "Email" },
          ].map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setValue("preferredContact", value as LeadFormData["preferredContact"])}
              className={`
                flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all
                ${preferredContact === value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {preferredContact === "line" && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          <Input
            {...register("lineId")}
            placeholder="LINE ID"
            icon={<MessageCircle className="w-5 h-5" />}
            error={errors.lineId?.message}
          />
        </motion.div>
      )}

      {preferredContact === "phone" && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          <Input
            {...register("phone")}
            placeholder="Phone number"
            type="tel"
            icon={<Phone className="w-5 h-5" />}
            error={errors.phone?.message}
          />
        </motion.div>
      )}

      {preferredContact === "email" && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          <Input
            {...register("email")}
            placeholder="Email address"
            type="email"
            icon={<Mail className="w-5 h-5" />}
            error={errors.email?.message}
          />
        </motion.div>
      )}

      {errors.email?.message === "Please provide at least one contact method" && (
        <p className="text-sm text-red-500">{errors.email.message}</p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Get My Free Quote"
        )}
      </Button>

      <p className="text-xs text-center text-gray-500">
        By submitting, you agree to be contacted by our insurance advisors.
        Your information is secure and will never be shared.
      </p>
    </form>
  );
}
