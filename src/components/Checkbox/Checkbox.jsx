import React from "react";
import PropTypes from "prop-types";
const Checkbox = ({ id, label, value, onCheckboxChange }) => {
  return (
    <div className="form-group form-check mr-2 ml-2">
      <input
        type="checkbox"
        className="form-check-input"
        id={id}
        checked={value}
        onChange={onCheckboxChange}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
};

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired
};

export default Checkbox;
