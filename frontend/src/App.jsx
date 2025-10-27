import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Card,
  CardContent,
  List as MUIList,
  ListItem,
} from "@mui/material";
import Login from "./Login";

const drawerWidth = 250;

function App() {
  const [query, setQuery] = useState("");
  const [queryResult, setQueryResult] = useState(null);
  const [error, setError] = useState("");
  const [tables, setTables] = useState([]);
  const [tableInfo, setTableInfo] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) fetchTables();
  }, [token]);

  const fetchTables = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/tables", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTables(response.data.tables || []);
    } catch (err) {
      console.error(err);
    }
  };

  const runQuery = async () => {
    try {
      setError("");


      if (query.trim() !== "" && !queryHistory.includes(query.trim())) {
        setQueryHistory([query.trim(), ...queryHistory].slice(0, 10));
      }

      const response = await axios.post(
        "http://127.0.0.1:5000/run-query",
        { query },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQueryResult(response.data.results || []);

    } catch (err) {
      setError(err.response?.data?.error || "Error executing query");
    }
  };

  const fetchTableInfo = async (tableName) => {
    setSelectedTable(tableName);
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/table-info/${tableName}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTableInfo(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!token) return <Login onLogin={() => window.location.reload()} />;

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            background: "#1e293b",
            color: "white",
            paddingTop: 2,
          },
        }}
      >
        <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
          Tables
        </Typography>
        <Divider />
        <List>
          {tables.map((table) => (
            <ListItemButton
              key={table}
              onClick={() => fetchTableInfo(table)}
              sx={{
                borderRadius: 1,
                "&:hover": { background: "#334155" },
              }}
            >
              <ListItemText primary={table} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box sx={{ flexGrow: 1, p: 3, overflowY: "auto" }}>
        <AppBar position="static" sx={{ borderRadius: 2, background: "linear-gradient(90deg,#6366f1,#14b8a6)" }}>
          <Toolbar>
            <Typography variant="h5" sx={{ flexGrow: 1 }}>SQL Runner</Typography>
            <Button
              variant="contained"
              color="error"
              onClick={() => { localStorage.removeItem("token"); window.location.reload(); }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Card sx={{ mt: 3 }}>
          <CardContent>
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Write SQL Query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={runQuery}>
              Run Query
            </Button>
            {error && <Typography sx={{ color: "red", mt: 1 }}>{error}</Typography>}
          </CardContent>
        </Card>


        {queryHistory.length > 0 && (
          <Paper sx={{ mt: 4, p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Recent Run Queries:
            </Typography>
            <MUIList dense>
              {queryHistory.map((q, i) => (
                <ListItem button key={i} onClick={() => setQuery(q)}>
                  <ListItemText primary={q} />
                </ListItem>
              ))}
            </MUIList>
          </Paper>
        )}

        {queryResult && queryResult.length > 0 && (
          <>
            <Typography variant="h5" sx={{ mt: 4, fontWeight: "bold" }}>
              Query Result:
            </Typography>

            <Paper sx={{ mt: 2, overflowX: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {Object.keys(queryResult[0]).map((col) => (
                      <TableCell key={col}>{col}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {queryResult.map((row, i) => (
                    <TableRow key={i}>
                      {Object.values(row).map((val, j) => (
                        <TableCell key={j}>{val}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </>
        )}


        {selectedTable && (
          <Typography variant="h5" sx={{ mt: 4, fontWeight: "bold" }}>
            Table: {selectedTable}
          </Typography>
        )}

        {tableInfo && (
          <Paper sx={{ mt: 2, p: 2 }}>
            <Typography variant="h6">Columns</Typography>
            <MUIList>
              {tableInfo.columns.map((col) => (
                <ListItemText key={col.name} primary={`${col.name} (${col.type})`} />
              ))}
            </MUIList>

            <Typography variant="h6" sx={{ mt: 2 }}>Sample Data</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  {tableInfo.sample_data.length > 0 &&
                    Object.keys(tableInfo.sample_data[0]).map((col) => (
                      <TableCell key={col}>{col}</TableCell>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableInfo.sample_data.map((row, i) => (
                  <TableRow key={i}>
                    {Object.values(row).map((val, j) => (
                      <TableCell key={j}>{val}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Box>
    </Box>
  );
}

export default App;
