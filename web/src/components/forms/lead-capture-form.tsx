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
import { useLanguage } from "@/contexts/language-context";

type LeadFormData = {
  fullName: string;
  email?: string;
  phone?: string;
  lineId?: string;
  preferredContact: "email" | "phone" | "line";
};

interface LeadCaptureFormProps {
  onSuccess?: () => void;
  compact?: boolean;
}

export function LeadCaptureForm({ onSuccess, compact = false }: LeadCaptureFormProps) {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { setContactInfo } = useWizardStore();

  const leadSchema = z.object({
    fullName: z.string().min(2, t("form.validation.name")),
    email: z.string().email(t("form.validation.email")).optional().or(z.literal("")),
    phone: z.string().min(9, t("form.validation.phone")).optional().or(z.literal("")),
    lineId: z.string().min(3, t("form.validation.line")).optional().or(z.literal("")),
    preferredContact: z.enum(["email", "phone", "line"]),
  }).refine(
    (data) => data.email || data.phone || data.lineId,
    { message: t("form.validation.contactMethod"), path: ["email"] }
  );

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
        className="text-center py-8 px-4"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{t("form.thankYou")}</h3>
        <p className="text-gray-600">
          {t("form.advisorContact")}
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register("fullName")}
        placeholder={t("form.yourName")}
        icon={<User className="w-5 h-5" />}
        error={errors.fullName?.message}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          {t("form.contactMethod")}
        </label>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { value: "line", icon: MessageCircle, labelKey: "form.line" },
            { value: "phone", icon: Phone, labelKey: "form.phone" },
            { value: "email", icon: Mail, labelKey: "form.email" },
          ].map(({ value, icon: Icon, labelKey }) => (
            <button
              key={value}
              type="button"
              onClick={() => setValue("preferredContact", value as LeadFormData["preferredContact"])}
              className={`
                flex flex-col items-center gap-1 p-2 sm:p-3 rounded-xl border-2 transition-all
                ${preferredContact === value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{t(labelKey)}</span>
            </button>
          ))}
        </div>
      </div>

      {preferredContact === "line" && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          <Input
            {...register("lineId")}
            placeholder={t("form.lineId")}
            icon={<MessageCircle className="w-5 h-5" />}
            error={errors.lineId?.message}
          />
        </motion.div>
      )}

      {preferredContact === "phone" && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          <Input
            {...register("phone")}
            placeholder={t("form.phoneNumber")}
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
            placeholder={t("form.emailAddress")}
            type="email"
            icon={<Mail className="w-5 h-5" />}
            error={errors.email?.message}
          />
        </motion.div>
      )}

      {errors.email?.message === t("form.validation.contactMethod") && (
        <p className="text-sm text-red-500">{errors.email.message}</p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {t("form.submitting")}
          </>
        ) : (
          t("form.getMyFreeQuote")
        )}
      </Button>

      <p className="text-xs text-center text-gray-500 mt-3">
        {t("form.disclaimer")}
      </p>
    </form>
  );
}
