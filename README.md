# uralcampuslib

Библиотека для взаимодействия с API Образовательного холдинга

## Установка в проект

```bash
$ npm install --save github:inucore/uralcampuslib
```

## Взаимодействие с библиотекой

На данный момент доступен только класс **ScheduleAPI**

```js
import { ScheduleAPI } from 'uralcampuslib';
const schedule = new ScheduleAPI({ institution: 'inueco' });

schedule.fetchGroups()
    .then(({ groups }) =>
        schedule.fetchGroupLessons(groups.find((group) => group.name == 'И-107').guid)
            .then(({ schedule }) =>
                console.log(`${schedule[0].date} – количество пар: ${schedule[0].lessons.length}`)
            )
    );
```

Пример использования можно найти в файле [`test.js`](test.js)
