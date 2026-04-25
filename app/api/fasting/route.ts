import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activeSession = await prisma.fastingSession.findFirst({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      orderBy: {
        startTime: "desc",
      },
    });

    const sessions = await prisma.fastingSession.findMany({
      where: {
        userId: session.user.id,
        isActive: false,
      },
      orderBy: {
        startTime: "desc",
      },
      take: 10,
    });

    return NextResponse.json({ activeSession, sessions });
  } catch (error) {
    console.error("Error fetching fasting sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch fasting sessions" },
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

    const { mode } = await req.json();

    if (!mode || !["OMAD", "WARRIOR"].includes(mode)) {
      return NextResponse.json(
        { error: "Invalid fasting mode" },
        { status: 400 }
      );
    }

    // Check if there's already an active session
    const existingSession = await prisma.fastingSession.findFirst({
      where: {
        userId: session.user.id,
        isActive: true,
      },
    });

    if (existingSession) {
      return NextResponse.json(
        { error: "Already have an active fasting session" },
        { status: 400 }
      );
    }

    const fastingHours = mode === "OMAD" ? 23 : 20;
    const startTime = new Date();
    const targetEndTime = new Date(startTime.getTime() + fastingHours * 60 * 60 * 1000);

    const fastingSession = await prisma.fastingSession.create({
      data: {
        userId: session.user.id,
        mode,
        startTime,
        targetEndTime,
        isActive: true,
      },
    });

    return NextResponse.json(fastingSession, { status: 201 });
  } catch (error) {
    console.error("Error starting fasting session:", error);
    return NextResponse.json(
      { error: "Failed to start fasting session" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activeSession = await prisma.fastingSession.findFirst({
      where: {
        userId: session.user.id,
        isActive: true,
      },
    });

    if (!activeSession) {
      return NextResponse.json(
        { error: "No active fasting session" },
        { status: 400 }
      );
    }

    const endTime = new Date();
    const duration = Math.floor(
      (endTime.getTime() - activeSession.startTime.getTime()) / (1000 * 60)
    );

    const updatedSession = await prisma.fastingSession.update({
      where: {
        id: activeSession.id,
      },
      data: {
        isActive: false,
        endTime,
        duration,
      },
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error("Error stopping fasting session:", error);
    return NextResponse.json(
      { error: "Failed to stop fasting session" },
      { status: 500 }
    );
  }
}
