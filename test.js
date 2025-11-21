import { ScheduleAPI } from './src/index.js';

/** @param {ScheduleAPI} scheduleInstitution */
async function inuecoTest(scheduleInstitution) {
    console.log("[TEST] inueco schedule");

    const group = (await scheduleInstitution.fetchGroups()).groups.find((group) => group.name == "И-107");
    const groupSchedule = (await scheduleInstitution.fetchGroupLessons(group.guid)).schedule;
    for (const day of groupSchedule) {
        console.log(`<inueco> ${day.date} [${day.day}] для ${group.name} – количество пар: ${day.lessons.length}`);
    }

    const teacher = (await scheduleInstitution.fetchTeachers()).teachers.find((teacher) => teacher.name == "Завьялов Олег Геннадьевич");
    const teacherSchedule = (await scheduleInstitution.fetchTeacherLessons(teacher.guid)).schedule;
    for (const day of teacherSchedule) {
        console.log(`<inueco> ${teacher.name} | [${day.date}] ${day.day}: количество пар – ${day.lessons.length}`);
    }
}

/** @param {ScheduleAPI} scheduleInstitution */
async function precoTest(scheduleInstitution) {
    console.log("[TEST] preco schedule");

    const group = (await scheduleInstitution.fetchGroups()).groups.find((group) => group.name == "100");
    const groupSchedule = (await scheduleInstitution.fetchGroupLessons(group.guid)).schedule;
    for (const day of groupSchedule) {
        console.log(`<preco> ${day.date} [${day.day}] для ${group.name} – количество пар: ${day.lessons.length}`);
    }

    const teacher = (await scheduleInstitution.fetchTeachers()).teachers.find((teacher) => teacher.name == "Гапчук Артём Андреевич");
    const teacherSchedule = (await scheduleInstitution.fetchTeacherLessons(teacher.guid)).schedule;
    for (const day of teacherSchedule) {
        console.log(`<preco> ${teacher.name} | [${day.date}] ${day.day}: количество пар – ${day.lessons.length}`);
    }
}

async function start() {
    await inuecoTest(new ScheduleAPI({ institution: 'inueco' }));
    await precoTest(new ScheduleAPI({ institution: 'preco' }));
}

start();