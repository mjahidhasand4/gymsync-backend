import { prisma } from "../lib";

export const createSchedule = async (startTime: Date, endTime: Date) => {
  try {
    const newSchedule = await prisma?.schedule.create({
      data: {
        startTime,
        endTime,
      },
    });

    return newSchedule;
  } catch (error) {
    console.error("Error creating schedule:", error);
  }
};

export const assignTrainerToSchedule = async (
  scheduleId: string,
  trainerId: string
) => {
  try {
    const trainerSchedule = await prisma?.trainerSchedule.create({
      data: {
        scheduleId: scheduleId,
        trainerId: trainerId,
      },
    });

    return trainerSchedule;
  } catch (error) {
    console.log("🚀 ~ trainerSchedule error:", error);
  }
};

export const joinTraineeToSchedule = async (
  scheduleId: string,
  traineeId: string
) => {
  try {
    const scheduleTrainee = await prisma?.scheduleTrainee.create({
      data: {
        scheduleId,
        traineeId,
      },
    });

    return scheduleTrainee;
  } catch (error) {
    console.log("🚀 ~ scheduleTrainee error:", error);
  }
};

export const getSchedulesById = async (id: string) => {
  try {
    const schedules = await prisma?.schedule.findMany({
      where: {
        id,
      },
    });

    return schedules;
  } catch (error) {
    console.error("Error fetching schedules:", error);
  }
};

export const getSchedulesCountByDate = async (date: Date) => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    const classCount = await prisma?.schedule.count({
      where: {
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return classCount;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw new Error("Failed to fetch schedules.");
  }
};

export const getSchedulesByTrainerId = async (trainerId: string) => {
  try {
    const schedules = await prisma?.schedule.findMany({
      where: {
        TrainerSchedule: {
          some: {
            trainerId,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    return schedules;
  } catch (error) {
    console.error("Error fetching schedules for trainerId:", trainerId, error);
    throw new Error("Error fetching schedules");
  }
};

export const isTrainerAssignedToSchedule = async (
  scheduleId: string,
  trainerId: string
) => {
  try {
    const existingAssignment = await prisma?.trainerSchedule.findFirst({
      where: {
        scheduleId: scheduleId,
        trainerId: trainerId,
      },
    });

    return existingAssignment !== null;
  } catch (error) {
    console.error("Error checking existing assignment:", error);
  }
};

export const isTraineeJoinedToSchedule = async (
  scheduleId: string,
  traineeId: string
) => {
  try {
    const existingAssignment = await prisma?.scheduleTrainee.findFirst({
      where: {
        scheduleId,
        traineeId,
      },
    });

    return existingAssignment !== null;
  } catch (error) {
    console.error("Error checking existing assignment:", error);
  }
};

export const countTraineesForSchedule = async (scheduleId: string) => {
  try {
    const count = await prisma?.scheduleTrainee.count({
      where: { scheduleId },
    });

    return count;
  } catch (error) {
    console.error("Error counting trainees for schedule:", error);
  }
};
