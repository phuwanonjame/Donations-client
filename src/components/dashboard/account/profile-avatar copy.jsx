"use client";

import React, { useRef, useState, useEffect } from "react";
import FormWrapper from "@/components/form/form-wrapper";
import FormAvatarField from "@/components/form/form-avatar";
import FormField from "@/components/form/form-field";
import FormButton from "@/components/form/form-button";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

const ProfileAvatar = ({ profile }) => {
  const [preview, setPreview] = useState(profile?.avatarUrl || "");

  // cleanup memory
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    // ✅ validate type
    if (!file.type.startsWith("image/")) {
      setError("ต้องเป็นไฟล์รูปภาพเท่านั้น");
      return;
    }

    // ✅ validate size
    if (file.size > MAX_SIZE) {
      setError("ไฟล์ต้องไม่เกิน 2MB");
      return;
    }

    // preview ทันที
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      // (optional) ถ้า backend return url ใหม่
      const data = await res.json();
      if (data?.url) {
        setPreview(data.url); // ใช้ url จริงแทน blob
      }
    } catch (err) {
      console.error(err);
      setError("อัปโหลดไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      defaultValues={{
        displayName: "test",
        avatar: null, // 👈 สำคัญ
      }}
      onSubmit={async (data) => {
        const formData = new FormData();

        formData.append("displayName", data.displayName);

        if (data.avatar) {
          formData.append("avatar", data.avatar);
        }

        await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
      }}
    >
      {({ loading, isDirty }) => (
        <div className="space-y-6">
          <FormAvatarField name="avatar" profile={profile} loading={loading} />

          <FormField
            name="displayName"
            placeholder="ชื่อ"
            loading={loading}
            className="bg-slate-800/80 border-slate-700 text-white"
          />

          <FormButton loading={loading} isDirty={isDirty}>
            Save
          </FormButton>
        </div>
      )}
    </FormWrapper>
  );
};

export default ProfileAvatar;
