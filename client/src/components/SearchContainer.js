import { FormRow, FormRowSelect } from '.';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/SearchContainer';

const SearchContainer = () => {
  const { isLoading, search, searchStatus, searchType, sort, sortOptions, statusOptions, jobTypeOptions, handleChange, clearFilters } = useAppContext();

  const handleSearch = (e) => {
    // prevents user doing things like adding more search queries while fetching from db
    if (isLoading) return;
    handleChange({ name: e.target.name, value: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearFilters();
  }

  return (
    <Wrapper>
      <form className='form'>
        <h4>search form</h4>
        <div className='form-center'>
          {/* search */}
          <FormRow type='text' name='search' value={search} handleChange={handleSearch}></FormRow>
          {/* status filter */}
          <FormRowSelect labelText='status' name='searchStatus' value={searchStatus} handleChange={handleSearch} list={['all', ...statusOptions]}></FormRowSelect>
          {/* jobType filter */}
          <FormRowSelect labelText='type' name='searchType' value={searchType} handleChange={handleSearch} list={['all', ...jobTypeOptions]}></FormRowSelect>
          {/* sorting */}
          <FormRowSelect name='sort' value={sort} handleChange={handleSearch} list={sortOptions}></FormRowSelect>
          <button onClick={handleSubmit} className='btn btn-block btn-danger' disabled={isLoading}>Clear Filters</button>
        </div>
      </form>
    </Wrapper>
  );
};

export default SearchContainer;