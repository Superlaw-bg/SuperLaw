import "./Paginate.scss";
import { Pagination } from "react-bootstrap";

interface PaginationProps {
    profilesPerPage: number;
    totalProfiles: number;
    currentPage: number;
    paginate: (pageNumber: number) => void;
 };

const Paginate = ({ profilesPerPage, totalProfiles, currentPage, paginate }: PaginationProps) => {
    const pageNumbers = [];
  
    pageNumbers.push(
      <Pagination.Prev onClick={() => {
         if (currentPage > 1) {
            paginate(currentPage - 1);
         }
      }}/>
    );
   
    const pages = Math.ceil(totalProfiles / profilesPerPage);
    for (let i = 1; i <= pages; i++) {
       pageNumbers.push(
         <Pagination.Item key={i} active={i === currentPage} onClick={() => paginate(i)}>
            {i}
         </Pagination.Item>,
       );
    }

    pageNumbers.push(
      <Pagination.Next onClick={() => {
         if (currentPage < pages) {
            paginate(currentPage + 1);
         }
      }} />
    );
  
    return (
       <div className="pagination-container">
           <Pagination className="d-flex justify-content-center">{pageNumbers}</Pagination>
       </div>
    );
 };
  
 export default Paginate;