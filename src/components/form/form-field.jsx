"use client";

import { useFormContext } from "react-hook-form";

const FormField = ({
  name,
  type = "text", // text | textarea | select | switch
  placeholder,
  options = [],
  loading,
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const value = watch(name);

  return (
    <div className="space-y-1">
      {/* TEXT */}
      {type === "text" && (
        <input
          {...register(name)}
          placeholder={placeholder}
          disabled={loading}
          className="border p-2 w-full disabled:opacity-50 text-white"
        />
      )}

      {/* TEXTAREA */}
      {type === "textarea" && (
        <textarea
          {...register(name)}
          placeholder={placeholder}
          disabled={loading}
          className="border p-2 w-full disabled:opacity-50 text-white"
        />
      )}

      {/* SELECT */}
      {type === "select" && (
        <select
          {...register(name)}
          disabled={loading}
          className="border p-2 w-full disabled:opacity-50 text-white"
        >
          <option value="">เลือก...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {/* SWITCH */}
      {type === "switch" && (
        <div className="flex items-center gap-2 text-white">
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => setValue(name, e.target.checked)}
            disabled={loading}
          />
          <span>{value ? "เปิด" : "ปิด"}</span>
        </div>
      )}

      {/* ERROR */}
      {errors[name] && (
        <p className="text-red-500 text-sm">
          {errors[name].message}
        </p>
      )}
    </div>
  );
};

export default FormField;