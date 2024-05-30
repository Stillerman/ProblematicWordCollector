import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  Container,
  Box,
  Tab,
  Tabs,
  AppBar,
  IconButton,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Drawer,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";

import freqDataRaw from "./word_freq.json";

// Remove words with length < 2 that are not 'a' or 'i'
const freqData = freqDataRaw.filter((word) => word.word.length >= 2 || ["a", "i"].includes(word.word));

import './index.css'

import { Download, Upload, Settings, HelpOutline } from "@mui/icons-material";
import fileDownload from "js-file-download";

const App = () => {
  const [pageNum, setPageNum] = useState(0);
  const [pageSize, setPageSize] = useState(100);
  const [numColumns, setNumColumns] = useState(5);
  const [showFreqs, setShowFreqs] = useState(false);
  const [capitalize, setCapitalize] = useState(false);
  const [sortBy, setSortBy] = useState("Frequency");
  const [redWords, setRedWords] = useState(() => JSON.parse(localStorage.getItem('redWords')) || {});
  const [yellowWords, setYellowWords] = useState(() => JSON.parse(localStorage.getItem('yellowWords')) || {});
  const [newWord, setNewWord] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const handlePageChange = (increment) => {
    setPageNum((prev) =>
      Math.max(0, Math.min(prev + increment, pageCount - 1))
    );
  };

  const pageCount = Math.ceil(freqData.length / pageSize);

  const handleExport = () => {
    const data = JSON.stringify({
      red: Object.keys(redWords).filter((word) => redWords[word]),
      yellow: Object.keys(yellowWords).filter((word) => yellowWords[word]),
    });
    fileDownload(data, "problematic_words.json");
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(e.target.result);
      setRedWords(
        data.red.reduce((acc, word) => ({ ...acc, [word]: true }), {})
      );
      setYellowWords(
        data.yellow.reduce((acc, word) => ({ ...acc, [word]: true }), {})
      );
    };
    reader.readAsText(file);
  };

  const handleAddWord = (type) => {
    if (type === "red") {
      setRedWords((prev) => ({ ...prev, [newWord.toLowerCase()]: true }));
    } else {
      setYellowWords((prev) => ({ ...prev, [newWord.toLowerCase()]: true }));
    }
    setNewWord("");
  };

  useEffect(() => {
    localStorage.setItem('redWords', JSON.stringify(redWords));
    localStorage.setItem('yellowWords', JSON.stringify(yellowWords));
  }, [redWords, yellowWords]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Problematic Word List Collector
          </Typography>
          <IconButton color="inherit" onClick={() => setHelpOpen(true)}>
            <HelpOutline />
          </IconButton>
          <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
            <Settings />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Dialog open={helpOpen} onClose={() => setHelpOpen(false)}>
        <DialogTitle>Help</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            This application helps you categorize words as either 'Yellow' or 'Red'.
            Yellow words are less severe and need attention, while Red words are more severe and need immediate action.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box p={2} width="250px">
          <Typography variant="h6" gutterBottom>
            Settings
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Page Size</InputLabel>
            <Select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              label="Page Size"
              style={{marginBottom: '1rem'}}
            >
              {[10, 20, 30, 40, 50, 75, 100].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Number of Columns</InputLabel>
            <Select
              value={numColumns}
              onChange={(e) => setNumColumns(e.target.value)}
              label="Number of Columns"
            >
              {[1,2,3,4,5,6,7].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={showFreqs}
                onChange={(e) => setShowFreqs(e.target.checked)}
              />
            }
            label="Show Frequencies"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={capitalize}
                onChange={(e) => setCapitalize(e.target.checked)}
              />
            }
            label="Capitalize"
          />
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="Frequency">Frequency</MenuItem>
              <MenuItem value="Alphabetical">Alphabetical</MenuItem>
            </Select>
          </FormControl>
          <Box my={2}>
            <Button
              variant="contained"
              onClick={handleExport}
              startIcon={<Download />}
              fullWidth
            >
              Export
            </Button>
            <input
              accept="application/json"
              style={{ display: "none" }}
              id="raised-button-file"
              type="file"
              onChange={handleImport}
            />
            <label htmlFor="raised-button-file">
              <Button
                variant="contained"
                component="span"
                startIcon={<Upload />}
                fullWidth
                style={{ marginTop: "10px" }}
              >
                Import
              </Button>
            </label>
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              setPageNum(0);
              setRedWords({});
              setYellowWords({});
            }}
            fullWidth
          >
            Reset Words
          </Button>
        </Box>
      </Drawer>
      <Container>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
        >
          <Tab label="Pick Words" />
          <Tab label="View Words" />
        </Tabs>
        {tabValue === 0 && (
          <Box>
            <Box display="flex" justifyContent="space-between" my={2}>
              <Button
                variant="contained"
                onClick={() => handlePageChange(-1)}
                disabled={pageNum <= 0}
              >
                Previous Page
              </Button>
              <Typography variant="body1">{`Page ${
                pageNum + 1
              } of ${pageCount}`}</Typography>
              <Button
                variant="contained"
                onClick={() => handlePageChange(1)}
                disabled={pageNum >= pageCount - 1}
              >
                Next Page
              </Button>
            </Box>
            <Box display="flex" flexWrap="wrap">
              {freqData
                .slice(pageNum * pageSize, (pageNum + 1) * pageSize)
                .map(({ word, probability: freq }, i) => (
                  <Box
                    key={i}
                    display="flex"
                    alignItems="center"
                    width={`calc(${100 / numColumns}% - 20px)`}
                    height={'1rem'}
                    m={1}
                  >
                    <Typography variant="body1" style={{ minWidth: "4rem" }}>
                      {capitalize
                        ? word.charAt(0).toUpperCase() + word.slice(1)
                        : word}{" "}
                      {showFreqs && `(${freq})`}
                    </Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={yellowWords[word] || false}
                          onChange={(e) =>
                            setYellowWords((prev) => ({
                              ...prev,
                              [word]: e.target.checked,
                            }))
                          }
                        />
                      }
                      label="Y"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={redWords[word] || false}
                          onChange={(e) =>
                            setRedWords((prev) => ({
                              ...prev,
                              [word]: e.target.checked,
                            }))
                          }
                        />
                      }
                      label="R"
                    />
                  </Box>
                ))}
            </Box>
            <Box display="flex" justifyContent="space-between" my={2}>
              <Button
                variant="contained"
                onClick={() => handlePageChange(-1)}
                disabled={pageNum <= 0}
              >
                Previous Page
              </Button>
              <Typography variant="body1">{`Page ${
                pageNum + 1
              } of ${pageCount}`}</Typography>
              <Button
                variant="contained"
                onClick={() => handlePageChange(1)}
                disabled={pageNum >= pageCount - 1}
              >
                Next Page
              </Button>
            </Box>
          </Box>
        )}
        {tabValue === 1 && (
          <Box>
            <Box display="flex" alignItems="center" my={2}>
              <TextField
                label="New Word"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={() => handleAddWord("red")}
                style={{ marginLeft: "10px" }}
              >
                Add to Red
              </Button>
              <Button
                variant="contained"
                onClick={() => handleAddWord("yellow")}
                style={{ marginLeft: "10px" }}
              >
                Add to Yellow
              </Button>
            </Box>
            <Box display="flex" justifyContent="space-around" my={2}>
              <Box>
                <Typography variant="h6">Yellow Words</Typography>
                <Typography variant="body1">
                  {Object.keys(yellowWords)
                    .filter((word) => yellowWords[word])
                    .join(", ")}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6">Red Words</Typography>
                <Typography variant="body1">
                  {Object.keys(redWords)
                    .filter((word) => redWords[word])
                    .join(", ")}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Container>
    </>
  );
};

export default App;
