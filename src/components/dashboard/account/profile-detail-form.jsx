"use client";
import React from "react";
import { motion } from "framer-motion";
import { Save, User } from "lucide-react";
import { Label } from "@/components/ui/label";

import FormWrapper from "@/components/form/form-wrapper";

import { profileDetailSchema } from "@/schemas/profile.schema";
import FormButton from "@/components/form/form-button";
import FormField from "@/components/form/form-field";

const profile = {
  displayName: "Creator",
  fullName: "",
  email: "creator@example.com",
  phone: "",
  birthDate: "",
  bio: "",
  country: "",
};

const ProfileDetailForm = () => {
  const onSubmit = async (data) => {
    await new Promise((res) => setTimeout(res, 1500));
    console.log(data);
  };

  return (
    <FormWrapper

      schema={profileDetailSchema}
      onSubmit={onSubmit}
      defaultValues={{
        displayName: profile.displayName,
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        birthDate: profile.birthDate,
        bio: profile.bio,
        country: profile.country,
      }}
    >
      {({ loading, isDirty }) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl p-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Personal Information
              </h3>
              <p className="text-slate-400 text-sm">
                Update your personal details
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Display Name</Label>
                <FormField
                  value={profile.displayName}
                  name="displayName"
                  placeholder={""}
                  loading={loading}
                  className="bg-slate-800/80 border-slate-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Full Name</Label>
                <FormField
                  value={profile.fullName}
                  name="fullName"
                  placeholder={""}
                  loading={loading}
                  className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Country / Region</Label>
                <FormField
                  name="country"
                  type="select"
                  placeholder={"Select your country"}
                  loading={loading}
                  options={[
                    { label: "🇹🇭 Thailand", value: "th" },
                    { label: "🇺🇸 United States", value: "us" },
                    { label: "🇯🇵 Japan", value: "jp" },
                    { label: "🇰🇷 South Korea", value: "kr" },
                  ]}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Date of Birth</Label>
                <FormField
                  type="date"
                  value={profile.birthDate}
                  name="birthDate"
                  loading={loading}
                  className="bg-slate-800/80 border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Bio / About</Label>
              <FormField
                name="bio"
                type="textarea"
                value={profile.bio}
                loading={loading}
                placeholder="Tell your supporters about yourself..."
                className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 min-h-[100px]"
              />
            </div>
          </div>
          {/* BUTTON */}
          <div className="mt-6 flex justify-end">
            <FormButton
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 px-8"
              loading={loading}
              isDirty={isDirty}
            >
              <Save className="w-4 h-4" />
              Save
            </FormButton>
          </div>
        </motion.div>
      )}
    </FormWrapper>
  );
};

export default ProfileDetailForm;
