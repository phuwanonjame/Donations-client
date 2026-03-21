const FormButton = ({ loading, isDirty, children }) => {
  const disabled = loading || !isDirty;

  return (
    <button
      type="submit"
      disabled={disabled}
      className="bg-blue-500 text-white px-4 py-2 w-full disabled:opacity-50"
    >
      {loading ? "Saving..." : children}
    </button>
  );
};

export default FormButton;