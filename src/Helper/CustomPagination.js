import React from "react";
import { Link } from "react-router-dom";
import { Pagination } from "react-bootstrap";

function CustomPagination(props) {
  const pageSize = 2;
  const totalPages = Math.ceil(props.count / pageSize);

  return (
    <div className="customPagination d-inline-block mx-auto">
      <Pagination>
        {props.currentPage > 1 && (
          <Pagination.Prev
            as={Link}
            to={`${props.url}/page/${props.currentPage - 1}`}
            href={`${props.url}/page/${props.currentPage - 1}`}
          />
        )}
        {[...Array(totalPages)].map((e, i) => (
          <Pagination.Item
            key={i}
            as={Link}
            to={`${props.url}/page/${i + 1}`}
            href={`${props.url}/page/${i + 1}`}
            active={i + 1 === props.currentPage ? true : false}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        {props.currentPage < totalPages && (
          <Pagination.Next
            as={Link}
            to={`${props.url}/page/${props.currentPage + 1}`}
            href={`${props.url}/page/${props.currentPage + 1}`}
            disabled={props.currentPage >= totalPages ? true : false}
          />
        )}
      </Pagination>
    </div>
  );
}

export default CustomPagination;
