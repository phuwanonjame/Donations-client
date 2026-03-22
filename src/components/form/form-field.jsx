"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const FormField = ({
  name,
  className = "",
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
    <>
      {/* TEXT */}
      {(type === "text" || type === "date") && (
        <Input
          type={type}
          {...register(name)}
          placeholder={placeholder}
          disabled={loading}
          className={className}
        />
      )}

      {/* TEXTAREA */}
      {type === "textarea" && (
        <Textarea
          {...register(name)}
          placeholder={placeholder}
          disabled={loading}
          className={className}
        />
      )}

      {/* SELECT */}
      {type === "select" && (
        <Select
          value={value || ""} // ✅ bind ค่า
          onValueChange={(val) => setValue(name, val, { shouldDirty: true })} // ✅ update form
          disabled={loading}
        >
          <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent className="bg-slate-800 border-slate-700">
            {options.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="text-white"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <p className="text-red-500 text-sm">{errors[name].message}</p>
      )}
    </>
  );
};

export default FormField;
