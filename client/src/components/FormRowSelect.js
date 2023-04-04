function FormRowSelect({ labelText, name, value, handleChange, list }) {

    const renderListItems = list.map((itemValue, index) => {
        return (
          <option key={index} value={itemValue}>{itemValue}</option>
        )
      })

    return (
        <div className='form-row'>
            <label htmlFor={name} className='form-label'>{labelText || name}</label>
            <select name={name} value={value} onChange={handleChange} className='form-select'>{renderListItems}</select>
        </div>
      )
    }
    
    export default FormRowSelect;