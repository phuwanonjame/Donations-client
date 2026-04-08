import FormWrapper from "@/components/form/form-wrapper";
import CategorySelector from "./category-selector";
import FormButton from "@/components/form/form-button";
import { Save, User } from "lucide-react";
import { motion } from "framer-motion";

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
          <div className="">
            <CategorySelector name="categories" disabled={loading}/>

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
          </div>
        </motion.div>
      )}
    </FormWrapper>
  );
}
