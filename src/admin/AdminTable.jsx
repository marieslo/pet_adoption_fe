import React, { useState, useEffect } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TablePagination,
  IconButton,
  CircularProgress,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import { Delete, Edit } from "@mui/icons-material";


export default function AdminTable({
  data = [],
  columns = [],
  actions = [],
  loading = false,
  itemsPerPage = 5,
  onDelete
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortBy, setSortBy] = useState("");
  const [filterText, setFilterText] = useState("");

  const handleChangePage = (_, newPage) => setCurrentPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleSort = (columnKey) => {
    const isAscending = sortBy === columnKey && sortDirection === "asc";
    setSortBy(columnKey);
    setSortDirection(isAscending ? "desc" : "asc");
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
    setCurrentPage(0);
  };

  const filteredData = data.filter((item) =>
    columns.some((col) =>
      item[col.key]?.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortBy) return 0;
    const valueA = a[sortBy];
    const valueB = b[sortBy];
    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  useEffect(() => {
    if (!loading) return;
    setTimeout(() => {}, 1000);
  }, [currentPage, loading]);

  return (
    <>
      <Paper sx={{ width: "fit-content", overflow: "hidden", borderRadius: "30px", boxShadow: 3, fontSize: '0.75rem' }}>
        <TextField
          value={filterText}
          onChange={handleFilterChange}
          variant="outlined"
          sx={{
            width: "300px",
            borderRadius: "30px",
            margin: "10px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "30px",
              height: "30px",
              fontSize: "0.75rem",
              textAlign: "left",
              color: "#a72d66",
            },
            "& .MuiInputLabel-root": {
              fontSize: "0.75rem",
            },
            "& .MuiInputBase-input::placeholder": {
              textAlign: "center",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgb(105, 101, 103)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#a72d66",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#a72d66",
            },
            "& label.Mui-focused": {
              color: "rgb(105, 101, 103)6",
              borderColor: "#a72d66",
            },
          }}
          inputProps={{
            style: {
              fontSize: "0.75rem",
              color: "rgb(105, 101, 103)",
            },
            placeholder: "Enter filter text",
          }}
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: "rgb(207, 178, 159)",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}
                    {sortBy === col.key ? (sortDirection === "asc" ? " ↑" : " ↓") : null}
                  </TableCell>
                ))}
                {actions.length > 0 && (
                  <TableCell sx={{ fontWeight: "bold", backgroundColor: "rgb(207, 178, 159)", fontSize: "0.875rem" }}>
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                sortedData
                  .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <motion.tr
                      key={item.id || item._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      style={{
                        backgroundColor: index % 2 === 0 ? "rgb(230, 206, 192)" : "rgb(239, 218, 195)",
                      }}
                    >
                      {columns.map((col) => (
                        <TableCell key={col.key} sx={{ fontSize: "0.75rem" }}>
                          {col.render ? col.render(item[col.key], item) : item[col.key]}
                        </TableCell>
                      ))}
                      {actions.length > 0 && (
                          <TableCell>
                          {actions.map((action, index) => (
                            (action.label === "Edit" || action.label === "Delete") && (
                              <IconButton
                                key={index}
                                onClick={() => {
                                  if (action.label === "Delete") {
                                    onDelete(item);
                                  } else {
                                    action.onClick(item);
                                  }
                                }}
                                color="#a25579"
                                size="small"
                              >
                                {action.label === "Edit" ? <Edit fontSize="inherit" /> : <Delete fontSize="inherit" />}
                              </IconButton>
                            )
                          ))}
                        </TableCell>
                      )}
                    </motion.tr>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            backgroundColor: "#f5f5f5",
            "& .MuiTypography-root": {
              fontSize: "0.75rem",
            },
          }}
        />
      </Paper>
    </>
  );
}
