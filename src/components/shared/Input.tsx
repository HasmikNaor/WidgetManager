interface IInput {
  label: string;
  name: string;
  type: string;
  onChange: (key: string, val: string) => void;
  className: string;
  value: string;
  isDisabled?: boolean;
  inputInfo?: string;
}
const Input = ({
  label,
  name,
  type,
  onChange,
  className,
  value,
  isDisabled,
  inputInfo,
}: IInput) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;

    onChange(name, val);
  };

  return (
    <div className={`${className}__input-wrapper`}>
      <label className={`${className}__label`} htmlFor={name}>
        {label}:
      </label>
      <input
        type={type}
        className={`${className}__input`}
        id={name}
        onChange={handleChange}
        value={value}
        disabled={!!isDisabled}
      />
      <span className={`${className}__input-wrapper`}>{inputInfo || ""}</span>
    </div>
  );
};

export default Input;
