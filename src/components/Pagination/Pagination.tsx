import Button from '@components/Button/Button'
import clsx from 'clsx'
import React, { useState } from 'react'
import styles from './Pagination.module.scss'

interface IPaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<IPaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const handlePageChange = (page: number) => {
    onPageChange(page)
  }

  const pageCount = Math.ceil(totalItems / itemsPerPage)
  const pages = Array.from(Array(pageCount).keys()).map((i) => i + 1)

  const startIndex = Math.max(0, currentPage - 3)
  const endIndex = Math.min(pageCount - 1, currentPage + 3)

  return (
    <nav className={styles.container}>
      <ul className={styles.pagesContainer}>
        {currentPage > 0 && (
          <li className="page-item">
            <Button
              type="ghost"
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </Button>
          </li>
        )}
        {/* {startIndex > 0 && <li className="page-item">...</li>}
        {pages.slice(startIndex, endIndex + 1).map((page) => (
          <li key={page}>
            <Button
              type="ghost"
              className={clsx(styles.page, { [styles.pageActive]: currentPage === page })}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          </li>
        ))}
        {endIndex < pageCount - 1 && <li className="page-item">...</li>} */}
        {currentPage < pageCount && (
          <li className="page-item">
            <Button
              type="ghost"
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </Button>
          </li>
        )}
      </ul>
    </nav>
  )
}

Pagination.displayName = 'Pagination'

export default Pagination
