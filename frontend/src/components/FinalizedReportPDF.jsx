import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// ---------- styles ----------
const styles = StyleSheet.create({
  page: {
    padding: 30,
    border: "2px solid #000",
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
  },
  letterheadRight: {
    textAlign: "right",
    fontSize: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    borderBottom: "1px solid #000",
    paddingBottom: 5,
  },
  section: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: "1px solid #ccc",
  },
  heading: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#003366",
  },
  text: {
    fontSize: 12,
    marginBottom: 4,
  },
});

// ---------- component ----------
const FinalizedReportPDF = ({
  personalDetails = {},
  practicalScores = {},
  result = null,
}) => {
  const {
    following_instructions_score = "N/A",
    digit_span_score = "N/A",
    stroop_score = "N/A",
  } = practicalScores;

  const currentDateTime = new Date();
  const formattedDate = currentDateTime.toLocaleDateString();
  const formattedTime = currentDateTime.toLocaleTimeString();

  // Placeholder logo (replace with actual URL or base64)
  const logoSrc = "/path-to-your-logo.png"; // Can also use base64 if needed

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image style={styles.logo} src={logoSrc} />
          <View style={styles.letterheadRight}>
            <Text>NeuroAssist</Text>
            <Text>SLIIT, New Kandy Rd, Malabe</Text>
            <Text>{formattedDate}</Text>
            <Text>{formattedTime}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>NeuroAssist Diagnosis Report</Text>

        {/* Personal Details */}
        <View style={styles.section}>
          <Text style={styles.heading}>Personal Details</Text>
          {Object.entries(personalDetails).map(([key, value]) => {
            const isYes = (val) => {
              if (typeof val === "string") {
                return val.toLowerCase() === "true" || val === "1";
              }
              return Boolean(val);
            };
            const yesNo = isYes(value) ? "Yes" : "No";

            return (
              <Text key={key} style={styles.text}>
                {key.replace(/_/g, " ")}: {yesNo}
              </Text>
            );
          })}
        </View>

        {/* Practical Test Scores */}
        <View style={styles.section}>
          <Text style={styles.heading}>Practical Test Scores</Text>
          <Text style={styles.text}>
            Following Instructions Score: {following_instructions_score}%
          </Text>
          <Text style={styles.text}>Digit Span Score: {digit_span_score}</Text>
          <Text style={styles.text}>Stroop Score: {stroop_score}</Text>
        </View>

        {/* Prediction Result */}
        <View style={styles.section}>
          <Text style={styles.heading}>Prediction Result</Text>
          <Text style={styles.text}>
            {result === 1
              ? "There is a possibility of ADHD."
              : result === 0
              ? "ADHD is less likely."
              : "Result not available."}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default FinalizedReportPDF;
