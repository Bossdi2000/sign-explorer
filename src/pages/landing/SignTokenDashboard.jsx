"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  IconButton,
  CircularProgress,
  Chip,
  Link,
  TextField,
  Switch,
  FormControlLabel,
  Tooltip,
  Badge,
  Divider,
} from "@mui/material"
import {
  Refresh,
  ContentCopy,
  TrendingUp,
  SwapHoriz,
  MonetizationOn,
  ExitToApp,
  CheckCircle,
  FilterList,
  FileDownload,
  Visibility,
  VisibilityOff,
  Analytics,
  Speed,
  Timeline,
  Assessment,
  Notifications,
  Settings,
  Search,
  Star,
} from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"

// Deep Orange & Black Color Scheme
const DEEP_ORANGE = "#FF4500"
const BURNT_ORANGE = "#CC3700"
const DARK_ORANGE = "#B8860B"
const NEON_ORANGE = "#FF6347"
const JET_BLACK = "#0A0A0A"
const CHARCOAL = "#1C1C1C"
const GRADIENT_ORANGE = "linear-gradient(135deg, #FF4500 0%, #FF6347 50%, #FF8C00 100%)"
const GRADIENT_DARK = "linear-gradient(135deg, #0A0A0A 0%, #1C1C1C 50%, #2A2A2A 100%)"

