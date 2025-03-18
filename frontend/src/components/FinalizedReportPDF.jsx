import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  chart: {
    marginTop: 10,
    padding: 10,
    border: "1px solid #000",
  },
});

const FinalizedReportPDF = ({ data, chartData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Finalized Report</Text>
        <Text style={styles.heading}>User Details</Text>
        <Text style={styles.text}>Name: {data.name || "Not provided"}</Text>
        <Text style={styles.text}>Age: {data.age || "Not provided"}</Text>
        <Text style={styles.text}>Behavior Started Age: {data.behavior_age || "Not provided"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Performance Charts</Text>
        <View style={styles.chart}>
          {chartData.labels.map((label, index) => (
            <Text key={index} style={styles.text}>
              {label}: {chartData.scores[index]}%
            </Text>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export default FinalizedReportPDF;