const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const now = Date.now();
  const minutesAgo = (minutes) => new Date(now - minutes * 60 * 1000);

  await prisma.hydrant.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.incident.deleteMany();

  const incidents = await prisma.$transaction([
    prisma.incident.create({
      data: {
        title: "Soweto Market Fire - Lusaka CBD",
        type: "market_fire",
        priority: "high",
        status: "reported",
        latitude: -15.4177,
        longitude: 28.2833,
        description: "Market stalls burning near Lusaka CBD trading zone.",
      },
    }),
    prisma.incident.create({
      data: {
        title: "Vehicle Fire - Kalingalinga Road",
        type: "vehicle_fire",
        priority: "medium",
        status: "dispatched",
        dispatchedAt: minutesAgo(19),
        latitude: -15.3945,
        longitude: 28.3358,
        description: "Minibus fire reported along Kalingalinga corridor.",
      },
    }),
    prisma.incident.create({
      data: {
        title: "Bush Fire - Chilenje Outskirts",
        type: "bush_fire",
        priority: "high",
        status: "enroute",
        dispatchedAt: minutesAgo(27),
        latitude: -15.4607,
        longitude: 28.3114,
        description: "Dry grass fire spreading with seasonal winds.",
      },
    }),
    prisma.incident.create({
      data: {
        title: "Industrial Fire Alarm - Ndola Light Industry",
        type: "industrial_fire",
        priority: "critical",
        status: "on_scene",
        dispatchedAt: minutesAgo(38),
        latitude: -12.9587,
        longitude: 28.6366,
        description: "Warehouse smoke and electrical sparks in loading bay.",
      },
    }),
    prisma.incident.create({
      data: {
        title: "House Fire - Chilenje South",
        type: "house_fire",
        priority: "high",
        status: "reported",
        latitude: -15.4549,
        longitude: 28.3346,
        description: "Two-room home fire with smoke spread to adjacent structure.",
      },
    }),
    prisma.incident.create({
      data: {
        title: "Electrical Fire - Matero Residential Block",
        type: "electrical_fire",
        priority: "high",
        status: "resolved",
        dispatchedAt: minutesAgo(70),
        resolvedAt: minutesAgo(18),
        latitude: -15.3875,
        longitude: 28.2549,
        description: "Load shedding surge caused meter box ignition, now extinguished.",
      },
    }),
  ]);

  const units = await prisma.$transaction([
    prisma.unit.create({
      data: {
        name: "Lusaka Central Fire Unit",
        type: "fire",
        status: "available",
        currentLat: -15.4167,
        currentLng: 28.2833,
      },
    }),
    prisma.unit.create({
      data: {
        name: "Matero Fire Station",
        type: "fire",
        status: "dispatched",
        currentLat: -15.3876,
        currentLng: 28.2551,
      },
    }),
    prisma.unit.create({
      data: {
        name: "Kitwe Fire Response Unit",
        type: "fire",
        status: "busy",
        currentLat: -12.8024,
        currentLng: 28.2132,
      },
    }),
    prisma.unit.create({
      data: {
        name: "Lusaka Metro Police Patrol 3",
        type: "police",
        status: "available",
        currentLat: -15.4209,
        currentLng: 28.2955,
      },
    }),
    prisma.unit.create({
      data: {
        name: "Matero Police Response",
        type: "police",
        status: "available",
        currentLat: -15.3902,
        currentLng: 28.252,
      },
    }),
    prisma.unit.create({
      data: {
        name: "University Teaching Hospital EMS",
        type: "ambulance",
        status: "available",
        currentLat: -15.4304,
        currentLng: 28.3235,
      },
    }),
    prisma.unit.create({
      data: {
        name: "Chilenje Ambulance Base",
        type: "ambulance",
        status: "dispatched",
        currentLat: -15.4534,
        currentLng: 28.334,
      },
    }),
  ]);

  await prisma.hydrant.createMany({
    data: [
      {
        name: "CBD-H01 Freedom Way",
        latitude: -15.4153,
        longitude: 28.2854,
        status: "working",
      },
      {
        name: "CBD-H02 Cairo Rd",
        latitude: -15.4188,
        longitude: 28.2815,
        status: "low_pressure",
      },
      {
        name: "CBD-H03 Soweto Link",
        latitude: -15.4205,
        longitude: 28.2872,
        status: "working",
      },
      {
        name: "MTR-H01 Main Drain",
        latitude: -15.3872,
        longitude: 28.2537,
        status: "working",
      },
      {
        name: "MTR-H02 Nsansa Ward",
        latitude: -15.3913,
        longitude: 28.2581,
        status: "faulty",
      },
      {
        name: "MTR-H03 Matero East",
        latitude: -15.3844,
        longitude: 28.2619,
        status: "low_pressure",
      },
      {
        name: "CHL-H01 Chilenje Market",
        latitude: -15.4495,
        longitude: 28.3288,
        status: "working",
      },
      {
        name: "CHL-H02 Ring Road",
        latitude: -15.4556,
        longitude: 28.3331,
        status: "working",
      },
      {
        name: "CHL-H03 Chilenje South",
        latitude: -15.4601,
        longitude: 28.3398,
        status: "faulty",
      },
    ],
  });

  await prisma.assignment.createMany({
    data: [
      {
        incidentId: incidents[1].id,
        unitId: units[1].id,
      },
      {
        incidentId: incidents[2].id,
        unitId: units[2].id,
      },
      {
        incidentId: incidents[3].id,
        unitId: units[0].id,
      },
      {
        incidentId: incidents[5].id,
        unitId: units[6].id,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
