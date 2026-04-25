import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "all"; // 'all', 'fasting', 'weight'

    const workbook = XLSX.utils.book_new();

    // Fetch fasting sessions
    if (type === "all" || type === "fasting") {
      const fastingSessions = await prisma.fastingSession.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          startTime: "desc",
        },
      });

      const fastingData = fastingSessions.map((session) => ({
        Date: session.startTime.toISOString().split("T")[0],
        Mode: session.mode,
        "Start Time": session.startTime.toISOString(),
        "End Time": session.endTime?.toISOString() || "In Progress",
        "Target Duration (hours)": session.mode === "OMAD" ? 23 : 20,
        "Actual Duration (minutes)": session.duration || "N/A",
        Status: session.isActive ? "Active" : "Completed",
      }));

      const fastingSheet = XLSX.utils.json_to_sheet(fastingData);
      XLSX.utils.book_append_sheet(workbook, fastingSheet, "Fasting Sessions");
    }

    // Fetch weight logs
    if (type === "all" || type === "weight") {
      const weightLogs = await prisma.weightLog.findMany({
        where: {
          userId: session.user.id,
        },
        orderBy: {
          date: "desc",
        },
      });

      const weightData = weightLogs.map((log) => ({
        Date: log.date.toISOString().split("T")[0],
        Weight: log.weight,
        Notes: log.notes || "",
      }));

      const weightSheet = XLSX.utils.json_to_sheet(weightData);
      XLSX.utils.book_append_sheet(workbook, weightSheet, "Weight Logs");

      // Add summary stats
      if (weightLogs.length > 0) {
        const weights = weightLogs.map((log) => log.weight);
        const stats = {
          "Total Entries": weightLogs.length,
          "Starting Weight": weights[weights.length - 1],
          "Latest Weight": weights[0],
          "Minimum Weight": Math.min(...weights),
          "Maximum Weight": Math.max(...weights),
          "Average Weight": weights.reduce((a, b) => a + b, 0) / weights.length,
          "Total Change": weights[0] - weights[weights.length - 1],
        };

        const statsSheet = XLSX.utils.json_to_sheet([stats]);
        XLSX.utils.book_append_sheet(workbook, statsSheet, "Weight Stats");
      }
    }

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Return as downloadable file
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="fasting-data-${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Error exporting data:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
