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
  const [pageSize, setPageSize] = useState(10) // Default to 10 for mobile
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
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
  const [latestTxHash, setLatestTxHash] = useState(null)

  const contractAddress = "0x868fced65edbf0056c4163515dd840e9f287a4c3"
  const apiKey = "I1TNIHXXCRGXRA9KXV8P6XRQR4B4F9H6XJ"

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

    if (searchTerm) {
      filtered = filtered.filter(
        (tx) =>
          tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.to.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (minAmount || maxAmount) {
      filtered = filtered.filter((tx) => {
        const amount = Number.parseInt(tx.value) / 10 ** Number.parseInt(tx.tokenDecimal)
        const min = minAmount ? Number.parseFloat(minAmount) : 0
        const max = maxAmount ? Number.parseFloat(maxAmount) : Number.POSITIVE_INFINITY
        return amount >= min && amount <= max
      })
    }

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
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal
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
      setError("")
      const response = await fetch(url)
      const data = await response.json()

      if (data.status === "1" && Array.isArray(data.result)) {
        setAllTransactions(data.result)
        const totalVol = data.result.reduce((sum, tx) => {
          return sum + Number.parseInt(tx.value) / 10 ** Number.parseInt(tx.tokenDecimal)
        }, 0)
        setTotalVolume(totalVol)

        if (data.result.length > 0 && data.result[0].hash !== latestTxHash) {
          setNotifications((prev) => prev + 1)
          setLatestTxHash(data.result[0].hash)
        }
        setLastUpdateTime(new Date())
      } else {
        console.error("API error:", data.message || "Unknown error")
        setError("Failed to fetch transactions. Please try again.")
      }
    } catch (err) {
      console.error("Error fetching transactions:", err)
      setError("Error fetching transactions. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }, [contractAddress, apiKey, latestTxHash])

  useEffect(() => {
    fetchTransactions()
    let interval
    if (autoRefresh) {
      interval = setInterval(fetchTransactions, 60000)
    }
    return () => interval && clearInterval(interval)
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
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }

  const clearNotifications = useCallback(() => {
    setNotifications(0)
  }, [])

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: theme.gradientDark,
        color: theme.text,
        p: { xs: 2, sm: 3, md: 4, lg: 6 },
        display: "flex",
        flexDirection: "column",
        maxWidth: "1600px",
        mx: "auto",
      }}
    >
      <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ flex: 1 }}>
        {/* Header Section */}
        <motion.div variants={itemVariants}>
          <Box textAlign="center" mb={{ xs: 2, sm: 3, md: 4, lg: 5 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                background: theme.gradientPrimary,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
                mb: { xs: 1, sm: 1.5, md: 2 },
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem", lg: "3rem" },
                textShadow: `0 0 8px ${theme.primary}80`,
              }}
            >
              $SIGN Transaction Dashboard
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.accent,
                mb: { xs: 1, sm: 1.5 },
                fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
              }}
            >
              Real-time blockchain analytics with advanced filtering
            </Typography>
            <Paper
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: { xs: 1, sm: 1.5 },
                p: { xs: 1, sm: 1.5, md: 2 },
                backgroundColor: theme.cardBg,
                backdropFilter: "blur(10px)",
                border: `2px solid ${theme.primary}`,
                borderRadius: 2,
                boxShadow: `0 0 15px ${theme.primary}40`,
                maxWidth: "100%",
                overflow: "hidden",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: theme.text,
                  fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: { xs: "150px", sm: "200px", md: "300px" },
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
                    "&:hover": { transform: "scale(1.1)", boxShadow: `0 0 12px ${theme.primary}` },
                  }}
                >
                  {copied ? <CheckCircle fontSize="small" /> : <ContentCopy fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Paper>
            <Typography
              variant="caption"
              sx={{ color: theme.accent, mt: 1, display: "block", fontSize: { xs: "0.7rem", sm: "0.8rem" } }}
            >
              (Track it down)
            </Typography>
          </Box>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants}>
          <Grid container spacing={{ xs: 1, sm: 1.5, md: 2, lg: 2.5 }} mb={{ xs: 2, sm: 3, md: 4, lg: 5 }}>
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
              <Grid item xs={6} sm={4} md={3} lg={2} key={index} sx={{ display: "flex" }}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{ width: "100%" }}
                >
                  <Card
                    sx={{
                      background: theme.cardBg,
                      backdropFilter: "blur(10px)",
                      border: `1px solid ${stat.color}`,
                      borderRadius: { xs: 1.5, sm: 2 },
                      textAlign: "center",
                      p: { xs: 1, sm: 1.5, md: 2 },
                      width: "100%",
                      minHeight: { xs: "100px", sm: "120px", md: "140px" },
                      boxShadow: `0 0 10px ${stat.color}30`,
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "3px",
                        background: `linear-gradient(90deg, ${stat.color}, transparent)`,
                      }}
                    />
                    <CardContent sx={{ p: { xs: 1, sm: 1.5 }, "&:last-child": { pb: { xs: 1, sm: 1.5 } } }}>
                      <motion.div
                        animate={{ rotateY: [0, 360], scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                      >
                        <stat.icon
                          sx={{
                            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                            color: stat.color,
                            mb: { xs: 0.5, sm: 1 },
                          }}
                        />
                      </motion.div>
                      <Typography
                        variant="h6"
                        sx={{
                          color: stat.color,
                          fontWeight: "bold",
                          fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.accent,
                          fontSize: { xs: "0.65rem", sm: "0.75rem", md: "0.85rem" },
                          textTransform: "uppercase",
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
              backdropFilter: "blur(10px)",
              border: `1px solid ${theme.primary}`,
              borderRadius: 2,
              p: { xs: 1.5, sm: 2, md: 3 },
              mb: { xs: 2, sm: 3, md: 4 },
              boxShadow: `0 0 15px ${theme.primary}20`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: { xs: 1, sm: 2 },
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: theme.primary,
                  fontWeight: "bold",
                  fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
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
                        "& .MuiSwitch-switchBase.Mui-checked": { color: theme.primary },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                          backgroundColor: theme.primary,
                        },
                      }}
                    />
                  }
                  label="Auto Refresh"
                  sx={{ color: theme.text, fontSize: { xs: "0.75rem", sm: "0.85rem" } }}
                />
                <Badge badgeContent={notifications} color="error" max={99}>
                  <Tooltip title="Clear notifications" arrow>
                    <IconButton
                      onClick={clearNotifications}
                      aria-label="clear notifications"
                      sx={{ color: theme.primary, "&:hover": { backgroundColor: `${theme.primary}20` } }}
                    >
                      <Notifications fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Badge>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, sm: 1.5, md: 2 },
                mb: 2,
                flexWrap: "wrap",
                justifyContent: { xs: "center", sm: "flex-start" },
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
                  px: { xs: 2, sm: 3 },
                  py: 1,
                  fontSize: { xs: "0.75rem", sm: "0.85rem" },
                  "&:hover": { transform: "translateY(-2px)", boxShadow: `0 5px 15px ${theme.primary}60` },
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
                  px: { xs: 2, sm: 3 },
                  py: 1,
                  fontSize: { xs: "0.75rem", sm: "0.85rem" },
                  "&:hover": { borderColor: theme.secondary, backgroundColor: `${theme.secondary}20` },
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
                  px: { xs: 2, sm: 3 },
                  py: 1,
                  fontSize: { xs: "0.75rem", sm: "0.85rem" },
                  "&:hover": { borderColor: theme.tertiary, backgroundColor: `${theme.tertiary}20` },
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
                  <Grid container spacing={{ xs: 1, sm: 1.5, md: 2 }}>
                    <Grid item xs={12} sm={6} md={4}>
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
                            "& fieldset": { borderColor: theme.primary },
                            "&:hover fieldset": { borderColor: theme.secondary },
                            "&.Mui-focused fieldset": { borderColor: theme.secondary },
                          },
                          "& .MuiInputLabel-root": {
                            color: theme.accent,
                            "&.Mui-focused": { color: theme.secondary },
                            fontSize: { xs: "0.8rem", sm: "0.9rem" },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                      <TextField
                        fullWidth
                        label="Min Amount"
                        type="number"
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            color: theme.text,
                            "& fieldset": { borderColor: theme.primary },
                            "&:hover fieldset": { borderColor: theme.secondary },
                            "&.Mui-focused fieldset": { borderColor: theme.secondary },
                          },
                          "& .MuiInputLabel-root": {
                            color: theme.accent,
                            "&.Mui-focused": { color: theme.secondary },
                            fontSize: { xs: "0.8rem", sm: "0.9rem" },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                      <TextField
                        fullWidth
                        label="Max Amount"
                        type="number"
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            color: theme.text,
                            "& fieldset": { borderColor: theme.primary },
                            "&:hover fieldset": { borderColor: theme.secondary },
                            "&.Mui-focused fieldset": { borderColor: theme.secondary },
                          },
                          "& .MuiInputLabel-root": {
                            color: theme.accent,
                            "&.Mui-focused": { color: theme.secondary },
                            fontSize: { xs: "0.8rem", sm: "0.9rem" },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: theme.accent, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}>
                          Sort By
                        </InputLabel>
                        <Select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          sx={{
                            color: theme.text,
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.primary },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: theme.secondary },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: theme.secondary },
                            "& .MuiSvgIcon-root": { color: theme.primary },
                            fontSize: { xs: "0.8rem", sm: "0.9rem" },
                          }}
                        >
                          <MenuItem value="timestamp">Time</MenuItem>
                          <MenuItem value="amount">Amount</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: theme.accent, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}>
                          Order
                        </InputLabel>
                        <Select
                          value={sortOrder}
                          onChange={(e) => setSortOrder(e.target.value)}
                          sx={{
                            color: theme.text,
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.primary },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: theme.secondary },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: theme.secondary },
                            "& .MuiSvgIcon-root": { color: theme.primary },
                            fontSize: { xs: "0.8rem", sm: "0.9rem" },
                          }}
                        >
                          <MenuItem value="desc">Desc</MenuItem>
                          <MenuItem value="asc">Asc</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: theme.accent, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}>
                          Per Page
                        </InputLabel>
                        <Select
                          value={pageSize}
                          onChange={(e) => {
                            setPageSize(e.target.value)
                            setCurrentPage(1)
                          }}
                          sx={{
                            color: theme.text,
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.primary },
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: theme.secondary },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: theme.secondary },
                            "& .MuiSvgIcon-root": { color: theme.primary },
                            fontSize: { xs: "0.8rem", sm: "0.9rem" },
                          }}
                        >
                          <MenuItem value={5}>5</MenuItem>
                          <MenuItem value={10}>10</MenuItem>
                          <MenuItem value={20}>20</MenuItem>
                          <MenuItem value={50}>50</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </motion.div>
              )}
            </AnimatePresence>
          </Paper>
        </motion.div>

        {/* Transaction Table */}
        <motion.div variants={itemVariants}>
          <Paper
            sx={{
              background: theme.cardBg,
              backdropFilter: "blur(10px)",
              border: `1px solid ${theme.primary}`,
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: `0 0 20px ${theme.primary}20`,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: { xs: 2, sm: 3 },
                background: `linear-gradient(90deg, ${theme.primary}20, transparent)`,
                borderBottom: `1px solid ${theme.primary}40`,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: theme.primary,
                  fontWeight: "bold",
                  fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Analytics /> Transaction Historys
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: theme.accent,
                  fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                }}
              >
                Showing {startIndex + 1} - {endIndex} of {filteredTransactions.length}
              </Typography>
            </Box>
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
                <CircularProgress sx={{ color: theme.primary }} />
                <Typography variant="body1" sx={{ color: theme.text, ml: 2, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}>
                  Fetching transactions...
                </Typography>
              </Box>
            )}
            {!loading && (
              <TableContainer sx={{ maxWidth: "100%", overflowX: "auto" }}>
                <Table sx={{ minWidth: { xs: 500, sm: 700 } }}>
                  <TableHead>
                    <TableRow
                      sx={{
                        background: theme.gradientPrimary,
                        "& th": {
                          color: "black",
                          fontWeight: "bold",
                          fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                          textTransform: "uppercase",
                          borderBottom: "none",
                          p: { xs: 1, sm: 1.5 },
                        },
                      }}
                    >
                      <TableCell>Tx Hash</TableCell>
                      <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Time</TableCell>
                      <TableCell>From</TableCell>
                      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>To</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>% of Total</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <AnimatePresence>
                      {currentTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            sx={{
                              color: theme.text,
                              textAlign: "center",
                              py: 4,
                              fontSize: { xs: "0.8rem", sm: "0.9rem" },
                            }}
                          >
                            No transactions found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentTransactions.map((tx, index) => {
                          const amount = Number.parseInt(tx.value) / 10 ** Number.parseInt(tx.tokenDecimal)
                          const percentage = (totalVolume > 0 ? (amount / totalVolume) * 100 : 0).toFixed(1)
                          const date = new Date(Number.parseInt(tx.timeStamp) * 1000).toLocaleString()
                          const isLargeTransaction = amount > avgAmount * 2 && avgAmount > 0
                          return (
                            <motion.tr
                              key={tx.hash}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ delay: index * 0.05 }}
                              style={{ display: "table-row" }}
                            >
                              <TableCell
                                sx={{
                                  color: theme.text,
                                  fontSize: { xs: "0.7rem", sm: "0.8rem" },
                                  borderBottom: `1px solid ${theme.primary}30`,
                                  p: { xs: 1, sm: 1.5 },
                                }}
                              >
                                <Link
                                  href={`https://etherscan.io/tx/${tx.hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{
                                    color: theme.primary,
                                    textDecoration: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    "&:hover": { color: theme.secondary, textDecoration: "underline" },
                                  }}
                                >
                                  <ExitToApp fontSize="small" />
                                  {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
                                </Link>
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: theme.text,
                                  fontSize: { xs: "0.7rem", sm: "0.8rem" },
                                  display: { xs: "none", sm: "table-cell" },
                                  borderBottom: `1px solid ${theme.primary}30`,
                                  p: { xs: 1, sm: 1.5 },
                                }}
                              >
                                <Typography variant="body2" sx={{ color: theme.accent }}>
                                  {date}
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: theme.text,
                                  fontSize: { xs: "0.7rem", sm: "0.8rem" },
                                  borderBottom: `1px solid ${theme.primary}30`,
                                  p: { xs: 1, sm: 1.5 },
                                }}
                              >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                  <img
                                    src="/LOG1.jpeg"
                                    alt="$SIGN Token Logo"
                                    style={{ width: 16, height: 16, marginRight: 4 }}
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
                                    {tx.from.slice(0, 5)}...{tx.from.slice(-3)}
                                  </Link>
                                  <Tooltip title="Copy address" arrow>
                                    <IconButton
                                      size="small"
                                      onClick={() => navigator.clipboard.writeText(tx.from)}
                                      sx={{ color: theme.tertiary, "&:hover": { color: theme.primary } }}
                                    >
                                      <ContentCopy fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                              <TableCell
                                sx={{
                                  color: theme.text,
                                  fontSize: { xs: "0.7rem", sm: "0.8rem" },
                                  display: { xs: "none", md: "table-cell" },
                                  borderBottom: `1px solid ${theme.primary}30`,
                                  p: { xs: 1, sm: 1.5 },
                                }}
                              >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                  <img
                                    src="/LOG1.jpeg"
                                    alt="$SIGN Token Logo"
                                    style={{ width: 16, height: 16, marginRight: 4 }}
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
                                    {tx.to.slice(0, 5)}...{tx.to.slice(-3)}
                                  </Link>
                                  <Tooltip title="Copy address" arrow>
                                    <IconButton
                                      size="small"
                                      onClick={() => navigator.clipboard.writeText(tx.to)}
                                      sx={{ color: theme.tertiary, "&:hover": { color: theme.primary } }}
                                    >
                                      <ContentCopy fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderBottom: `1px solid ${theme.primary}30`,
                                  p: { xs: 1, sm: 1.5 },
                                }}
                              >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: isLargeTransaction ? theme.warning : theme.primary,
                                      fontWeight: "bold",
                                      fontSize: { xs: "0.7rem", sm: "0.8rem" },
                                    }}
                                  >
                                    {amount.toFixed(2)} {tx.tokenSymbol}
                                  </Typography>
                                  {isLargeTransaction && (
                                    <Tooltip title="Large transaction" arrow>
                                      <Star sx={{ color: theme.warning, fontSize: 14 }} />
                                    </Tooltip>
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell
                                sx={{
                                  display: { xs: "none", md: "table-cell" },
                                  borderBottom: `1px solid ${theme.primary}30`,
                                  p: { xs: 1, sm: 1.5 },
                                }}
                              >
                                <Chip
                                  label={`${percentage}%`}
                                  sx={{
                                    background:
                                      Number.parseFloat(percentage) > 5
                                        ? `linear-gradient(45deg, ${theme.warning}, ${theme.secondary})`
                                        : theme.gradientPrimary,
                                    color: "white",
                                    fontSize: { xs: "0.65rem", sm: "0.75rem" },
                                    boxShadow: `0 0 8px ${theme.primary}40`,
                                  }}
                                />
                              </TableCell>
                              <TableCell
                                sx={{
                                  borderBottom: `1px solid ${theme.primary}30`,
                                  p: { xs: 1, sm: 1.5 },
                                }}
                              >
                                <Box sx={{ display: "flex", gap: 0.5 }}>
                                  <Tooltip title="View on Etherscan" arrow>
                                    <IconButton
                                      size="small"
                                      component="a"
                                      href={`https://etherscan.io/tx/${tx.hash}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      sx={{ color: theme.primary, "&:hover": { color: theme.secondary } }}
                                    >
                                      <Visibility fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Add to favorites (Coming Soon)" arrow>
                                    <IconButton
                                      size="small"
                                      disabled
                                      sx={{ color: theme.accent, "&:hover": { color: theme.warning } }}
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
            {totalPages > 1 && (
              <Box
                display="flex"
                justifyContent="center"
                p={{ xs: 1.5, sm: 2, md: 3 }}
                sx={{
                  background: `linear-gradient(90deg, transparent, ${theme.primary}10, transparent)`,
                  borderTop: `1px solid ${theme.primary}30`,
                }}
              >
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                  size="medium"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: theme.text,
                      fontSize: { xs: "0.7rem", sm: "0.8rem" },
                      "&:hover": {
                        backgroundColor: theme.primary,
                        color: "black",
                        transform: "scale(1.1)",
                      },
                      "&.Mui-selected": {
                        backgroundColor: theme.primary,
                        color: "black",
                        boxShadow: `0 0 10px ${theme.primary}`,
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
              mt: { xs: 2, sm: 3, md: 4 },
              p: { xs: 1.5, sm: 2, md: 3 },
              textAlign: "center",
              background: theme.cardBg,
              borderRadius: 2,
              border: `1px solid ${theme.primary}40`,
              boxShadow: `0 0 10px ${theme.primary}10`,
            }}
          >
            <Typography variant="body2" sx={{ color: theme.accent, mb: 1, fontSize: { xs: "0.7rem", sm: "0.8rem" } }}>
              Dashboard Statistics
            </Typography>
            <Grid container spacing={1} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" sx={{ color: theme.text, fontSize: { xs: "0.7rem", sm: "0.8rem" } }}>
                  <strong>{filteredTransactions.length}</strong> filtered transactions
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" sx={{ color: theme.text, fontSize: { xs: "0.7rem", sm: "0.8rem" } }}>
                  Last updated: <strong>{lastUpdateTime.toLocaleTimeString()}</strong>
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" sx={{ color: theme.text, fontSize: { xs: "0.7rem", sm: "0.8rem" } }}>
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
