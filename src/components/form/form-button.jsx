import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";


const FormButton = ({ loading, isDirty, children, className="" }) => {
  const disabled = loading || !isDirty;

  return (
    <Button
      type="submit"
      disabled={disabled}
      className={className}
    >
      {loading ? <><LoaderCircle className="animate-spin"/> Saving...</> : children}
    </Button>
  );
};

export default FormButton;