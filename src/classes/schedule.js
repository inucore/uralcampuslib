const BASE_URLS = {
    inueco: {
        groups: "https://rasp.ural-campus.ru/api/schedule/university/groups",
        teachers: "https://rasp.ural-campus.ru/api/schedule/university/teachers",
        groupLessons: (groupID, dateBegin, dateEnd) => `https://rasp.ural-campus.ru/api/schedule/university/group/${groupID}?datebegin=${dateBegin}&dateend=${dateEnd}`,
        teacherLessons: (teacherID, dateBegin, dateEnd) => `https://rasp.ural-campus.ru/api/schedule/university/teacher/${teacherID}?datebegin=${dateBegin}&dateend=${dateEnd}`,
    },
    preco: {
        groups: "https://rasp.ural-campus.ru/api/schedule/college/groups",
        teachers: "https://rasp.ural-campus.ru/api/schedule/college/teachers",
        groupLessons: (groupID, dateBegin, dateEnd) => `https://rasp.ural-campus.ru/api/schedule/college/group/${groupID}?datebegin=${dateBegin}&dateend=${dateEnd}`,
        teacherLessons: (teacherID, dateBegin, dateEnd) => `https://rasp.ural-campus.ru/api/schedule/college/teacher/${teacherID}?datebegin=${dateBegin}&dateend=${dateEnd}`,
    },
};

import { ProxyAgent } from 'undici';

class ScheduleAPI {
    /**
     * Creates an instance of the ScheduleAPI class
     * @param {{ institution: keyof typeof BASE_URLS, proxy?: string | ProxyAgent.Options }} options The institution to use for fetching schedule data
     */
    constructor(options) {
        if (!options.institution) throw new Error("Institution is required");
        if (!BASE_URLS[options.institution]) throw new Error("Invalid institution provided");
        if (options.proxy) this.proxyAgent = new ProxyAgent(options.proxy);
        this.institution = options.institution;
    }

    /**
     * Fetches the list of groups for the specified institution
     * @returns {Promise<{ groups: readonly { guid: string, name: string }[] }>}
     */
    async fetchGroups() {
        const initOptions = this.proxyAgent ? { dispatcher: this.proxyAgent } : {};
        const response = await fetch(BASE_URLS[this.institution].groups, initOptions);
        if (!response.ok) throw new Error(`Failed to fetch groups: ${response.statusText}`);

        const data = await response.json();
        if (data.code != 200 || data.error.length > 0)
            throw new Error(`Error fetching groups: ${data.error.join(", ")} (API code: ${data.code})`);

        return data.message;
    }

    /**
     * Fetches the list of teachers for the specified institution
     * @returns {Promise<{ teachers: readonly { guid: string, name: string }[] }>}
     */
    async fetchTeachers() {
        const initOptions = this.proxyAgent ? { dispatcher: this.proxyAgent } : {};
        const response = await fetch(BASE_URLS[this.institution].teachers, initOptions);
        if (!response.ok) throw new Error(`Failed to fetch teachers: ${response.statusText}`);

        const data = await response.json();
        if (data.code != 200 || data.error.length > 0)
            throw new Error(`Error fetching teachers: ${data.error.join(", ")} (API code: ${data.code})`);

        return data.message;
    }

    /**
     * Fetches the lessons for a specific group within a date range
     * @param {string} groupID
     * @param {string} dateBegin
     * @param {string} dateEnd
     * @returns {Promise<{ guid: string, schedule: readonly { date: string, day: string, lessons: { addition: string[], type: string, name: string, classroom: string, buildings: string, timewindow: { timebegin: string, timeend: string, description: string } }[] }[] }>}
     */
    async fetchGroupLessons(groupID, dateBegin, dateEnd) {
        if (!groupID) throw new Error("Group GUID is required");
        if (!dateBegin) {
            let date = new Date();
            dateBegin = `${date.getDate() < 10 ? '0' : ''}${date.getDate()}-${(date.getMonth() + 1) < 10 ? '0' : ''}${date.getMonth() + 1}-${date.getFullYear()}`;
        }
        if (!dateEnd) {
            let date = new Date();
            date.setDate(date.getDate() + 7);
            dateEnd = `${date.getDate() < 10 ? '0' : ''}${date.getDate()}-${(date.getMonth() + 1) < 10 ? '0' : ''}${date.getMonth() + 1}-${date.getFullYear()}`;
        }

        const initOptions = this.proxyAgent ? { dispatcher: this.proxyAgent } : {};
        const response = await fetch(BASE_URLS[this.institution].groupLessons(groupID, dateBegin, dateEnd), initOptions);
        if (!response.ok) throw new Error(`Failed to fetch group lessons: ${response.statusText}`);

        const data = await response.json();
        if (data.code != 200 || data.error.length > 0)
            throw new Error(`Error fetching groups: ${data.error.join(", ")} (API code: ${data.code})`);

        return data.message;
    }

    /**
     * Fetches the lessons for a specific teacher within a date range
     * @param {string} teacherID
     * @param {string} dateBegin
     * @param {string} dateEnd
     * @returns {Promise<{ guid: string, schedule: readonly { date: string, day: string, lessons: { addition: string[], type: string, name: string, classroom: string, buildings: string, timewindow: { timebegin: string, timeend: string, description: string } }[] }[] }>}
     */
    async fetchTeacherLessons(teacherID, dateBegin, dateEnd) {
        if (!teacherID) throw new Error("Teacher GUID is required");
        if (!dateBegin) {
            let date = new Date();
            dateBegin = `${date.getDate() < 10 ? '0' : ''}${date.getDate()}-${(date.getMonth() + 1) < 10 ? '0' : ''}${date.getMonth() + 1}-${date.getFullYear()}`;
        }
        if (!dateEnd) {
            let date = new Date();
            date.setDate(date.getDate() + 7);
            dateEnd = `${date.getDate() < 10 ? '0' : ''}${date.getDate()}-${(date.getMonth() + 1) < 10 ? '0' : ''}${date.getMonth() + 1}-${date.getFullYear()}`;
        }

        const initOptions = this.proxyAgent ? { dispatcher: this.proxyAgent } : {};
        const response = await fetch(BASE_URLS[this.institution].teacherLessons(teacherID, dateBegin, dateEnd), initOptions);
        if (!response.ok) throw new Error(`Failed to fetch teacher lessons: ${response.statusText}`);

        const data = await response.json();
        if (data.code != 200 || data.error.length > 0)
            throw new Error(`Error fetching groups: ${data.error.join(", ")} (API code: ${data.code})`);

        return data.message;
    }
}

export default ScheduleAPI;