"use client";


import FormButton from "@/components/form/form-button";
import FormField from "@/components/form/form-field";
import FormWrapper from "@/components/form/form-wrapper";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(3, "อย่างน้อย 3 ตัวอักษร"),
  bio: z.string().optional(),
  role: z.string().min(1, "กรุณาเลือก role"),
  isPublic: z.boolean(),
});

export default function Page() {
  const onSubmit = async (data) => {
    await new Promise((res) => setTimeout(res, 1500));
    console.log(data);
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <FormWrapper
        schema={schema}
        onSubmit={onSubmit}
        defaultValues={{
          name: "",
          bio: "",
          role: "",
          isPublic: false,
        }}
        className="space-y-4"
      >
        {({ loading,isDirty }) => (
          <>
            <FormField
              name="name"
              placeholder="Your name"
              loading={loading}
            />

            <FormField
              name="bio"
              type="textarea"
              placeholder="Your bio"
              loading={loading}
            />

            <FormField
              name="role"
              type="select"
              loading={loading}
              options={[
                { label: "Admin", value: "admin" },
                { label: "User", value: "user" },
              ]}
            />

            <FormField
              name="isPublic"
              type="switch"
              loading={loading}
            />

            <FormButton loading={loading} isDirty={isDirty}>
              Save
            </FormButton>
          </>
        )}
      </FormWrapper>
    </div>
  );
}