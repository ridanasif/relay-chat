const FormField = ({ label, inputType, placeHolderText, Icon, onChange }) => {
  return (
    <>
      <label>{label}</label>
      <div className="bg-gray-100 rounded-md mt-2 flex items-center px-3 gap-x-2">
        {Icon}
        <input
          type={inputType}
          className="w-full py-3 outline-0 placeholder-gray-500"
          placeholder={placeHolderText}
          onChange={onChange}
        />
      </div>
    </>
  );
};

export default FormField;
