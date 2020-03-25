import React from "react";
import PropTypes from "prop-types";
const SingleSelect = ({ id, label, options, value, onOptionSelected }) => {
  return (
    <div className="form-group">
      <label htmlFor={id} className="text-capitalize">
        {label}
      </label>
      <select
        className="form-control"
        id={id}
        value={value}
        onChange={onOptionSelected}
      >
        {options.map(option => (
          <option
            className="text-capitalize"
            value={option.deviceId}
            key={option.deviceId}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

SingleSelect.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array.isRequired,
  value: PropTypes.object.isRequired,
  onOptionSelected: PropTypes.func.isRequired
};

export default SingleSelect;
