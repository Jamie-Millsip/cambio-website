package com.github.jamie_millsip.backend;


import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public class Report {
    private LocalDate date;
    private String time;
    private String reportId;
    private String rentalStatus;
    private String reportStatus;

    // Constructor
    public Report(LocalDate date, LocalTime time, String reportId, String rentalStatus, String reportStatus) {
        this.date = date;
        this.time = time.format(DateTimeFormatter.ofPattern("hh:mm   a")); // e.g., "02:30 PM"
        this.reportId = reportId;
        this.rentalStatus = rentalStatus;
        this.reportStatus = reportStatus;
    }

    // Getters
    public LocalDate getDate() {
        return date;
    }

    public String getTime() {
        return time;
    }

    public String getReportId() {
        return reportId;
    }

    public String getRentalStatus() {
        return rentalStatus;
    }

    public String getReportStatus() {
        return reportStatus;
    }
}