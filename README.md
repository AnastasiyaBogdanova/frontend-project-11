# RSS агрегатор

[![CI](https://github.com/AnastasiyaBogdanova/frontend-project-11/actions/workflows/main.yml/badge.svg)](https://github.com/AnastasiyaBogdanova/frontend-project-11/actions/workflows/main.yml)
[![hexlet-check](https://github.com/AnastasiyaBogdanova/frontend-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/AnastasiyaBogdanova/frontend-project-11/actions)

Сервис для агрегации RSS-потоков: добавляйте неограниченное количество лент, приложение само обновляет их и собирает новые записи в общий поток.

Учебный проект Хекслета: https://ru.hexlet.io/programs/frontend

Как это должно работать: https://files.hexlet.app/a/n1wvjd

## Демо

🔗 https://frontend-project-11-one-eta.vercel.app

## Стек

- JavaScript (промисы, без `async/await` по условиям проекта)
- Vite
- Tailwind CSS
- DOM API

## Установка

```bash
git clone https://github.com/AnastasiyaBogdanova/frontend-project-11.git
cd frontend-project-11
make install
```

## Использование

Запуск dev-сервера:

```bash
make dev
```

Приложение откроется на http://localhost:5173/

Продакшен-сборка:

```bash
make build
make preview
```

## Доступные команды `make`

| Команда | Описание |
|---|---|
| `make install` | Установка зависимостей |
| `make dev` | Запуск dev-сервера Vite |
| `make build` | Сборка продакшен-бандла в `dist/` |
| `make preview` | Локальный просмотр собранного бандла |
| `make lint` | Запуск линтера oxlint |

---

<details>
<summary>Автоматические тесты Хекслета</summary>

Тесты запускаются на каждый коммит. За запуск отвечает файл `.github/workflows/hexlet-check.yml` — не удаляйте и не переименовывайте ни его, ни репозиторий.

</details>

## О Хекслете

[Хекслет](https://ru.hexlet.io/) — школа программирования: авторские программы обучения с практикой, поддержкой наставников и реальными проектами, которые остаются в резюме. Этот репозиторий — один из таких проектов.