import React from 'react';

// SizePerPageOption Component
export const CustomSizePerPageOption = ({
  text,
  page,
  onSizePerPageChange
}: {
  text: string;
  page: number;
  onSizePerPageChange: (page: number) => void;
}): React.ReactElement => (
  <li className="dropdown-item" onClick={() => onSizePerPageChange(page)}>
    {text}
  </li>
);

// PaginationTotal Component - Modified to use props object
interface PaginationTotalProps {
  from: number;
  to: number;
  size: number;
}

export const CustomPaginationTotal = ({
  from,
  to,
  size
}: PaginationTotalProps): React.ReactElement => (
  <span className="react-bootstrap-table-pagination-total">
    Showing {from} to {to} of {size} Results
  </span>
);

// PaginationList Component
interface PageListProps {
  pages: Array<{
    page: number;
    active: boolean;
    disabled: boolean;
    title: string;
  }>;
  onPageChange: (page: number) => void;
}

export const CustomPaginationList = ({
  pages,
  onPageChange
}: PageListProps): React.ReactElement => (
  <ul className="pagination react-bootstrap-table-page-btns-ul">
    {pages.map(({ page, active, disabled, title }, index) => (
      <li
        key={index}
        className={`page-item ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
      >
        <button
          className="page-link"
          onClick={() => onPageChange(page)}
          disabled={disabled}
          title={title}
        >
          {page}
        </button>
      </li>
    ))}
  </ul>
);
