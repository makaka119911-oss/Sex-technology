# Запуск «клонирования» vsexshop.ru (этап 1)

## Про инструмент `ai-website-cloner-template`

В репозитории подключён шаблон [ai-website-cloner-template](https://github.com/JCodesMore/ai-website-cloner-template). Команды вида:

```text
/clone-website https://vsexshop.ru --component=cart
```

— это **инструкции для агента** (см. `.cursor/commands/clone-website.md`, `.claude/skills/clone-website/SKILL.md`), а не отдельный MCP-сервер в Cursor и не CLI в `package.json`. Отдельного MCP-сервера `ai-website-cloner-template` в каталоге `mcps/` проекта нет.

## Что сделано вместо автоматического браузерного клона

Для выполнения этапа 1 без доступного Browser MCP в этой сессии подготовлены **структурированные спецификации** по типовому UX российских интернет-магазинов интим-товаров (в т.ч. паттерны, характерные для крупных игроков вроде vsexshop.ru):

| Файл | Содержание |
|------|------------|
| `cart.spec.md` | Корзина: состав, количества, мини-корзина |
| `checkout.spec.md` | Оформление: контакты, адрес, итоги |
| `delivery.spec.md` | Способы доставки, расчёт стоимости |
| `order-tracking.spec.md` | Отслеживание и статусы |

Итоговый обзор для адаптации: `ANALYSIS_SUMMARY.md`.

## Как повторить полный пайплайн клона локально

1. Убедиться, что доступен Browser MCP (Playwright / Chrome и т.д.), как требует SKILL.
2. Выполнить в чате агента команды `/clone-website` с нужными URL и сохранить вывод в `docs/research/components/vsexshop/` при необходимости заменив спецификации на извлечённые с живого сайта.
