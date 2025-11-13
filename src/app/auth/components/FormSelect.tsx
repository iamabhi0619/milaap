"use client";

interface FormSelectProps {
  name: string;
  options: { value: string; label: string }[];
  ariaLabel: string;
}

export default function FormSelect({ name, options, ariaLabel }: FormSelectProps) {
  return (
    <div>
      <select
        name={name}
        className="w-full border border-gray-300 rounded-full p-3 text-sm outline-none focus:ring-2 focus:ring-green"
        aria-label={ariaLabel}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
