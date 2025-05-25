// src/components/FinalizedReportPDF.jsx
import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// ---------- styles ----------
const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 20 },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  heading: { fontSize: 18, marginBottom: 10, fontWeight: "bold" },
  text: { fontSize: 12, marginBottom: 5 },
});

// ---------- component ----------
/**
 * @param {Object} props
 * @param {Object} props.personalDetails – all user-entered personal fields
 * @param {Object} props.practicalScores – { following_instructions_score, digit_span_score, stroop_score }
 * @param {number|null} props.result – model prediction (1 = ADHD possible, 0 = unlikely, null = N/A)
 */
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* title */}
        <Text style={styles.title}>Finalized Report</Text>

        {/* Personal Details */}
          <View style={styles.section}>
            <Text style={styles.heading}>Personal Details</Text>
            {Object.entries(personalDetails).map(([key, value]) => {
              // Convert value to boolean and then to "Yes"/"No"
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
