import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "30");

    const weightLogs = await prisma.weightLog.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: "desc",
      },
      take: limit,
    });

    // Calculate stats
    const stats = await prisma.weightLog.aggregate({
      where: {
        userId: session.user.id,
      },
      _min: {
        weight: true,
      },
      _max: {
        weight: true,
      },
      _avg: {
        weight: true,
      },
    });

    const firstLog = await prisma.weightLog.findFirst({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: "asc",
      },
    });

    const latestLog = await prisma.weightLog.findFirst({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: "desc",
      },
    });

    const totalChange =
      firstLog && latestLog ? latestLog.weight - firstLog.weight : 0;

    return NextResponse.json({
      weightLogs,
      stats: {
        min: stats._min.weight,
        max: stats._max.weight,
        avg: stats._avg.weight,
        totalChange,
        firstWeight: firstLog?.weight,
        latestWeight: latestLog?.weight,
      },
    });
  } catch (error) {
    console.error("Error fetching weight logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch weight logs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { weight, date, notes } = await req.json();

    if (!weight || typeof weight !== "number" || weight <= 0) {
      return NextResponse.json(
        { error: "Valid weight is required" },
        { status: 400 }
      );
    }

    const logDate = date ? new Date(date) : new Date();

    // Check if entry already exists for this date
    const existingEntry = await prisma.weightLog.findFirst({
      where: {
        userId: session.user.id,
        date: {
          gte: new Date(logDate.setHours(0, 0, 0, 0)),
          lt: new Date(logDate.setHours(23, 59, 59, 999)),
        },
      },
    });

    let weightLog;

    if (existingEntry) {
      // Update existing entry
      weightLog = await prisma.weightLog.update({
        where: {
          id: existingEntry.id,
        },
        data: {
          weight,
          notes: notes || existingEntry.notes,
        },
      });
    } else {
      // Create new entry
      weightLog = await prisma.weightLog.create({
        data: {
          userId: session.user.id,
          weight,
          date: logDate,
          notes: notes || null,
        },
      });
    }

    return NextResponse.json(weightLog, { status: 201 });
  } catch (error) {
    console.error("Error creating weight log:", error);
    return NextResponse.json(
      { error: "Failed to create weight log" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Weight log ID is required" },
        { status: 400 }
      );
    }

    // Verify the log belongs to the user
    const existingLog = await prisma.weightLog.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingLog) {
      return NextResponse.json(
        { error: "Weight log not found" },
        { status: 404 }
      );
    }

    await prisma.weightLog.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting weight log:", error);
    return NextResponse.json(
      { error: "Failed to delete weight log" },
      { status: 500 }
    );
  }
}
