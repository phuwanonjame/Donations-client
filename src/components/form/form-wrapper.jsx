"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";

const FormWrapper = ({
  schema,
  defaultValues = {},
  onSubmit,
  children,
  className = "",
  successMessage = "บันทึกสำเร็จ",
}) => {
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
  });

  const {
    formState: { isDirty },
  } = methods;

  const handleSubmit = async (data) => {
    if (loading || !isDirty) return; // 🔒 กันกดซ้ำ + กัน submit เดิม

    try {
      setLoading(true);

      await onSubmit(data);

      methods.reset(data);

      toast.success(successMessage);
    } catch (err) {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSubmit)}
        className={className}
      >
        {children({ loading, isDirty })}
      </form>
    </FormProvider>
  );
};

export default FormWrapper;