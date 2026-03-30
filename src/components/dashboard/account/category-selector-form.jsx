

import FormWrapper from "@/components/form/form-wrapper";
import CategorySelector from "./category-selector";
import FormButton from "@/components/form/form-button";
import { Save } from "lucide-react";

export default function CategorySelectorForm() {
  return (
    <FormWrapper
      defaultValues={{
        categories: [],
      }}
      onSubmit={async (data) => {
        console.log("submit:", data);

        // mock delay
        await new Promise((r) => setTimeout(r, 1500));
      }}
    >
      {({ loading, isDirty }) => (
        <div className="space-y-6 p-6">
          <CategorySelector name="categories" />

          <div className="mt-6 flex justify-end">
              <FormButton className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 px-8" loading={loading} isDirty={isDirty}>
                <Save className="w-4 h-4"/>
                Save
              </FormButton>
            </div>
        </div>
      )}
    </FormWrapper>
  );
}