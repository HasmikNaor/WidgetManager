import { useNavigate } from "react-router-dom";

interface IDropdown {
  onChange?: (value: string) => void;
  selectedOption: string;
  label?: string;
  options: string[];
  title: string;
  className: string;
}
function Dropdown({
  onChange,
  selectedOption,
  label,
  title,
  options,
  className,
}: IDropdown) {
  const navigate = useNavigate();
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const val = event.target.value;
    navigate(`${val}`);
  };

  return (
    <div className={`${className}`}>
      <label htmlFor="dropdown" className={`${className}__label`}>
        {label || ""}
      </label>
      <select
        id="dropdown"
        value={selectedOption}
        onChange={handleChange}
        className={`${className}__select`}
      >
        <option value="" disabled className={`${className}__option`}>
          {title}
        </option>
        {options.map((option, i) => (
          <option value={option} className={`${className}__option`} key={i}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;
