import React from "react";
import { Pagination } from "react-bootstrap";

const RoomPaginator = ({ currentPage, totalPages, onPageChange }) => {
  const handleClick = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  const pageItems = [];
  for (let i = 1; i <= totalPages; i++) {
    pageItems.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => handleClick(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  return (
    <Pagination>
      <Pagination.Prev
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {pageItems}
      <Pagination.Next
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    </Pagination>
  );
};

export default RoomPaginator;
