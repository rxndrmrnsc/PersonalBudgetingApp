import React, { useEffect, useState, useRef } from "react";
import { Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getPrediction } from "./api/pyApi";

export default function PredictedBudgetReport({ userId, onBack }) {
    const [budgetData, setBudgetData] = useState([]);
    const [loading, setLoading] = useState(true);
    const reportRef = useRef(null);

    const handleReturn = () => {
        console.log("Returning to dashboard...");
        onBack();
    }

    useEffect(() => {
        getPrediction({ user_id: userId })
            .then(res => {
                setBudgetData(res.data.predicted_budget || []);
            })
            .catch(err => {
                console.error('Failed to fetch predicted budget:', err);
            });
        setLoading(false);
    }, [userId]);

    const downloadPDF = async () => {
        const element = reportRef.current;
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("predicted_budget_report.pdf");
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                Predicted Budget Report
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    <Box ref={reportRef}>
                        <TableContainer component={Paper} sx={{ mb: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Sub-category</TableCell>
                                        <TableCell>Predicted Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {budgetData.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.category}</TableCell>
                                            <TableCell>{item.sub_category}</TableCell>
                                            <TableCell>{item.predicted.toFixed(2)} RON</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    <Button variant="contained"
                        sx={{
                            backgroundColor: "#4f378b",
                            color: "white",
                            "&:hover": { backgroundColor: "#3d2a6d" },
                            textTransform: "none",
                            fontWeight: "bold",
                            padding: "10px 20px",
                            margin: "0 10px 20px 0",
                        }} 
                        onClick={downloadPDF}>
                        Download PDF Report
                    </Button>

                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#4f378b",
                            color: "white",
                            "&:hover": { backgroundColor: "#3d2a6d" },
                            textTransform: "none",
                            fontWeight: "bold",
                            padding: "10px 20px",
                            margin: "0 10px 20px 0",
                        }}
                        onClick={handleReturn}
                    >
                        Return
                    </Button>
                </>
            )}
        </Box>
    );
}
