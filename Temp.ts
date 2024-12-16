import React from 'react';
import { PaginationSimple } from '@barclays/blueprint-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => (
  <PaginationSimple active={currentPage} total={totalPages} onButtonClick={onPageChange} />
);