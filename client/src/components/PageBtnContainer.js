import { useAppContext } from '../context/appContext';
import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import Wrapper from '../assets/wrappers/PageBtnContainer';

function PageButtonContainer() {
  const { numOfPages, page, changePage } = useAppContext();

  const prevPage = () => {
    let newPage = page - 1;
    if (newPage < 1) {
      // Alternative - just stays on first page when at 1: newPage = 1
      newPage = numOfPages;
    }
    changePage(newPage);
  };

  const nextPage = () => {
    let newPage = page + 1;
    if (newPage > numOfPages) {
      // Alternative stays on last page, when at last page: newPage = numOfPages
      newPage = 1;
    }
    changePage(newPage);
  };

  // This makes the array template we need for our pages. Seems like a lot of work to get an array template for a length we have.. Note { length: numOfPages } is an 'array like' iterable as it has a length property.. asked chatGPT - seems like a hack to use the length property to generate an array 
  const pages = Array.from({ length: numOfPages }, (_, index) => {
    return index + 1;
  });

  const renderedPageNumber = pages.map((pageNumber) => {
    return (
        <button key={pageNumber} className={pageNumber === page ? 'pageBtn active' : 'pageBtn'} onClick={() => changePage(pageNumber)}>
            {pageNumber}
        </button>
    )
  })

  return (
    <Wrapper>
      <button className='prev-btn' onClick={prevPage}>
        <HiChevronDoubleLeft />
        prev
      </button>

      <div className='btn-container'>
        {renderedPageNumber}
      </div>

      <button className='next-btn' onClick={nextPage}>
        next
        <HiChevronDoubleRight />
      </button>
    </Wrapper>
  );
};

export default PageButtonContainer;