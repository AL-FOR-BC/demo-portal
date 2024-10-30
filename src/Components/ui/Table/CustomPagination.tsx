import paginationFactory from 'react-bootstrap-table2-paginator';

interface CustomPaginationProps {
  sizePerPage?: number;
  showTotal?: boolean;
  paginationSize?: number;
  hidePageListOnlyOnePage?: boolean;
}

const CustomPagination = ({
  sizePerPage = 10,
  showTotal = true,
  paginationSize = 5,
  hidePageListOnlyOnePage = true
}: CustomPaginationProps) => {
  const options = {
    page: 1,
    sizePerPage,
    totalSize: 0,
    pageStartIndex: 1,
    paginationSize,
    showTotal,
    hidePageListOnlyOnePage,
    firstPageText: '«',
    prePageText: '‹',
    nextPageText: '›',
    lastPageText: '»',
    sizePerPageList: [
      { text: '10', value: 10 },
      { text: '25', value: 25 },
      { text: '50', value: 50 },
      { text: '100', value: 100 }
    ],
    withFirstAndLast: true,
    alwaysShowAllBtns: true,
    hideSizePerPage: false,
    paginationTotalRenderer: (from: number, to: number, size: number) => {
      return (
        <span className="react-bootstrap-table-pagination-total">
          Showing { from } to { to } of { size } Results
        </span>
      );
    }
  };

  return paginationFactory(options);
};

export default CustomPagination; 