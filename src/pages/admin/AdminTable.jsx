import React, { useState } from "react";
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
} from "@mui/material";
import { motion } from "framer-motion";
import { Delete, Edit, Pets } from "@mui/icons-material";

export default function AdminTable({ data = [], columns = [], actions = [], loading = false, itemsPerPage = 5 }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(itemsPerPage);

  const handleChangePage = (_, newPage) => setCurrentPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 2, boxShadow: 3 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key} sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
                  {col.label}
                </TableCell>
              ))}
              {actions.length > 0 && <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              data.slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage).map((item, index) => (
                <motion.tr
                  key={item.id || item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {columns.map((col) => (
                    <TableCell key={col.key}>{col.render ? col.render(item[col.key], item) : item[col.key]}</TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell>
                      {actions.map((action, index) => (
                        <IconButton key={index} onClick={() => action.onClick(item)} color="primary">
                          {action.label === "Edit" ? <Edit /> : action.label === "Delete" ? <Delete /> : <Pets />}
                        </IconButton>
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
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={currentPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ backgroundColor: "#f5f5f5" }}
      />
    </Paper>
  );
}
