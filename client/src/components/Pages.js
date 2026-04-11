import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Context } from "..";
import { Pagination } from "react-bootstrap";
import "../style/Pages.css";

const Pages = observer(() => {
  const { device } = useContext(Context);
  const pageCount = Math.ceil(device.totalCount / device.limit);

  if (pageCount <= 1) return null;

  const current = device.page;
  const remaining = device.totalCount - current * device.limit;

  const getItems = () => {
    const items = [];
    const delta = 2;
    const rangeStart = Math.max(2, current - delta);
    const rangeEnd = Math.min(pageCount - 1, current + delta);

    items.push(1);
    if (rangeStart > 2) items.push("...");
    for (let i = rangeStart; i <= rangeEnd; i++) items.push(i);
    if (rangeEnd < pageCount - 1) items.push("...");
    if (pageCount > 1) items.push(pageCount);

    return items;
  };

  return (
    <div className="pages-outer">
      {remaining > 0 && (
        <button
          className="see-more-btn"
          onClick={() => device.setPage(current + 1)}
        >
          See more {remaining} items
        </button>
      )}

      <div className="pages-wrapper">
        <span className="pages-label">Pages:</span>
        <Pagination className="mb-0">
          <Pagination.Prev
            disabled={current === 1}
            onClick={() => device.setPage(current - 1)}
          />
          {getItems().map((page, idx) =>
            page === "..." ? (
              <Pagination.Ellipsis key={`e-${idx}`} disabled />
            ) : (
              <Pagination.Item
                key={page}
                active={current === page}
                onClick={() => device.setPage(page)}
              >
                {page}
              </Pagination.Item>
            )
          )}
          <Pagination.Next
            disabled={current === pageCount}
            onClick={() => device.setPage(current + 1)}
          />
        </Pagination>
      </div>
    </div>
  );
});

export default Pages;