const SignTokenDashboard = () => {
  const [allTransactions, setAllTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [totalVolume, setTotalVolume] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("") // Still used for console logging, but not displayed
  const [copied, setCopied] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [minAmount, setMinAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("timestamp")
  const [sortOrder, setSortOrder] = useState("desc")
  const [notifications, setNotifications] = useState(0)
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date())
  const [latestTxHash, setLatestTxHash] = useState(null) // State to track the latest transaction hash

  // IMPORTANT: In a production application, these should be environment variables
  // and the API key should ideally be used on a backend to prevent exposure.
  const contractAddress = "0x868fced65edbf0056c4163515dd840e9f287a4c3"
  const apiKey = "I1TNIHXXCRGXRA9KXV8P6XRQR4B4F9H6XJ" // Your updated API Key

  const theme = useMemo(
    () => ({
      primary: DEEP_ORANGE,
      secondary: NEON_ORANGE,
      tertiary: DARK_ORANGE,
      dark: CHARCOAL,
      darker: JET_BLACK,
      accent: "#FFB366",
      text: "#FFFFFF",
      cardBg: "rgba(28, 28, 28, 0.95)",
      gradientPrimary: GRADIENT_ORANGE,
      gradientDark: GRADIENT_DARK,
      warning: "#FF6B35",
      success: "#32CD32",
    }),
    [],
  )

  const copyContract = useCallback(() => {
    navigator.clipboard.writeText(contractAddress).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [contractAddress])

  const exportToCSV = useCallback(() => {
    const headers = ["Tx Hash", "Time", "From", "To", "Amount", "Token Symbol"]
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map((tx) => {
        const amount = Number.parseInt(tx.value) / 10 ** Number.parseInt(tx.tokenDecimal)
        const date = new Date(Number.parseInt(tx.timeStamp) * 1000).toLocaleString()
        return [tx.hash, date, tx.from, tx.to, amount, tx.tokenSymbol].join(",")
      }),
    ].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sign_transactions_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }, [filteredTransactions])

  const applyFilters = useCallback(() => {
    let filtered = [...allTransactions]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (tx) =>
          tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.to.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Amount filters
    if (minAmount || maxAmount) {
      filtered = filtered.filter((tx) => {
        const amount = Number.parseInt(tx.value) / 10 ** Number.parseInt(tx.tokenDecimal)
        const min = minAmount ? Number.parseFloat(minAmount) : 0
        const max = maxAmount ? Number.parseFloat(maxAmount) : Number.POSITIVE_INFINITY
        return amount >= min && amount <= max
      })
    }

    // Sorting
    filtered.sort((a, b) => {
      let aVal, bVal
      switch (sortBy) {
        case "amount":
          aVal = Number.parseInt(a.value) / 10 ** Number.parseInt(a.tokenDecimal)
          bVal = Number.parseInt(b.value) / 10 ** Number.parseInt(b.tokenDecimal)
          break
        case "timestamp":
        default:
          aVal = Number.parseInt(a.timeStamp)
          bVal = Number.parseInt(b.timeStamp)
          break
      }

      if (sortOrder === "asc") {
        return aVal - bVal
      } else {
        return bVal - aVal
      }
    })

    setFilteredTransactions(filtered)
    setCurrentPage(1)
  }, [allTransactions, searchTerm, minAmount, maxAmount, sortBy, sortOrder])

  useEffect(() => {
    applyFilters()
  }, [allTransactions, searchTerm, minAmount, maxAmount, sortBy, sortOrder, applyFilters])

  const fetchTransactions = useCallback(async () => {
    const url = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${contractAddress}&page=1&offset=100&sort=desc&apikey=${apiKey}`
    try {
      setLoading(true)
      setError("") // Clear previous errors (for console)

      const response = await fetch(url)
      const data = await response.json()

      if (data.status === "1" && Array.isArray(data.result)) {
        // Always update allTransactions with the latest data from the API
        setAllTransactions(data.result)

        // Calculate total volume based on the newly fetched transactions
        const totalVol = data.result.reduce((sum, tx) => {
          return sum + Number.parseInt(tx.value) / 10 ** Number.parseInt(tx.tokenDecimal)
        }, 0)
        setTotalVolume(totalVol)

        // Update latestTxHash and notifications only if there's new data
        if (data.result.length > 0 && data.result[0].hash !== latestTxHash) {
          setNotifications((prev) => prev + 1) // Increment for each new "latest" transaction
          setLatestTxHash(data.result[0].hash)
        }
        setLastUpdateTime(new Date()) // Always update last update time
      } else if (data.status === "0") {
        // Etherscan specific error message
        console.error("Etherscan API 'NOTOK' response:", data) // Log the full error for debugging
        setError(
          `API error: ${data.message || 'Unknown "NOTOK" error. Please check your API key and Etherscan status.'}`,
        )
        // Do NOT clear allTransactions or totalVolume here. Keep previous data if available.
      } else {
        console.error("Unexpected API response format:", data) // Log the full response for debugging
        setError("Unexpected API response format or empty result. Please check the API response structure.")
        // Do NOT clear allTransactions or totalVolume here. Keep previous data if available.
      }
    } catch (err) {
      setError("Error fetching transactions: " + err.message)
      // Do NOT clear allTransactions or totalVolume here. Keep previous data if available.
    } finally {
      setLoading(false)
    }
  }, [contractAddress, apiKey, latestTxHash])

  useEffect(() => {
    fetchTransactions() // Initial fetch
    let interval
    if (autoRefresh) {
      interval = setInterval(fetchTransactions, 60000) // Refresh every 60 seconds (1 minute)
    }
    return () => interval && clearInterval(interval) // Cleanup on unmount or autoRefresh change
  }, [autoRefresh, fetchTransactions])

  const totalPages = Math.ceil(filteredTransactions.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, filteredTransactions.length)
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex)

  const totalTx = filteredTransactions.length
  const avgAmount = totalTx > 0 ? totalVolume / totalTx : 0
  const largestTx =
    filteredTransactions.length > 0
      ? Math.max(
          ...filteredTransactions.map((tx) => Number.parseInt(tx.value) / 10 ** Number.parseInt(tx.tokenDecimal)),
        )
      : 0

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  const clearNotifications = useCallback(() => {
    setNotifications(0)
  }, [])

  return (
    <Box
      sx={{
        minHeight: "100vh", // Use vh for full viewport height
        width: "100%",
        background: theme.gradientDark,
        color: theme.text,
        p: { xs: 2, sm: 3, md: 4 },
        position: "relative",
        overflow: "hidden", // Hide overflow for smooth animations
        display: "flex",
        flexDirection: "column",
      }}
    >
      <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ flex: 1 }}>
        {/* Header Section */}
        <motion.div variants={itemVariants}>
          <Box textAlign="center" mb={{ xs: 3, sm: 4, md: 5 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                background: theme.gradientPrimary,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
                mb: { xs: 1.5, sm: 2 },
                fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem", lg: "3.5rem" },
                textShadow: `0 0 10px ${theme.primary}80`,
              }}
            >
              $SIGN Transaction Dashboard
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.accent,
                mb: 2,
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
              }}
            >
              Real-time blockchain analytics with advanced filtering
            </Typography>
            <Paper
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.5,
                p: { xs: 1, sm: 1.5, md: 2 },
                backgroundColor: theme.cardBg,
                backdropFilter: "blur(10px)", // Always apply blur for consistency
                border: `2px solid ${theme.primary}`,
                borderRadius: 3,
                boxShadow: `0 0 20px ${theme.primary}40`,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: theme.text,
                  fontSize: { xs: "0.75rem", sm: "0.85rem", md: "1rem" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: { xs: "200px", sm: "300px", md: "400px" },
                }}
              >
                Contract:{" "}
                <strong>
                  {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
                </strong>
              </Typography>
              <Tooltip title={copied ? "Copied!" : "Copy contract address"} arrow>
                <IconButton
                  onClick={copyContract}
                  aria-label="copy contract address"
                  sx={{
                    background: theme.gradientPrimary,
                    color: "white",
                    p: { xs: 0.5, sm: 0.8 },
                    "&:hover": {
                      transform: "scale(1.1)",
                      boxShadow: `0 0 15px ${theme.primary}`,
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  {copied ? <CheckCircle fontSize="small" /> : <ContentCopy fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Paper>
            <Tooltip
              title="Data sourced from Etherscan API, showing recent token transfers. Not real-time market prices."
              placement="bottom"
              arrow
            >
              <Typography variant="caption" sx={{ color: theme.accent, mt: 1, display: "block" }}>
                (Data from Etherscan API)
              </Typography>
            </Tooltip>
          </Box>
        </motion.div>

        {/* Enhanced Stats Cards */}
        <motion.div variants={itemVariants}>
          <Grid
            container
            spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
            mb={{ xs: 3, sm: 4, md: 5 }}
            sx={{ width: "100%", margin: "0 auto" }}
          >
            {[
              { icon: SwapHoriz, value: totalTx, label: "Total Transactions", color: theme.primary },
              { icon: MonetizationOn, value: totalVolume.toFixed(2), label: "Total Volume", color: theme.secondary },
              { icon: TrendingUp, value: avgAmount.toFixed(2), label: "Average Amount", color: theme.tertiary },
              { icon: Assessment, value: largestTx.toFixed(2), label: "Largest Transaction", color: theme.warning },
              {
                icon: Timeline,
                value: `${Math.round((Date.now() - lastUpdateTime.getTime()) / 1000)}s`,
                label: "Last Update",
                color: theme.success,
              },
              { icon: Speed, value: `${(totalTx / 24).toFixed(1)}/hr`, label: "Avg Rate", color: theme.accent },
            ].map((stat, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={index} sx={{ display: "flex" }}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{ width: "100%" }}
                >
                  <Card
                    sx={{
                      background: theme.cardBg,
                      backdropFilter: "blur(15px)",
                      border: `2px solid ${stat.color}`,
                      borderRadius: { xs: 2, sm: 2.5, md: 3 },
                      textAlign: "center",
                      p: { xs: 1, sm: 1.5, md: 2 },
                      width: "100%",
                      minHeight: { xs: "120px", sm: "140px", md: "160px" },
                      boxShadow: `0 0 15px ${stat.color}30`,
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.3s ease-in-out",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        background: `linear-gradient(90deg, ${stat.color}, transparent)`,
                      }}
                    />
                    <CardContent
                      sx={{ p: { xs: 1, sm: 1.5, md: 2 }, "&:last-child": { pb: { xs: 1, sm: 1.5, md: 2 } } }}
                    >
                      <motion.div
                        animate={{
                          rotateY: [0, 360],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatDelay: 3,
                        }}
                      >
                        <stat.icon
                          sx={{
                            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                            color: stat.color,
                            mb: { xs: 0.5, sm: 1 },
                            filter: `drop-shadow(0 0 8px ${stat.color}40)`,
                          }}
                        />
                      </motion.div>
                      <Typography
                        variant="h4"
                        sx={{
                          color: stat.color,
                          fontWeight: "bold",
                          mb: { xs: 0.3, sm: 0.5 },
                          fontSize: { xs: "1.3rem", sm: "1.5rem", md: "1.8rem" },
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.accent,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Control Panel */}
        <motion.div variants={itemVariants}>
          <Paper
            sx={{
              background: theme.cardBg,
              backdropFilter: "blur(15px)",
              border: `2px solid ${theme.primary}`,
              borderRadius: 3,
              p: { xs: 2, sm: 3 },
              mb: { xs: 3, sm: 4 },
              boxShadow: `0 0 20px ${theme.primary}20`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: theme.primary,
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Settings /> Control Panel
              </Typography>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: theme.primary,
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                          backgroundColor: theme.primary,
                        },
                      }}
                    />
                  }
                  label="Auto Refresh"
                  sx={{ color: theme.text }}
                />
                <Badge badgeContent={notifications} color="error" max={99}>
                  <Tooltip title="Clear new transaction notifications" arrow>
                    <IconButton
                      onClick={clearNotifications}
                      aria-label="clear notifications"
                      sx={{
                        color: theme.primary,
                        "&:hover": {
                          backgroundColor: `${theme.primary}20`,
                        },
                      }}
                    >
                      <Notifications />
                    </IconButton>
                  </Tooltip>
                </Badge>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mb: 2,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                onClick={fetchTransactions}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Refresh />}
                sx={{
                  background: theme.gradientPrimary,
                  borderRadius: 2,
                  px: 3,
                  py: 1.2,
                  fontWeight: "bold",
                  boxShadow: `0 0 15px ${theme.primary}40`,
                  "&:hover": {
                    background: theme.gradientPrimary,
                    transform: "translateY(-2px)",
                    boxShadow: `0 5px 20px ${theme.primary}60`,
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                {loading ? "Loading..." : "Refresh"}
              </Button>
              <Button
                variant="outlined"
                onClick={exportToCSV}
                startIcon={<FileDownload />}
                sx={{
                  borderColor: theme.secondary,
                  color: theme.secondary,
                  borderRadius: 2,
                  px: 3,
                  py: 1.2,
                  "&:hover": {
                    borderColor: theme.secondary,
                    backgroundColor: `${theme.secondary}20`,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                Export CSV
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowFilters(!showFilters)}
                startIcon={showFilters ? <VisibilityOff /> : <FilterList />}
                sx={{
                  borderColor: theme.tertiary,
                  color: theme.tertiary,
                  borderRadius: 2,
                  px: 3,
                  py: 1.2,
                  "&:hover": {
                    borderColor: theme.tertiary,
                    backgroundColor: `${theme.tertiary}20`,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
            </Box>
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Divider sx={{ my: 2, borderColor: theme.primary }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Search Hash/Address"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                          startAdornment: <Search sx={{ color: theme.primary, mr: 1 }} />,
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            color: theme.text,
                            "& fieldset": {
                              borderColor: theme.primary,
                            },
                            "&:hover fieldset": {
                              borderColor: theme.secondary,
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: theme.secondary,
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: theme.accent,
                            "&.Mui-focused": {
                              color: theme.secondary,
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <TextField
                        fullWidth
                        label="Min Amount"
                        type="number"
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            color: theme.text,
                            "& fieldset": {
                              borderColor: theme.primary,
                            },
                            "&:hover fieldset": {
                              borderColor: theme.secondary,
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: theme.secondary,
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: theme.accent,
                            "&.Mui-focused": {
                              color: theme.secondary,
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <TextField
                        fullWidth
                        label="Max Amount"
                        type="number"
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            color: theme.text,
                            "& fieldset": {
                              borderColor: theme.primary,
                            },
                            "&:hover fieldset": {
                              borderColor: theme.secondary,
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: theme.secondary,
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: theme.accent,
                            "&.Mui-focused": {
                              color: theme.secondary,
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: theme.accent }}>Sort By</InputLabel>
                        <Select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          sx={{
                            color: theme.text,
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: theme.primary,
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: theme.secondary,
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: theme.secondary,
                            },
                            "& .MuiSvgIcon-root": {
                              color: theme.primary,
                            },
                          }}
                        >
                          <MenuItem value="timestamp">Time</MenuItem>
                          <MenuItem value="amount">Amount</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: theme.accent }}>Order</InputLabel>
                        <Select
                          value={sortOrder}
                          onChange={(e) => setSortOrder(e.target.value)}
                          sx={{
                            color: theme.text,
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: theme.primary,
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: theme.secondary,
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: theme.secondary,
                            },
                            "& .MuiSvgIcon-root": {
                              color: theme.primary,
                            },
                          }}
                        >
                          <MenuItem value="desc">Desc</MenuItem>
                          <MenuItem value="asc">Asc</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={1}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: theme.accent }}>Per Page</InputLabel>
                        <Select
                          value={pageSize}
                          onChange={(e) => {
                            setPageSize(e.target.value)
                            setCurrentPage(1)
                          }}
                          sx={{
                            color: theme.text,
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: theme.primary,
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: theme.secondary,
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: theme.secondary,
                            },
                            "& .MuiSvgIcon-root": {
                              color: theme.primary,
                            },
                          }}
                        >
                          <MenuItem value={10}>10</MenuItem>
                          <MenuItem value={20}>20</MenuItem>
                          <MenuItem value={50}>50</MenuItem>
                          <MenuItem value={100}>100</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </motion.div>
              )}
            </AnimatePresence>
          </Paper>
        </motion.div>

        {/* Removed Error Alert block */}

        {/* Enhanced Table Container */}
        <motion.div variants={itemVariants}>
          <Paper
            sx={{
              background: theme.cardBg,
              backdropFilter: "blur(15px)",
              border: `2px solid ${theme.primary}`,
              borderRadius: 3,
              overflow: "hidden",
              width: "100%",
              boxShadow: `0 0 30px ${theme.primary}20`,
            }}
          >
            {/* Table Header Info */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 3,
                background: `linear-gradient(90deg, ${theme.primary}20, transparent)`,
                borderBottom: `1px solid ${theme.primary}40`,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: theme.primary,
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Analytics /> Transaction History
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.accent,
                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                }}
              >
                Showing {startIndex + 1} - {endIndex} of {filteredTransactions.length} transactions
              </Typography>
            </Box>

            {/* Loading Overlay for Table */}
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
                <CircularProgress sx={{ color: theme.primary }} />
                <Typography variant="body1" sx={{ color: theme.text, ml: 2 }}>
                  Fetching transactions...
                </Typography>
              </Box>
            )}

            {/* Enhanced Table */}
            {!loading && (
              <TableContainer sx={{ maxWidth: "100%", overflowX: "auto" }}>
                <Table sx={{ minWidth: { xs: 700, sm: 900 } }}>
                  <TableHead>
                    <TableRow
                      sx={{
                        background: theme.gradientPrimary,
                        "& th": {
                          color: "black",
                          fontWeight: "bold",
                          fontSize: { xs: "0.85rem", sm: "0.95rem", md: "1rem" },
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          borderBottom: "none",
                        },
                      }}
                    >
                      <TableCell>Tx Hash</TableCell>
                      <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Time</TableCell>
                      <TableCell>From</TableCell>
                      <TableCell>To</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>% of Total</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <AnimatePresence>
                      {currentTransactions.length === 0 && !error ? (
                        <TableRow>
                          <TableCell colSpan={7} sx={{ color: theme.text, textAlign: "center", py: 4 }}>
                            No transactions found matching your criteria.
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentTransactions.map((tx, index) => {
                          const amount = Number.parseInt(tx.value) / 10 ** Number.parseInt(tx.tokenDecimal)
                          const percentage = (totalVolume > 0 ? (amount / totalVolume) * 100 : 0).toFixed(1) // Handle division by zero
                          const date = new Date(Number.parseInt(tx.timeStamp) * 1000).toLocaleString()
                          const isLargeTransaction = amount > avgAmount * 2 && avgAmount > 0 // Only mark as large if avgAmount is not zero
                          return (
                            <motion.tr
                              key={tx.hash}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ delay: index * 0.05 }} // Slightly faster animation
                              style={{ display: "table-row" }}
                            >
                              <TableCell
                                sx={{
                                  color: theme.text,
                                  fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                  borderBottom: `1px solid ${theme.primary}30`,
                                }}
                              >
                                <Link
                                  href={`https://etherscan.io/tx/${tx.hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer" // Security best practice
                                  sx={{
                                    color: theme.primary,
                                    textDecoration: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    "&:hover": {
                                      color: theme.secondary,
                                      textDecoration: "underline",
                                      transform: "scale(1.02)",
                                    },
                                    transition: "all 0.2s ease",
                                  }}
                                >
                                  <ExitToApp fontSize="small" />
                                  {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                                </Link>
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: theme.text,
                                  fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                  display: { xs: "none", sm: "table-cell" },
                                  borderBottom: `1px solid ${theme.primary}30`,
                                }}
                              >
                                <Typography variant="body2" sx={{ color: theme.accent }}>
                                  {date}
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: theme.text,
                                  fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                  borderBottom: `1px solid ${theme.primary}30`,
                                }}
                              >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <img
                                    src="/SIGN6.jpeg"
                                    alt="$SIGN Token Logo"
                                    style={{ width: 20, height: 20, marginRight: 4 }}
                                  />
                                  <Link
                                    href={`https://etherscan.io/address/${tx.from}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                      color: theme.text,
                                      fontFamily: "monospace",
                                      textDecoration: "none",
                                      "&:hover": { textDecoration: "underline", color: theme.primary },
                                    }}
                                  >
                                    {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                                  </Link>
                                  <Tooltip title="Copy address" arrow>
                                    <IconButton
                                      size="small"
                                      onClick={() => navigator.clipboard.writeText(tx.from)}
                                      aria-label="copy from address"
                                      sx={{
                                        color: theme.tertiary,
                                        "&:hover": { color: theme.primary },
                                      }}
                                    >
                                      <ContentCopy fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: theme.text,
                                  fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                  borderBottom: `1px solid ${theme.primary}30`,
                                }}
                              >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <img
                                    src="/SIGN6.jpeg"
                                    alt="$SIGN Token Logo"
                                    style={{ width: 20, height: 20, marginRight: 4 }}
                                  />
                                  <Link
                                    href={`https://etherscan.io/address/${tx.to}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                      color: theme.text,
                                      fontFamily: "monospace",
                                      textDecoration: "none",
                                      "&:hover": { textDecoration: "underline", color: theme.primary },
                                    }}
                                  >
                                    {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                                  </Link>
                                  <Tooltip title="Copy address" arrow>
                                    <IconButton
                                      size="small"
                                      onClick={() => navigator.clipboard.writeText(tx.to)}
                                      aria-label="copy to address"
                                      sx={{
                                        color: theme.tertiary,
                                        "&:hover": { color: theme.primary },
                                      }}
                                    >
                                      <ContentCopy fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderBottom: `1px solid ${theme.primary}30`,
                                }}
                              >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: isLargeTransaction ? theme.warning : theme.primary,
                                      fontWeight: "bold",
                                      fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                    }}
                                  >
                                    {amount.toFixed(2)} {tx.tokenSymbol}
                                  </Typography>
                                  {isLargeTransaction && (
                                    <Tooltip title="Large transaction" arrow>
                                      <Star sx={{ color: theme.warning, fontSize: 16 }} />
                                    </Tooltip>
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell sx={{ borderBottom: `1px solid ${theme.primary}30` }}>
                                <Chip
                                  label={`${percentage}%`}
                                  sx={{
                                    background:
                                      Number.parseFloat(percentage) > 5
                                        ? `linear-gradient(45deg, ${theme.warning}, ${theme.secondary})`
                                        : theme.gradientPrimary,
                                    color: "white",
                                    fontWeight: "bold",
                                    fontSize: { xs: "0.7rem", sm: "0.8rem" },
                                    boxShadow: `0 0 10px ${theme.primary}40`,
                                  }}
                                />
                              </TableCell>
                              <TableCell sx={{ borderBottom: `1px solid ${theme.primary}30` }}>
                                <Box sx={{ display: "flex", gap: 0.5 }}>
                                  <Tooltip title="View on Etherscan" arrow>
                                    <IconButton
                                      size="small"
                                      component="a"
                                      href={`https://etherscan.io/tx/${tx.hash}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      aria-label="view on etherscan"
                                      sx={{
                                        color: theme.primary,
                                        "&:hover": {
                                          color: theme.secondary,
                                          transform: "scale(1.1)",
                                        },
                                      }}
                                    >
                                      <Visibility fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  {/* Example of an additional action, e.g., "Add to favorites" */}
                                  <Tooltip title="Add to favorites (Coming Soon)" arrow>
                                    <IconButton
                                      size="small"
                                      aria-label="add to favorites"
                                      disabled // Disable for now as it's a placeholder
                                      sx={{
                                        color: theme.accent,
                                        "&:hover": {
                                          color: theme.warning,
                                          transform: "scale(1.1)",
                                        },
                                      }}
                                    >
                                      <Star fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </motion.tr>
                          )
                        })
                      )}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                p={{ xs: 2, sm: 3 }}
                sx={{
                  background: `linear-gradient(90deg, transparent, ${theme.primary}10, transparent)`,
                  borderTop: `1px solid ${theme.primary}30`,
                }}
              >
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                  size="large"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: theme.text,
                      borderColor: theme.primary,
                      fontSize: { xs: "0.8rem", sm: "0.9rem" },
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor: theme.primary,
                        color: "black",
                        transform: "scale(1.1)",
                        boxShadow: `0 0 10px ${theme.primary}`,
                      },
                      "&.Mui-selected": {
                        backgroundColor: theme.primary,
                        color: "black",
                        boxShadow: `0 0 15px ${theme.primary}`,
                      },
                    },
                  }}
                />
              </Box>
            )}
          </Paper>
        </motion.div>

        {/* Footer Statistics */}
        <motion.div variants={itemVariants}>
          <Box
            sx={{
              mt: 4,
              p: 3,
              textAlign: "center",
              background: theme.cardBg,
              borderRadius: 3,
              border: `1px solid ${theme.primary}40`,
              boxShadow: `0 0 15px ${theme.primary}10`,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.accent,
                mb: 1,
              }}
            >
              Dashboard Statistics
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Typography variant="body2" sx={{ color: theme.text }}>
                  <strong>{filteredTransactions.length}</strong> filtered transactions
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" sx={{ color: theme.text }}>
                  Last updated: <strong>{lastUpdateTime.toLocaleTimeString()}</strong>
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" sx={{ color: theme.text }}>
                  Auto-refresh: <strong>{autoRefresh ? "ON" : "OFF"}</strong>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </motion.div>
      </motion.div>
    </Box>
  )
}

export default SignTokenDashboard
